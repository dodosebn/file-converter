import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MainIntro = () => {
  return (
    <div>
      <section className="container bg-[#f0f6ff] mx-auto px-6 py-24 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl font-bold text-foreground leading-tight">
            Convert Any File Format{" "}
            <span className="gradient-card from-primary to-cyan-400 bg-clip-text text-transparent">
              In Seconds
            </span>
          </h1>
          <p className="text-xl text-[#68788e] max-w-2xl mx-auto">
            The fastest, most secure file converter. Transform images,
            documents, and media files with just a few clicks. No software
            installation required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/home">
              <button className="gradient-card flex items-center hover:opacity-90 gap-2 
              text-lg px-6 py-3 text-[#fafdfe] rounded-lg ">
                Try as Guest
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/signup">
              <button className="text-lg px-6 py-3 border border-[#d3d3d3] transition-all hover:gradient-card rounded-lg">Create Account</button>
            </Link>
          </div>
          <p className="text-sm text-[#68788e]  pt-2">
            No credit card required • 50 free conversions monthly
          </p>
        </div>
      </section>
    </div>
  );
};

export default MainIntro;
