import { useState } from "react";
import { ChevronDown, Ellipsis } from "lucide-react";
import ConverterModal from "./converterModal";

interface ConvertDropdownProps {
  onChangeFormat: (format: string) => void;
}

const ConvertDropdown = ({ onChangeFormat }: ConvertDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Convert JPG to PDF");

  const handleSelect = (value: string) => {
    setSelected(value);

    // extract format (PDF from "Convert JPG to PDF")
    const format = value.split(" to ")[1]?.toLowerCase();

    if (format) {
      onChangeFormat(format);
    }

    setOpen(false);
  };

  return (
    <section>
      <div className="flex justify-between items-center">
        <div>
          <button
            onClick={() => setOpen(true)}
            className="
              flex items-center justify-between gap-3
              w-full max-w-md
              px-4 py-3
              bg-white rounded-lg
            "
          >
            <span className="font-medium truncate">{selected}</span>
            <ChevronDown className="w-5 h-5 shrink-0" />
          </button>
        </div>

        <div className="hover:bg-[#17b2da] p-2 rounded-full">
          <Ellipsis className="w-5 h-5 text-gray-500 transform rotate-90" />
        </div>
      </div>

      <ConverterModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect} 
      />
    </section>
  );
};

export default ConvertDropdown;
