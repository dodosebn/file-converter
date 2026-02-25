import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logo } from "..";
const Navbar = () => {
  const Navigate = useNavigate();
  const handleClick = (url: string) => {
    Navigate(url);
  };
  return (
    <header className="border-border bg-[#f8fbff] dark:bg-[#111b30]">
      <div className="container mx-auto px-4 sm:px-6 py-4 flex flex-row
       flex-nowrap items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => handleClick("/login")}
            className="text-[#68788e]  dark:text-[#f8fafc] hover:bg-[#25cac5] py-2 px-4 rounded-lg  font-medium hover:text-foreground whitespace-nowrap"
          >
            Log in
          </button>

          <button
            onClick={() => handleClick("/signup")}
            className="gradient-card rounded-lg text-[#fafdfe] hover:opacity-90
         md:gap-2 gap-1 flex items-center md:px-4 px-3 py-2 whitespace-nowrap"
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
