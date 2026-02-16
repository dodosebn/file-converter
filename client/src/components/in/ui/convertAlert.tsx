import {
  CircleCheckBig,
  Download,
  Ellipsis,
  FileImage,
  Trash2,
  Loader2,
} from "lucide-react";

export type ConvertedFile = {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "converting" | "completed" | "error";
  downloadUrl?: string;
};

type ConvertAlertProps = {
  files: ConvertedFile[];
  onClearAll: () => void;
};

const ConvertAlert = ({ files, onClearAll }: ConvertAlertProps) => {
  const allCompleted =
    files.length > 0 && files.every((file) => file.status === "completed");

  const handleDownload = (url?: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadAll = () => {
    files.forEach((file) => {
      if (file.status === "completed" && file.downloadUrl) {
        window.open(file.downloadUrl, "_blank", "noopener,noreferrer");
      }
    });
  };

  return (
    <main>
      {files.map((file) => (
        <section
          key={file.id}
          className="flex justify-between items-center mb-4"
        >
          {/* File info */}
          <div className="flex gap-2 items-center">
            <span className="bg-[#e6f5fc] p-2 rounded-md">
              <FileImage className="md:w-6 md:h-6 w-4 h-4 text-blue-500" />
            </span>

            <span className="md:font-semibold font-medium text-gray-800 text-md md:text-lg">
              {file.name}
            </span>
          </div>

          {/* Right side */}
          <ul className="flex gap-x-6 items-center">
            {/* Status */}
            <li className="text-green-600 hidden md:flex items-center gap-x-2">
              {file.status === "completed" ? (
                <>
                  <CircleCheckBig className="text-green-500 w-4 h-4" />
                  Converted
                </>
              ) : (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                  {file.progress}%
                </>
              )}
            </li>

            {/* Size */}
            <li>{file.size}</li>

            {/* Download */}
            <li>
              <button
                disabled={file.status !== "completed"}
                onClick={() => handleDownload(file.downloadUrl)}
                className={`transition ${
                  file.status !== "completed"
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </li>

            {/* Menu icon */}
            <li>
              <Ellipsis className="w-5 h-5 text-gray-500 rotate-90" />
            </li>
          </ul>
        </section>
      ))}

      {/* Footer */}
      <div className="border-t border-gray-300 my-6">
        <div className="flex flex-col md:flex-row md:justify-between pt-6 gap-4 items-stretch md:items-center">
          <div className="flex gap-x-3 items-center">
            <p>Total {files.length} Files</p>

            <button
              onClick={onClearAll}
              className="flex items-center gap-x-2 font-medium text-red-600"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="w-full md:w-auto">
            <button
              disabled={!allCompleted}
              onClick={handleDownloadAll}
              className={`
                w-full md:w-auto
                flex items-center justify-center gap-2
                rounded-md gradient-card
                px-3 py-2
                text-white font-medium
                transition
                ${
                  !allCompleted
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }
              `}
            >
              <Download className="w-4 h-4 text-white" />
              Download All
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ConvertAlert;
