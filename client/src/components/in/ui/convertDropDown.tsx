import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ConverterModal from "./converterModal";

const ConvertDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Convert JPG to PDF");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 w-96 px-4 py-3 bg-white"
      >
        <span className="font-medium">{selected}</span>
        <ChevronDown className="w-5 h-5" />
      </button>

      <ConverterModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={setSelected}
      />
    </>
  );
};

export default ConvertDropdown;
