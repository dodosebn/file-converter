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
exports.startWorker = void 0;
const bullmq_1 = require("bullmq");
const queue_1 = require("./lib/queue");
const prisma_1 = require("./lib/prisma");
const converter_1 = require("./lib/converter");
const promises_1 = __importDefault(require("fs/promises"));
const fs_1 = __importDefault(require("fs"));
const startWorker = () => {
    if (!queue_1.IS_REDIS_ENABLED) {
        console.log("Redis is disabled. Worker will not start.");
        return;
    }
    try {
        const worker = new bullmq_1.Worker("conversion-queue", (job) => __awaiter(void 0, void 0, void 0, function* () {
            const { fileId, tmpPath, convertedPath, fileType, targetType } = job.data;
            console.log(`Processing job ${job.id} for file ${fileId}`);
            try {
                if (["doc", "docx", "xls", "xlsx"].includes(fileType)) {
                    yield (0, converter_1.convertOfficeToPDF)(tmpPath, convertedPath);
                }
                else if (["jpg", "png", "jpeg"].includes(fileType)) {
                    yield (0, converter_1.convertImageToPDF)(tmpPath, convertedPath);
                }
                else if (fileType === "pdf") {
                    yield (0, converter_1.convertPDFToOffice)(tmpPath, convertedPath, targetType);
                }
                else {
                    throw new Error(`Unsupported file type: ${fileType}`);
                }
                yield prisma_1.prisma.filesToConvert.update({
                    where: { id: fileId },
                    data: { status: "completed" },
                });
                if (fs_1.default.existsSync(tmpPath)) {
                    yield promises_1.default.unlink(tmpPath);
                }
                console.log(`Completed job ${job.id} for file ${fileId}`);
            }
            catch (error) {
                console.error(`Error processing job ${job.id}:`, error);
                yield prisma_1.prisma.filesToConvert.update({
                    where: { id: fileId },
                    data: { status: "failed" },
                });
                try {
                    if (fs_1.default.existsSync(tmpPath))
                        yield promises_1.default.unlink(tmpPath);
                    if (fs_1.default.existsSync(convertedPath))
                        yield promises_1.default.unlink(convertedPath);
                }
                catch (cleanupErr) {
                    console.error("Worker cleanup error:", cleanupErr);
                }
                throw error;
            }
        }), { connection: queue_1.connectionOptions });
        worker.on("completed", (job) => {
            console.log(`${job.id} has completed!`);
        });
        worker.on("failed", (job, err) => {
            console.log(`${job === null || job === void 0 ? void 0 : job.id} has failed with ${err === null || err === void 0 ? void 0 : err.message}`);
        });
        worker.on("error", (err) => {
            if (process.env.NODE_ENV === 'production') {
                console.error("Redis connection error (Worker):", err.message);
            }
        });
        console.log("Worker started...");
    }
    catch (e) {
        console.warn("Failed to start BullMQ worker.");
    }
};
exports.startWorker = startWorker;
