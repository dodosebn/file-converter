import multer from "multer";
import fs from "fs";
import path from "path";
import { prisma } from "../lib/prisma";
import { Request, Response, Router } from "express";
import { auth, AuthRequest } from "../service/auth";
const router = Router();

const upload = multer({
  dest: path.join(process.cwd(), "tmp"),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post(
  "/upload",
  auth,
  upload.single("file"),
  async (req: AuthRequest, res: Response) => {
    try {
      const file = req.file;
      if (!file) return res.status(400).send("No file uploaded");
      let targetType;

      const fileType = path.extname(file.originalname).slice(1).toLowerCase();
      if (["doc", "docx", "xls", "xlsx"].includes(fileType)) {
        targetType = "pdf";
      } else if (fileType === "pdf") {
        targetType = req.body.convertTo;
      } else if (["jpg", "png", "jpeg"].includes(fileType)) {
        targetType = "pdf";
      } else {
        throw new Error("Unsupported file type");
      }

      const storedName = `${Date.now()}-${file.originalname}`;
      const tmpPath = path.join(process.cwd(), "tmp", storedName);
      fs.renameSync(file.path, tmpPath);

      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      const finalPath = path.join(uploadDir, storedName);
      fs.renameSync(tmpPath, finalPath);

      const dbFile = await prisma.filesToConvert.create({
        data: {
          userId: req.userId!,
          originalName: file.originalname,
          storedName,
          fileType,
          targetType,
          status: "pending",
        },
      });

      res.json({ message: "File uploaded!", file: dbFile });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  },
);

router.get("/history", auth, async (req: AuthRequest, res: Response) => {
  const files = await prisma.filesToConvert.findMany({
    where: { userId: req.userId },
    orderBy: { createdAt: "desc" },
  });
  res.json(files);
});

router.delete("/file/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const fileId = parseInt(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    );
    const file = await prisma.filesToConvert.findUnique({
      where: { id: fileId },
    });
    if (!file || file.userId !== req.userId)
      return res.status(404).send("File not found");

    const filePath = path.join(process.cwd(), "uploads", file.storedName);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.filesToConvert.delete({ where: { id: fileId } });
    res.json({ message: "File deleted permanently" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default router;
