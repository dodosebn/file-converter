import { useState, useRef } from "react";
import { Download } from "lucide-react";
import { toast } from "react-toastify";
import useFiles from "../../hooks/useFiles";
import { ConvertAlert, ConvertDropdown } from "./ui";

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

const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const Uploader = () => {
  const { uploadFile, isUploading } = useFiles();
  const [convertTo, setConvertTo] = useState("pdf");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 20MB");
      return false;
    }

    // Check file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error(
        `Unsupported file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`
      );
      return false;
    }

    // Optional: Check MIME type
    if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
      toast.error("Invalid file format");
      return false;
    }

    return true;
  };

  const handleUpload = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setProgress(0); // Reset progress
    uploadFile({
      file,
      convertTo,
      onProgress: setProgress,
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-600', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-600', 'bg-blue-50');
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
          ${!isUploading ? 'cursor-pointer hover:border-blue-600 hover:bg-blue-50' : 'cursor-not-allowed opacity-60'}
          transition-all
        `}
      >
        <input
          type="file"
          hidden
          ref={inputRef}
          accept={ALLOWED_EXTENSIONS.map(ext => `.${ext}`).join(',')}
          disabled={isUploading}
          onChange={(e) =>
            e.target.files && handleUpload(e.target.files[0])
          }
        />

        <Download className="w-12 h-12 text-blue-500 mx-auto" />

        <h2 className="font-semibold mt-4">
          {isUploading ? `Uploading... ${progress}%` : "Click or drag file here"}
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          Supported: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Max 20MB)
        </p>

        {isUploading && (
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      <ConvertAlert />
    </section>
  );
};

export default Uploader;