import { Check, FileImage } from "lucide-react";
import features from "./data";

const SignUpRightty = () => {
  return (
    <div className="hidden rounded-l-2xl lg:flex lg:w-1/2 min-h-screen gradient-card p-12 flex-col justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center
         justify-center">
          <FileImage className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-white">FileConvert</span>
      </div>

      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-white leading-tight">
          Start converting files for free
        </h1>
        <p className="text-lg text-white/80">
          Create your account and get access to powerful file conversion tools.
        </p>

        <div className="space-y-4">
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <span className="text-white/90">{feature}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30"
            />
          ))}
        </div>
        <p className="text-white/80">Join 10,000+ users</p>
      </div>
    </div>
  );
};

export default SignUpRightty;
