import { Eye, EyeOff, Lock, Mail, MoveRight } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { RiGithubFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AccountIntro, LoginAltBtn } from "./ui";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center bg-[#f0f6ff]">
      <form className="md:w-[26rem] max-w-md  rounded-xl bg-white p-6  shadow-xl space-y-6">
        <AccountIntro
          heading="Welcome Back"
          paragraph="Enter Your Credidentials to access your account
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

        <div className="space-y-1">
          <div className="flex justify-between">
          <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link to='/forgot-password' className="text-sm font-medium text-[#18b4d8]">Forgot Password</Link>
</div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300
               pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
               hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-600">
          <label className="relative inline-flex items-center justify-center">
            <input
              type="checkbox"
              className="
      peer h-5 w-5 appearance-none rounded-full
      border border-blue-400
      checked:bg-[#18b4d8] checked:border-[#18b4d8]
    "
            />
            <svg
              className="pointer-events-none absolute h-3 w-3 text-white opacity-0
               peer-checked:opacity-100"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </label>

          <span className="cursor-pointer">Remember me for 30 days</span>
        </label>
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-lg gradient-card py-3 text-white font-medium hover:opacity-90 transition"
        >
          Sign In
          <MoveRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex gap-3">
          <LoginAltBtn>
            <FaGoogle className="w-5 h-5" />
            Google
          </LoginAltBtn>

          <LoginAltBtn>
            <RiGithubFill className="w-5 h-5" />
            GitHub
          </LoginAltBtn>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
