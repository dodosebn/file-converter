import { useState } from "react";
import { ArrowRight, ChevronDown, FileText } from "lucide-react";
import { convertibles } from "../data";

const ConvertDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Convert JPG to PDF");

  return (
    <div className="relative w-96">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border rounded-xl shadow-sm hover:shadow-md transition"
      >
        <span className="font-medium">{selected}</span>
        <ChevronDown
          className={`w-5 h-5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-xl shadow-lg overflow-hidden">
          {convertibles.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                setSelected(`${item.base} to ${item.quote}`);
                setOpen(false);
              }}
              className="flex items-center gap-4 px-4 py-3 hover:bg-gray-100 cursor-pointer transition"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" />
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <FileText className="w-6 h-6 text-gray-600" />
              </div>

              <div className="flex flex-col">
                <span className="font-medium">
                  {item.base} to {item.quote}
                </span>
                <span className="text-sm text-gray-500">
                  Convert {item.base} to {item.quote} format
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConvertDropdown;
