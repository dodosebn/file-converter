import { Worker, Job } from "bullmq";
import { connectionOptions, IS_REDIS_ENABLED } from "./lib/queue";
import { prisma } from "./lib/prisma";
import { convertOfficeToPDF, convertPDFToOffice, convertImageToPDF } from "./lib/converter";
import path from "path";
import fs from "fs/promises";
import fsSync from "fs";

interface ConversionJob {
  fileId: number;
  tmpPath: string;
  convertedPath: string;
  fileType: string;
  targetType: string;
}

export const startWorker = () => {
  if (!IS_REDIS_ENABLED) {
    console.log("Redis is disabled. Worker will not start.");
    return;
  }

  try {
    const worker = new Worker(
      "conversion-queue",
      async (job: Job<ConversionJob>) => {
        const { fileId, tmpPath, convertedPath, fileType, targetType } = job.data;
        
        console.log(`Processing job ${job.id} for file ${fileId}`);

        try {
          if (["doc", "docx", "xls", "xlsx"].includes(fileType)) {
            await convertOfficeToPDF(tmpPath, convertedPath);
          } else if (["jpg", "png", "jpeg"].includes(fileType)) {
            await convertImageToPDF(tmpPath, convertedPath);
          } else if (fileType === "pdf") {
            await convertPDFToOffice(tmpPath, convertedPath, targetType);
          } else {
            throw new Error(`Unsupported file type: ${fileType}`);
          }

          await prisma.filesToConvert.update({
            where: { id: fileId },
            data: { status: "completed" },
          });

          if (fsSync.existsSync(tmpPath)) {
            await fs.unlink(tmpPath);
          }

          console.log(`Completed job ${job.id} for file ${fileId}`);
        } catch (error: any) {
          console.error(`Error processing job ${job.id}:`, error);

          await prisma.filesToConvert.update({
            where: { id: fileId },
            data: { status: "failed" },
          });

          try {
            if (fsSync.existsSync(tmpPath)) await fs.unlink(tmpPath);
            if (fsSync.existsSync(convertedPath)) await fs.unlink(convertedPath);
          } catch (cleanupErr) {
            console.error("Worker cleanup error:", cleanupErr);
          }

          throw error; 
        }
      },
      { connection: connectionOptions }
    );

    worker.on("completed", (job) => {
      console.log(`${job.id} has completed!`);
    });

    worker.on("failed", (job, err) => {
      console.log(`${job?.id} has failed with ${err?.message}`);
    });

    worker.on("error", (err) => {
      if (process.env.NODE_ENV === 'production') {
        console.error("Redis connection error (Worker):", err.message);
      }
    });

    console.log("Worker started...");
  } catch (e) {
    console.warn("Failed to start BullMQ worker.");
  }
};
