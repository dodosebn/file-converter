import { useState, useRef } from "react";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
import useFiles from "../../hooks/useFiles";
import { ConvertAlert, ConvertDropdown } from "./ui";
import type { ConvertedFile } from "./ui/convertAlert";

// ✅ Allowed file types matching backend
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "jpg",
  "jpeg",
  "png",
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const Uploader = () => {
  const { uploadFile, isUploading } = useFiles();
  const [convertTo, setConvertTo] = useState("pdf");
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 20MB");
      return false;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error(
        `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      );
      return false;
    }

    if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
      toast.error("Invalid file format");
      return false;
    }

    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    const tempId = Date.now().toString();

    // Add file immediately (converting state)
    setFiles((prev) => [
      ...prev,
      {
        id: tempId,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}mb`,
        progress: 0,
        status: "converting" as const,
      },
    ]);

    try {
      const response = await uploadFile({
        file,
        convertTo,
        onProgress: (p: number) => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === tempId ? { ...f, progress: p } : f
            )
          );
        },
      });

      // Mark completed
      setFiles((prev) =>
        prev.map((f) =>
          f.id === tempId
            ? {
                ...f,
                status: "completed" as const,
                progress: 100,
                downloadUrl: (response as unknown as { downloadUrl?: string })?.downloadUrl,
              }
            : f
        )
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      toast.error("Conversion failed");

      setFiles((prev) =>
        prev.map((f) =>
          f.id === tempId ? { ...f, status: "error" as const } : f
        )
      );
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-600", "bg-blue-50");
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-600", "bg-blue-50");
  };

  return (
    <section className="flex flex-col gap-8 bg-white rounded-xl p-8">
      <ConvertDropdown onChangeFormat={setConvertTo} />

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed border-blue-500 bg-[#f3fafe] rounded-2xl p-12 text-center 
          ${
            !isUploading
              ? "cursor-pointer hover:border-blue-600 hover:bg-blue-50"
              : "cursor-not-allowed opacity-60"
          }
          transition-all
        `}
      >
        <input
          type="file"
          hidden
          ref={inputRef}
          accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          disabled={isUploading}
          onChange={(e) =>
            e.target.files && handleUpload(e.target.files[0])
          }
        />

        <Download className="w-12 h-12 text-blue-500 mx-auto" />

        <h2 className="font-semibold mt-4">
          {isUploading
            ? `Uploading... ${files[files.length - 1]?.progress ?? 0}%`
            : "Click or drag file here"}
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Supported: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 20MB)
        </p>

        {isUploading && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{
                width: `${files[files.length - 1]?.progress ?? 0}%`,
              }}
            />
          </div>
        )}
      </div>

      {/* REAL DATA PASSED */}
      <ConvertAlert
        files={files}
        onClearAll={() => setFiles([])}
      />
    </section>
  );
};

export default Uploader;