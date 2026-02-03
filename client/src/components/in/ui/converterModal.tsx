import { ArrowRight, X } from "lucide-react";
import { convertibles } from "../data";
import { getIconForBase, getIconForQuote } from "./getIconDemIcons";
interface ConverterModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (value: string) => void;
}
const ConverterModal = ({ open, onClose, onSelect }: ConverterModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/85"
        onClick={onClose}
      />

      <div className="relative w-[520px] bg-[#f0f6ff] rounded-xl shadow-xl overflow-hidden py-5">
        <div className="flex items-center justify-between px-6 border-b">
          <span className="font-bold uppercase">Select Converter Tool</span>
          <button
            onClick={onClose}
            className="border border-blue-400 rounded-full p-3 hover:bg-[#f3f9ff] transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {convertibles.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                onSelect(`${item.base} to ${item.quote}`);
                onClose();
              }}
              className="mt-3"
            >
              <div className="flex items-center gap-6 mx-4 px-3 py-5 hover:bg-[#d9edfc] 
                cursor-pointer transition border-b-2 border-r border-blue-500 rounded-md"
              >
                <div className="flex items-center gap-2">
                  {getIconForBase(item.base)}
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  {getIconForQuote(item.quote)}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-lg">
                    {item.base} to {item.quote}
                  </span>
                  <span className="text-sm text-gray-500">
                    Convert {item.base} to {item.quote} format
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConverterModal;
