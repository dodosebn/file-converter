import { Loader2 } from "lucide-react";

const Spinner = ({ size = 24, className = "" }) => {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="inline-flex items-center justify-center"
    >
      <Loader2
        size={size}
        className={`animate-spin text-[#25cac5] ${className}`}
      />
    </div>
  );
}
export default Spinner;