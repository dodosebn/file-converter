import { Mail, MoveLeft } from "lucide-react";
import AccountIntro from "./ui/accountIntro";
import { Link } from "react-router-dom";

const ForgotForm = () => {
  return (
        <div className="flex items-center justify-center bg-[#f0f6ff] px-4 ">
    <form className="md:w-[26rem] max-w-md  rounded-xl bg-white p-6 shadow-xl space-y-6">
      <AccountIntro
        heading="Forgot Password?"
        paragraph="No worries, we'll send you reset instructions

"
      />

      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300 
            pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
          />
        </div>
      </div>
      <div className="space-y-2">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-xl
           gradient-card py-2 text-white hover:opacity-90 transition"
        >
          Reset Password
        </button>
        <Link
        to='/login'
          className="w-full flex items-center justify-center gap-2 rounded-xl
           hover:bg-[#18b4d8]  py-2 text-black hover:text-white 
           hover:opacity-90 transition"
        >
                    <MoveLeft className="w-4 h-4" />

          Back to Login
        </Link>
      </div>
    </form>
    </div>
  );
};

export default ForgotForm;
