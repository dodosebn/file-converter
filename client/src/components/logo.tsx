import { FileImage } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to='/'>
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-8 h-8 rounded-lg gradient-card flex items-center justify-center">
        <FileImage className="w-4 h-4 text-[#fafdfe]" />
      </div>
      <span className="font-semibold text-lg text-foreground dark:text-[#f8fafc]">
        FastConvert
      </span>
    </div>
</Link>
  )
}

export default Logo;
