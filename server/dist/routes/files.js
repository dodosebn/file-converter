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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const prisma_1 = require("../lib/prisma");
const express_1 = require("express");
const auth_1 = require("../service/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    dest: path_1.default.join(process.cwd(), 'tmp'),
    limits: { fileSize: 20 * 1024 * 1024 },
});
router.post('/upload', auth_1.auth, upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file)
            return res.status(400).send('No file uploaded');
        let targetType;
        const fileType = path_1.default.extname(file.originalname).slice(1).toLowerCase();
        if (['doc', 'docx', 'xls', 'xlsx'].includes(fileType)) {
            targetType = 'pdf';
        }
        else if (fileType === 'pdf') {
            targetType = req.body.convertTo;
        }
        else if (['jpg', 'png', 'jpeg'].includes(fileType)) {
            targetType = 'pdf';
        }
        else {
            throw new Error('Unsupported file type');
        }
        const storedName = `${Date.now()}-${file.originalname}`;
        const tmpPath = path_1.default.join(process.cwd(), 'tmp', storedName);
        fs_1.default.renameSync(file.path, tmpPath);
        const uploadDir = path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(uploadDir))
            fs_1.default.mkdirSync(uploadDir);
        const finalPath = path_1.default.join(uploadDir, storedName);
        fs_1.default.renameSync(tmpPath, finalPath);
        const dbFile = yield prisma_1.prisma.filesToConvert.create({
            data: {
                userId: req.userId,
                originalName: file.originalname,
                storedName,
                fileType,
                targetType,
                status: 'pending',
            },
        });
        res.json({ message: 'File uploaded!', file: dbFile });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
router.get('/history', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield prisma_1.prisma.filesToConvert.findMany({
        where: { userId: req.userId },
        orderBy: { createdAt: 'desc' },
    });
    res.json(files);
}));
router.delete('/file/:id', auth_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
        const file = yield prisma_1.prisma.filesToConvert.findUnique({ where: { id: fileId } });
        if (!file || file.userId !== req.userId)
            return res.status(404).send('File not found');
        const filePath = path_1.default.join(process.cwd(), 'uploads', file.storedName);
        if (fs_1.default.existsSync(filePath))
            fs_1.default.unlinkSync(filePath);
        yield prisma_1.prisma.filesToConvert.delete({ where: { id: fileId } });
        res.json({ message: 'File deleted permanently' });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}));
exports.default = router;
