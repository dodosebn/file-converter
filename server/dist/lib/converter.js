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
exports.convertImageToPDF = exports.convertPDFToOffice = exports.convertOfficeToPDF = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = __importDefault(require("fs"));
const libreoffice_convert_1 = __importDefault(require("libreoffice-convert"));
const sharp_1 = __importDefault(require("sharp"));
const pdfkit_1 = __importDefault(require("pdfkit"));
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
exports.convertOfficeToPDF = convertOfficeToPDF;
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
exports.convertPDFToOffice = convertPDFToOffice;
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
exports.convertImageToPDF = convertImageToPDF;
