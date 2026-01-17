import { ArrowRight, FileImage } from "lucide-react";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const Navigate = useNavigate();
  const handleClick = (url: string) => {
    Navigate(url);
  };
  return (
    <header className="border-b border-border bg-[#f8fbff]">
  <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-row flex-nowrap items-center justify-between">
    
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-8 h-8 rounded-lg gradient-card flex items-center justify-center">
        <FileImage className="w-4 h-4 text-[#fafdfe]" />
      </div>
      <span className="font-semibold text-lg text-foreground">
        FastConvert
      </span>
    </div>

    <div className="flex items-center gap-4 shrink-0">
      <button
        onClick={() => handleClick("/login")}
        className="text-[#68788e] font-medium hover:text-foreground whitespace-nowrap"
      >
        Log in
      </button>

      <button
        onClick={() => handleClick("/signup")}
        className="gradient-card rounded-lg text-[#fafdfe] hover:opacity-90 gap-2 flex items-center px-4 py-2 whitespace-nowrap"
      >
        Get Started
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>

  </div>
</header>

  );
};

export default Navbar;
