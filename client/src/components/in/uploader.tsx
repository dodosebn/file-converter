import { Download } from "lucide-react";
import { ConvertAlert, ConvertDropdown } from "./ui";

const Uploader = () => {
  return (
    <section className="flex flex-col gap-8 bg-white rounded-xl p-4 sm:p-6 lg:p-8">
      <ConvertDropdown />

      <div className="flex justify-center">
        <div
          className="
            w-full
            max-w-3xl
            md:max-w-4xl
            lg:max-w-5xl
            xl:max-w-6xl
            flex flex-col
            items-center
            gap-4
            p-6 sm:p-8 lg:p-12
            border-2 border-dashed border-blue-500
            bg-[#f3fafe]
            rounded-2xl
            text-center
          "
        >
          <button
            type="button"
            className="
              bg-white
              rounded-full
              p-5 sm:p-6
              shadow-sm
              hover:shadow-md
              active:scale-95
              transition
            "
          >
            <Download className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
          </button>

          <h2 className="text-base sm:text-lg lg:text-xl font-semibold">
            Click or drag your files here to convert
          </h2>

          <span className="text-sm sm:text-base text-gray-500">
            Supports JPG, PNG, PDF, DOC, XLS and more
          </span>
        </div>
      </div>
      <ConvertAlert />
    </section>
  );
};

export default Uploader;
