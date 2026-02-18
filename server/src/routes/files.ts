import multer from "multer";
import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { randomBytes } from "crypto";
import { prisma } from "../lib/prisma";
import { Response, Router } from "express";
import { auth, AuthRequest } from "../middleware/auth";
import libre from "libreoffice-convert";
import sharp from "sharp";
import PDFDocument from "pdfkit";

const router = Router();

const upload = multer({
  dest: path.join(process.cwd(), "tmp"),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["doc", "docx", "xls", "xlsx", "pdf", "jpg", "png", "jpeg"];
    const ext = path.extname(file.originalname).slice(1).toLowerCase();

    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Unsupported file type"));
  },
});

const getStoredName = (originalName: string) =>
  `${Date.now()}-${randomBytes(8).toString("hex")}-${originalName}`;

const convertOfficeToPDF = async (inputPath: string, outputPath: string) => {
  try {
    const inputBuf = await fs.readFile(inputPath);

    await new Promise<void>((resolve, reject) => {
      libre.convert(
        inputBuf,
        ".pdf",
        undefined,
        async (err: any, done: Buffer) => {
          if (err) {
            console.error("LibreOffice conversion error:", err);
            return reject(err);
          }

          try {
            await fs.writeFile(outputPath, done);
            resolve();
          } catch (writeErr) {
            reject(writeErr);
          }
        },
      );
    });
  } catch (err) {
    console.error("convertOfficeToPDF failed:", err);
    throw err;
  }
};

const convertPDFToOffice = async (
  inputPath: string,
  outputPath: string,
  format: string,
) => {
  try {
    const inputBuf = await fs.readFile(inputPath);
    const ext = format === "doc" ? ".doc" : ".docx";

    await new Promise<void>((resolve, reject) => {
      libre.convert(
        inputBuf,
        ext,
        undefined,
        async (err: any, done: Buffer) => {
          if (err) {
            console.error("LibreOffice conversion error:", err);
            return reject(err);
          }

          try {
            await fs.writeFile(outputPath, done);
            resolve();
          } catch (writeErr) {
            reject(writeErr);
          }
        },
      );
    });
  } catch (err) {
    console.error("convertPDFToOffice failed:", err);
    throw err;
  }
};

const convertImageToPDF = async (inputPath: string, outputPath: string) => {
  try {
    const imageBuffer = await fs.readFile(inputPath);
    const metadata = await sharp(imageBuffer).metadata();

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({
        size: [metadata.width || 595, metadata.height || 842],
        margin: 0,
      });

      const stream = fsSync.createWriteStream(outputPath);

      doc.pipe(stream);

      doc.image(imageBuffer, 0, 0, {
        width: metadata.width,
        height: metadata.height,
      });

      doc.end();

      stream.on("finish", () => resolve());
      stream.on("error", (err) => reject(err));
    });
  } catch (err) {
    console.error("convertImageToPDF failed:", err);
    throw err;
  }
};

const logDebug = (msg: string) => {
  const logLine = `[${new Date().toISOString()}] ${msg}\n`;
  console.log(msg);
  try {
    fsSync.appendFileSync(
      path.join(process.cwd(), "server-debug.log"),
      logLine,
    );
  } catch (e) {
  }
};

router.post(
  "/upload",
  auth,
  (req, res, next) => {
    logDebug("Request received at /upload");
    const uploadMiddleware = upload.single("file");
    uploadMiddleware(req, res, (err: any) => {
      if (err) {
        logDebug(`Multer error: ${err.message}`);
        return res.status(400).json({ message: `Multer error: ${err.message}` });
      }
      next();
    });
  },
  async (req: AuthRequest, res: Response) => {
    let tmpPath: string | null = null;
    let convertedPath: string | null = null;

    try {
      logDebug("Processing upload request");
      const file = req.file;

      if (!file) {
        logDebug("No file in req.file");
        return res.status(400).json({ message: "No file uploaded" });
      }

      logDebug(
        `Uploaded file: ${file.originalname}, path: ${file.path}, size: ${file.size}`,
      );

      const sanitizedOriginalName = path.basename(file.originalname);
      const fileType = path
        .extname(sanitizedOriginalName)
        .slice(1)
        .toLowerCase();

      const convertTo = req.body.convertTo?.toLowerCase();

      logDebug(`File type: ${fileType}`);
      logDebug(`Convert to: ${convertTo}`);

      const tmpDir = path.join(process.cwd(), "tmp");
      if (!fsSync.existsSync(tmpDir)) {
        fsSync.mkdirSync(tmpDir, { recursive: true });
      }

      tmpPath = path.join(tmpDir, getStoredName(sanitizedOriginalName));

      if (!fsSync.existsSync(file.path)) {
        logDebug(`File not found at ${file.path}`);
        throw new Error("Uploaded file not found on disk");
      }

      await fs.rename(file.path, tmpPath);
      logDebug(`Moved file to ${tmpPath}`);

      const uploadDir = path.join(process.cwd(), "uploads");
      if (!fsSync.existsSync(uploadDir)) {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      let targetType = "";

      if (["doc", "docx", "xls", "xlsx"].includes(fileType)) {
        targetType = "pdf";

        const outputName = getStoredName(
          sanitizedOriginalName.replace(/\.[^.]+$/, ".pdf"),
        );

        convertedPath = path.join(uploadDir, outputName);

        logDebug(`Converting Office to PDF: ${tmpPath} -> ${convertedPath}`);
        await convertOfficeToPDF(tmpPath, convertedPath);
      } else if (["jpg", "png", "jpeg"].includes(fileType)) {
        targetType = "pdf";

        const outputName = getStoredName(
          sanitizedOriginalName.replace(/\.[^.]+$/, ".pdf"),
        );

        convertedPath = path.join(uploadDir, outputName);

        logDebug(`Converting Image to PDF: ${tmpPath} -> ${convertedPath}`);
        await convertImageToPDF(tmpPath, convertedPath);
      } else if (fileType === "pdf") {
        if (!convertTo || !["doc", "docx"].includes(convertTo)) {
          return res
            .status(400)
            .json({ message: "For PDF files, convertTo must be 'doc' or 'docx'" });
        }

        targetType = convertTo;

        const outputName = getStoredName(
          sanitizedOriginalName.replace(/\.pdf$/, `.${convertTo}`),
        );

        convertedPath = path.join(uploadDir, outputName);

        logDebug(`Converting PDF to Office: ${tmpPath} -> ${convertedPath}`);
        await convertPDFToOffice(tmpPath, convertedPath, convertTo);
      } else {
        logDebug("Unsupported file type");
        return res.status(400).json({ message: "Unsupported file type" });
      }

      if (tmpPath && fsSync.existsSync(tmpPath)) {
        await fs.unlink(tmpPath);
      }

      const dbFile = await prisma.filesToConvert.create({
        data: {
          userId: req.userId!,
          originalName: sanitizedOriginalName,
          storedName: path.basename(convertedPath!),
          fileType,
          targetType,
          status: "completed",
        },
      });

      logDebug("Conversion completed successfully");

      return res.json({
        message: "File uploaded and converted!",
        file: {
          ...dbFile,
          downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${dbFile.storedName}`,
        },
      });
    } catch (err: any) {
      logDebug(`Upload/conversion error: ${err.message}`);
      if (err.stack) logDebug(err.stack);
      console.error("Upload/conversion error:", err);

      try {
        if (tmpPath && fsSync.existsSync(tmpPath)) {
          await fs.unlink(tmpPath);
        }
        if (convertedPath && fsSync.existsSync(convertedPath)) {
          await fs.unlink(convertedPath);
        }
      } catch (cleanupErr) {
        console.error("Cleanup error:", cleanupErr);
      }

      if (err.message === "Unsupported file type") {
        return res.status(400).json({ message: err.message });
      }

      return res.status(500).json({ message: "Server error during file conversion" });
    }
  },
);

router.get("/history", auth, async (req: AuthRequest, res: Response) => {
  try {
    const files = await prisma.filesToConvert.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    const enrichedFiles = files.map((file) => ({
      ...file,
      downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${file.storedName}`,
    }));

    return res.json(enrichedFiles);
  } catch (err) {
    console.error("History fetch error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/file/:id", auth, async (req: AuthRequest, res: Response) => {
  try {
    const fileId = parseInt(
      Array.isArray(req.params.id) ? req.params.id[0] : req.params.id,
    );

    if (isNaN(fileId)) return res.status(400).json({ message: "Invalid file ID" });

    const file = await prisma.filesToConvert.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== req.userId) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(process.cwd(), "uploads", file.storedName);

    if (fsSync.existsSync(filePath)) {
      await fs.unlink(filePath);
    }

    await prisma.filesToConvert.delete({ where: { id: fileId } });

    return res.json({ message: "File deleted permanently" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
