import { useState, useRef } from "react";
import { Download } from "lucide-react";
import useFiles from "../../hooks/useFiles";
import { ConvertAlert, ConvertDropdown } from "./ui";

const Uploader = () => {
  const { uploadFile, isUploading } = useFiles();
  const [convertTo, setConvertTo] = useState("pdf");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
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

  return (
    <section className="flex flex-col gap-8 bg-white rounded-xl p-8">
      <ConvertDropdown onChangeFormat={setConvertTo} />

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-blue-500 bg-[#f3fafe] rounded-2xl p-12 text-center cursor-pointer"
      >
        <input
          type="file"
          hidden
          ref={inputRef}
          onChange={(e) =>
            e.target.files && handleUpload(e.target.files[0])
          }
        />

        <Download className="w-12 h-12 text-blue-500 mx-auto" />

        <h2 className="font-semibold mt-4">
          {isUploading ? "Uploading..." : "Click or drag file here"}
        </h2>

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
