import { useState, useRef } from "react";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
import { useFile } from "../../context/fileContext";
import { ConvertAlert, ConvertDropdown } from "./ui";
import type { ConvertedFile } from "./ui/convertAlert";

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

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const Uploader = () => {
  const { uploadFile, loading: isUploading, files: historyFiles } = useFile();
  const [convertTo, setConvertTo] = useState("pdf");
  const [convertFrom, setConvertFrom] = useState("jpg");
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
        `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
      );
      return false;
    }

    if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
      toast.error("Invalid file format");
      return false;
    }

    if (convertFrom === "jpg") {
      if (!["jpg", "jpeg", "png"].includes(extension)) {
        toast.error(
          "Please upload an image file (JPG, PNG) for this conversion.",
        );
        return false;
      }
    } else {
      if (extension !== convertFrom) {
        toast.error(
          `Please upload a .${convertFrom} file to match your selection.`,
        );
        return false;
      }
    }

    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    const tempId = Date.now().toString();

    const baseName = file.name.replace(/\.[^.]+$/, "");
    const targetName = `${baseName}.${convertTo}`;

    setFiles((prev) => [
      ...prev,
      {
        id: tempId,
        name: targetName,
        size: `${(file.size / 1024 / 1024).toFixed(2)}mb`,
        progress: 0,
        status: "converting" as const,
      },
    ]);

    try {
      await uploadFile({
        file,
        convertTo,
        onProgress: (p: number) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === tempId ? { ...f, progress: p } : f)),
          );
        },
      });
      setFiles((prev) => prev.filter((f) => f.id !== tempId));
    } catch (_error) {
      toast.error("Conversion failed");

      setFiles((prev) =>
        prev.map((f) =>
          f.id === tempId ? { ...f, status: "error" as const } : f,
        ),
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

  const mappedHistory: ConvertedFile[] = historyFiles.map((f) => {
    const baseName = f.originalName.replace(/\.[^.]+$/, "");
    return {
      id: f.id.toString(),
      name: `${baseName}.${f.targetType}`,
      size: "0mb", 
      progress: 100,
      status: "completed",
      downloadUrl: f.downloadUrl,
    };
  });

  const displayFiles = [...files, ...mappedHistory];

  return (
    <section className="flex flex-col gap-8 bg-white dark:bg-[#141f38] rounded-xl p-8">
      <ConvertDropdown
        onSelectConversion={(base, quote) => {
          setConvertFrom(base);
          setConvertTo(quote);
        }}
      />

      <div
        onClick={() => !isUploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed border-blue-500 bg-[#f3fafe] dark:bg-[#142541] rounded-2xl p-12 text-center 
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
          onChange={(e) => e.target.files && handleUpload(e.target.files[0])}
        />
<div className="bg-[#dbf1fb] dark:bg-[#133151] p-4 rounded-full w-fit mx-auto">
        <Download className="w-9 h-9 text-blue-500 mx-auto" />
</div>
        <h2 className="font-semibold mt-4 dark:text-[#f8fafc]">
          {isUploading
            ? `Uploading... ${files[files.length - 1]?.progress ?? 0}%`
            : "Click or drag file here"}
        </h2>

        <p className="text-sm text-gray-400 mt-2">
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

      <ConvertAlert
        files={displayFiles}
        onClearAll={() => {
          setFiles([]);
          // TODO: Implement clear history in context?
        }}
      />
    </section>
  );
};

export default Uploader;
