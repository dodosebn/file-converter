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

// Helper: get final converted filename
const getStoredName = (originalName: string) =>
  `${Date.now()}-${randomBytes(8).toString("hex")}-${originalName}`;

// Helper: convert office files to PDF
const convertOfficeToPDF = async (inputPath: string, outputPath: string) => {
  const inputBuf = await fs.readFile(inputPath);
  return new Promise<void>((resolve, reject) => {
    libre.convert(inputBuf, ".pdf", undefined, async (err: any, done: Buffer) => {
      if (err) return reject(err);
      await fs.writeFile(outputPath, done);
      resolve();
    });
  });
};

// Helper: convert PDF to office formats
const convertPDFToOffice = async (inputPath: string, outputPath: string, format: string) => {
  const inputBuf = await fs.readFile(inputPath);
  const ext = format === "doc" ? ".doc" : ".docx";
  return new Promise<void>((resolve, reject) => {
    libre.convert(inputBuf, ext, undefined, async (err: any, done: Buffer) => {
      if (err) return reject(err);
      await fs.writeFile(outputPath, done);
      resolve();
    });
  });
};

// Helper: convert image to PDF
const convertImageToPDF = async (inputPath: string, outputPath: string) => {
  const imageBuffer = await fs.readFile(inputPath);
  const metadata = await sharp(imageBuffer).metadata();
  
  const doc = new PDFDocument({
    size: [metadata.width || 595, metadata.height || 842],
    margin: 0,
  });
  
  doc.pipe(fsSync.createWriteStream(outputPath));
  doc.image(imageBuffer, 0, 0, { width: metadata.width, height: metadata.height });
  doc.end();
  
  return new Promise<void>((resolve, reject) => {
    doc.on("finish", resolve);
    doc.on("error", reject);
  });
};

router.post("/upload", auth, upload.single("file"), async (req: AuthRequest, res: Response) => {
  let tmpPath: string | null = null;
  let convertedPath: string | null = null;

  try {
    const file = req.file;
    if (!file) return res.status(400).send("No file uploaded");

    const sanitizedOriginalName = path.basename(file.originalname);
    const fileType = path.extname(sanitizedOriginalName).slice(1).toLowerCase();
    const convertTo = req.body.convertTo?.toLowerCase();

    tmpPath = path.join(process.cwd(), "tmp", getStoredName(sanitizedOriginalName));
    await fs.rename(file.path, tmpPath);

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fsSync.existsSync(uploadDir)) await fs.mkdir(uploadDir, { recursive: true });

    // Determine target type and output filename
    let targetType: string = "";
    
    if (["doc", "docx", "xls", "xlsx"].includes(fileType)) {
      targetType = "pdf";
      const outputName = getStoredName(sanitizedOriginalName.replace(/\.[^.]+$/, ".pdf"));
      convertedPath = path.join(uploadDir, outputName);
      await convertOfficeToPDF(tmpPath, convertedPath);
      
    } else if (["jpg", "png", "jpeg"].includes(fileType)) {
      targetType = "pdf";
      const outputName = getStoredName(sanitizedOriginalName.replace(/\.[^.]+$/, ".pdf"));
      convertedPath = path.join(uploadDir, outputName);
      await convertImageToPDF(tmpPath, convertedPath);
      
    } else if (fileType === "pdf") {
      if (!convertTo || !["doc", "docx"].includes(convertTo)) {
        return res.status(400).send("For PDF files, convertTo must be 'doc' or 'docx'");
      }
      targetType = convertTo;
      const outputName = getStoredName(sanitizedOriginalName.replace(/\.pdf$/, `.${convertTo}`));
      convertedPath = path.join(uploadDir, outputName);
      await convertPDFToOffice(tmpPath, convertedPath, convertTo);
      
    } else {
      return res.status(400).send("Unsupported file type");
    }

    // Cleanup tmp file
    if (fsSync.existsSync(tmpPath)) await fs.unlink(tmpPath);

    // Save DB record
    const dbFile = await prisma.filesToConvert.create({
      data: {
        userId: req.userId!,
        originalName: sanitizedOriginalName,
        storedName: path.basename(convertedPath),
        fileType,
        targetType,
        status: "completed",
      },
    });

    return res.json({ message: "File uploaded and converted!", file: dbFile });
  } catch (err) {
    console.error("Upload/conversion error:", err);

    // Cleanup
    try {
      if (tmpPath && fsSync.existsSync(tmpPath)) await fs.unlink(tmpPath);
      if (convertedPath && fsSync.existsSync(convertedPath)) await fs.unlink(convertedPath);
    } catch (cleanupErr) {
      console.error("Cleanup error:", cleanupErr);
    }

    if (err instanceof Error && err.message === "Unsupported file type") {
      return res.status(400).send(err.message);
    }

    return res.status(500).send("Server error");
  }
});

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
    const fileId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
    if (isNaN(fileId)) return res.status(400).send("Invalid file ID");

    const file = await prisma.filesToConvert.findUnique({ where: { id: fileId } });
    if (!file || file.userId !== req.userId) return res.status(404).send("File not found");

    const filePath = path.join(process.cwd(), "uploads", file.storedName);
    if (fsSync.existsSync(filePath)) await fs.unlink(filePath);

    await prisma.filesToConvert.delete({ where: { id: fileId } });
    return res.json({ message: "File deleted permanently" });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).send("Server error");
  }
});

export default router;