import { useState } from "react";
import {
  ArrowRight,
  FileChartColumn,
  FileImage,
  FileText,
} from "lucide-react";
import ConverterModal from "./converterModal";

const RecommendedTools = () => {
  const [open, setOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-6 bg-white dark:bg-[#141f38] rounded-xl p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-[#f8fafc]">
          Recommended Tools
        </h2>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-sm font-semibold text-gray-400 hover:text-gray-600"
        >
          View all
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div
          onClick={() => setActiveTool("jpg-png")}
          className={`w-full rounded-xl md:p-4 p-2 flex items-center 
          gap-4 cursor-pointer transition
          ${
            activeTool === "jpg-png"
              ? "border-2 border-blue-400 bg-[#e6f5fc] dark:bg-[#132c49]"
              : " bg-white dark:bg-[#132c49] hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center md:gap-2 gap-1">
            <FileImage className="w-6 h-6 text-blue-500" />
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <FileText className="w-6 h-6 text-red-500" />
          </div>

          <div className="flex flex-col">
            <h3 className="text-md font-semibold text-gray-900 dark:text-[#f8fafc]">
              JPG to PNG
            </h3>
            <p className="text-sm text-gray-400">
              Convert your JPG images to PNG format
            </p>
          </div>
        </div>

        <div
          onClick={() => setActiveTool("pdf-xlsx")}
          className={`w-full rounded-xl md:p-4 p-2 flex items-center 
          gap-4 cursor-pointer transition
          ${
            activeTool === "pdf-xlsx"
              ? "border-2 border-blue-400 bg-[#e6f5fc] dark:bg-[#132c49]"
              : " bg-white dark:bg-[#132c49] hover:bg-gray-100"
          }`}
        >
          <div className="flex items-center md:gap-2 gap-1">
            <FileText className="w-6 h-6 text-red-500" />
            <ArrowRight className="w-4 h-4 text-gray-400" />
            <FileChartColumn className="w-6 h-6 text-green-500" />
          </div>

          <div className="flex flex-col">
            <h3 className="text-md font-semibold text-gray-900 dark:text-[#f8fafc]">
              PDF to XLSX
            </h3>
            <p className="text-sm text-gray-400">
              Convert your PDF documents to XLSX format
            </p>
          </div>
        </div>
      </div>

      <ConverterModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={() => {}}
      />
    </section>
  );
};

export default RecommendedTools;