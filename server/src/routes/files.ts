import multer from "multer";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import { Response, Router } from "express";
import { auth, AuthRequest } from "../service/auth";

const router = Router();

const upload = multer({
  dest: path.join(process.cwd(), "tmp"),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["doc", "docx", "xls", "xlsx", "pdf", "jpg", "png", "jpeg"];
    const ext = path.extname(file.originalname).slice(1).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  },
});

router.post(
  "/upload",
  auth,
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    let tmpPath: string | null = null;
    let finalPath: string | null = null;

    try {
      const file = req.file;
      if (!file) {
        return res.status(400).send("No file uploaded");
      }

      const sanitizedOriginalName = path.basename(file.originalname);
      const fileType = path.extname(sanitizedOriginalName).slice(1).toLowerCase();

      let targetType;
      if (["doc", "docx", "xls", "xlsx"].includes(fileType)) {
        targetType = "pdf";
      } else if (fileType === "pdf") {
        targetType = req.body.convertTo;
        if (!targetType || !["doc", "docx", "jpg", "png"].includes(targetType)) {
          return res.status(400).send("Invalid or missing convertTo parameter");
        }
      } else if (["jpg", "png", "jpeg"].includes(fileType)) {
        targetType = "pdf";
      } else {
        return res.status(400).send("Unsupported file type");
      }

      const uniqueSuffix = `${Date.now()}-${randomBytes(8).toString("hex")}`;
      const storedName = `${uniqueSuffix}-${sanitizedOriginalName}`;
      tmpPath = path.join(process.cwd(), "tmp", storedName);

      await fs.rename(file.path, tmpPath);

      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fsSync.existsSync(uploadDir)) {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      finalPath = path.join(uploadDir, storedName);
      await fs.rename(tmpPath, finalPath);
      tmpPath = null;

      const dbFile = await prisma.filesToConvert.create({
        data: {
          userId: req.userId!,
          originalName: sanitizedOriginalName,
          storedName,
          fileType,
          targetType,
          status: "pending",
        },
      });

      return res.json({ message: "File uploaded!", file: dbFile });
    } catch (err) {
      console.error("Upload error:", err);

      try {
        if (tmpPath && fsSync.existsSync(tmpPath)) {
          await fs.unlink(tmpPath);
        }
        if (finalPath && fsSync.existsSync(finalPath)) {
          await fs.unlink(finalPath);
        }
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }

      if (err instanceof Error && err.message === "Unsupported file type") {
        return res.status(400).send(err.message);
      }

      return res.status(500).send("Server error");
    }
  }
);

router.get("/history", auth, async (req: AuthRequest, res: Response) => {
  try {
    const files = await prisma.filesToConvert.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });
    return res.json(files);
  } catch (err) {
    console.error("History fetch error:", err);
    return res.status(500).send("Server error");
  }
});

router.delete("/file/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const fileId = parseInt(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    );

    if (isNaN(fileId)) {
      return res.status(400).send("Invalid file ID");
    }

    const file = await prisma.filesToConvert.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== req.userId) {
      return res.status(404).send("File not found");
    }

    const filePath = path.join(process.cwd(), "uploads", file.storedName);
    
    try {
      if (fsSync.existsSync(filePath)) {
        await fs.unlink(filePath);
      }
    } catch (fileErr) {
      console.error("File deletion error:", fileErr);
      // Continue to delete DB record even if file deletion fails
    }

    await prisma.filesToConvert.delete({ where: { id: fileId } });

    return res.json({ message: "File deleted permanently" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;