"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const crypto_1 = require("crypto");
const prisma_1 = require("../lib/prisma");
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const libreoffice_convert_1 = __importDefault(require("libreoffice-convert"));
const sharp_1 = __importDefault(require("sharp"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: path_1.default.join(process.cwd(), "tmp"),
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ["doc", "docx", "xls", "xlsx", "pdf", "jpg", "png", "jpeg"];
        const ext = path_1.default.extname(file.originalname).slice(1).toLowerCase();
        if (allowed.includes(ext))
            cb(null, true);
        else
            cb(new Error("Unsupported file type"));
    },
});
const getStoredName = (originalName) => `${Date.now()}-${(0, crypto_1.randomBytes)(8).toString("hex")}-${originalName}`;
const convertOfficeToPDF = (inputPath, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputBuf = yield promises_1.default.readFile(inputPath);
        yield new Promise((resolve, reject) => {
            libreoffice_convert_1.default.convert(inputBuf, ".pdf", undefined, (err, done) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.error("LibreOffice conversion error:", err);
                    return reject(err);
                }
                try {
                    yield promises_1.default.writeFile(outputPath, done);
                    resolve();
                }
                catch (writeErr) {
                    reject(writeErr);
                }
            }));
        });
    }
    catch (err) {
        console.error("convertOfficeToPDF failed:", err);
        throw err;
    }
});
const convertPDFToOffice = (inputPath, outputPath, format) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inputBuf = yield promises_1.default.readFile(inputPath);
        const ext = format === "doc" ? ".doc" : ".docx";
        yield new Promise((resolve, reject) => {
            libreoffice_convert_1.default.convert(inputBuf, ext, undefined, (err, done) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.error("LibreOffice conversion error:", err);
                    return reject(err);
                }
                try {
                    yield promises_1.default.writeFile(outputPath, done);
                    resolve();
                }
                catch (writeErr) {
                    reject(writeErr);
                }
            }));
        });
    }
    catch (err) {
        console.error("convertPDFToOffice failed:", err);
        throw err;
    }
});
const convertImageToPDF = (inputPath, outputPath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageBuffer = yield promises_1.default.readFile(inputPath);
        const metadata = yield (0, sharp_1.default)(imageBuffer).metadata();
        yield new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({
                size: [metadata.width || 595, metadata.height || 842],
                margin: 0,
            });
            const stream = fs_1.default.createWriteStream(outputPath);
            doc.pipe(stream);
            doc.image(imageBuffer, 0, 0, {
                width: metadata.width,
                height: metadata.height,
            });
            doc.end();
            stream.on("finish", () => resolve());
            stream.on("error", (err) => reject(err));
        });
    }
    catch (err) {
        console.error("convertImageToPDF failed:", err);
        throw err;
    }
});
const logDebug = (msg) => {
    const logLine = `[${new Date().toISOString()}] ${msg}\n`;
    console.log(msg);
    try {
        fs_1.default.appendFileSync(path_1.default.join(process.cwd(), "server-debug.log"), logLine);
    }
    catch (e) {
    }
};
router.post("/upload", auth_1.auth, (req, res, next) => {
    logDebug("Request received at /upload");
    const uploadMiddleware = upload.single("file");
    uploadMiddleware(req, res, (err) => {
        if (err) {
            logDebug(`Multer error: ${err.message}`);
            return res.status(400).json({ message: `Multer error: ${err.message}` });
        }
        next();
    });
}, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let tmpPath = null;
    let convertedPath = null;
    try {
        logDebug("Processing upload request");
        const file = req.file;
        if (!file) {
            logDebug("No file in req.file");
            return res.status(400).json({ message: "No file uploaded" });
        }
        logDebug(`Uploaded file: ${file.originalname}, path: ${file.path}, size: ${file.size}`);
        const sanitizedOriginalName = path_1.default.basename(file.originalname);
        const fileType = path_1.default
            .extname(sanitizedOriginalName)
            .slice(1)
            .toLowerCase();
        const convertTo = (_a = req.body.convertTo) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        logDebug(`File type: ${fileType}`);
        logDebug(`Convert to: ${convertTo}`);
        const tmpDir = path_1.default.join(process.cwd(), "tmp");
        if (!fs_1.default.existsSync(tmpDir)) {
            fs_1.default.mkdirSync(tmpDir, { recursive: true });
        }
        tmpPath = path_1.default.join(tmpDir, getStoredName(sanitizedOriginalName));
        if (!fs_1.default.existsSync(file.path)) {
            logDebug(`File not found at ${file.path}`);
            throw new Error("Uploaded file not found on disk");
        }
        yield promises_1.default.rename(file.path, tmpPath);
        logDebug(`Moved file to ${tmpPath}`);
        const uploadDir = path_1.default.join(process.cwd(), "uploads");
        if (!fs_1.default.existsSync(uploadDir)) {
            yield promises_1.default.mkdir(uploadDir, { recursive: true });
        }
        let targetType = "";
        if (["doc", "docx", "xls", "xlsx"].includes(fileType)) {
            targetType = "pdf";
            const outputName = getStoredName(sanitizedOriginalName.replace(/\.[^.]+$/, ".pdf"));
            convertedPath = path_1.default.join(uploadDir, outputName);
            logDebug(`Converting Office to PDF: ${tmpPath} -> ${convertedPath}`);
            yield convertOfficeToPDF(tmpPath, convertedPath);
        }
        else if (["jpg", "png", "jpeg"].includes(fileType)) {
            targetType = "pdf";
            const outputName = getStoredName(sanitizedOriginalName.replace(/\.[^.]+$/, ".pdf"));
            convertedPath = path_1.default.join(uploadDir, outputName);
            logDebug(`Converting Image to PDF: ${tmpPath} -> ${convertedPath}`);
            yield convertImageToPDF(tmpPath, convertedPath);
        }
        else if (fileType === "pdf") {
            if (!convertTo || !["doc", "docx"].includes(convertTo)) {
                return res
                    .status(400)
                    .json({ message: "For PDF files, convertTo must be 'doc' or 'docx'" });
            }
            targetType = convertTo;
            const outputName = getStoredName(sanitizedOriginalName.replace(/\.pdf$/, `.${convertTo}`));
            convertedPath = path_1.default.join(uploadDir, outputName);
            logDebug(`Converting PDF to Office: ${tmpPath} -> ${convertedPath}`);
            yield convertPDFToOffice(tmpPath, convertedPath, convertTo);
        }
        else {
            logDebug("Unsupported file type");
            return res.status(400).json({ message: "Unsupported file type" });
        }
        if (tmpPath && fs_1.default.existsSync(tmpPath)) {
            yield promises_1.default.unlink(tmpPath);
        }
        const dbFile = yield prisma_1.prisma.filesToConvert.create({
            data: {
                userId: req.userId,
                originalName: sanitizedOriginalName,
                storedName: path_1.default.basename(convertedPath),
                fileType,
                targetType,
                status: "completed",
            },
        });
        logDebug("Conversion completed successfully");
        return res.json({
            message: "File uploaded and converted!",
            file: Object.assign(Object.assign({}, dbFile), { downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${dbFile.storedName}` }),
        });
    }
    catch (err) {
        logDebug(`Upload/conversion error: ${err.message}`);
        if (err.stack)
            logDebug(err.stack);
        console.error("Upload/conversion error:", err);
        try {
            if (tmpPath && fs_1.default.existsSync(tmpPath)) {
                yield promises_1.default.unlink(tmpPath);
            }
            if (convertedPath && fs_1.default.existsSync(convertedPath)) {
                yield promises_1.default.unlink(convertedPath);
            }
        }
        catch (cleanupErr) {
            console.error("Cleanup error:", cleanupErr);
        }
        if (err.message === "Unsupported file type") {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: "Server error during file conversion" });
    }
}));
router.get("/history", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield prisma_1.prisma.filesToConvert.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: "desc" },
        });
        const enrichedFiles = files.map((file) => (Object.assign(Object.assign({}, file), { downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${file.storedName}` })));
        return res.json(enrichedFiles);
    }
    catch (err) {
        console.error("History fetch error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}));
router.delete("/file/:id", auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        if (isNaN(fileId))
            return res.status(400).json({ message: "Invalid file ID" });
        const file = yield prisma_1.prisma.filesToConvert.findUnique({
            where: { id: fileId },
        });
        if (!file || file.userId !== req.userId) {
            return res.status(404).json({ message: "File not found" });
        }
        const filePath = path_1.default.join(process.cwd(), "uploads", file.storedName);
        if (fs_1.default.existsSync(filePath)) {
            yield promises_1.default.unlink(filePath);
        }
        yield prisma_1.prisma.filesToConvert.delete({ where: { id: fileId } });
        return res.json({ message: "File deleted permanently" });
    }
    catch (err) {
        console.error("Delete error:", err);
        return res.status(500).json({ message: "Server error" });
    }
}));
exports.default = router;
