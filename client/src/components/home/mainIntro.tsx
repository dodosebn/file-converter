import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MainIntro = () => {
  return (
    <div>
      <section className=" mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl dark:text-[#f8fafc] font-bold text-foreground leading-tight">
            Convert Any File Format{" "}
            <span className="gradient-card from-primary to-cyan-400 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>
          <p className="text-xl text-[#68788e] dark:text-gray-400 max-w-2xl mx-auto">
            The fastest, most secure file converter. Transform images,
            documents, and media files with just a few clicks. No software
            installation required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/">
              <button
                className="gradient-card flex items-center hover:opacity-90 gap-2 
              text-lg px-7 py-2 text-[#fafdfe] rounded-lg "
              >
                Try as Guest
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/signup">
              <button className="text-lg px-7 py-2 border border-gray-800
               transition-all hover:gradient-card rounded-lg dark:text-[#f8fafc]">
                Create Account
              </button>
            </Link>
          </div>
          <p className="text-sm text-[#68788e] dark:text-gray-400 pt-2">
            No credit card required • 50 free conversions monthly
          </p>
        </div>
      </section>
    </div>
  );
};

export default MainIntro;
