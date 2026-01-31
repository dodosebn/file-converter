import { Download } from "lucide-react";
import { ConvertDropdown } from "./ui";

const Uploader = () => {
  return (
    <section className="flex flex-col items-center gap-6">
      <ConvertDropdown />

      <div className="flex flex-col items-center justify-center gap-3 w-full max-w-xl p-10 border-2 border-dashed border-blue-500 bg-[#f3fafe] rounded-2xl text-center">
        <button className="bg-white rounded-full p-6 shadow-sm hover:shadow-md transition">
          <Download className="w-12 h-12 text-blue-500" />
        </button>

        <h2 className="text-lg font-semibold">
          Click or drag your files here to convert
        </h2>

        <span className="text-sm text-gray-500">
          Supports JPG, PNG, PDF, DOC, XLS and more
        </span>
      </div>
    </section>
  );
};

export default Uploader;
