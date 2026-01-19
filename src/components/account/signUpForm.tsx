import { Eye, EyeOff, Lock, Mail, MoveRight, User } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { RiGithubFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useState } from "react";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center bg-[#f0f6ff]">
      <form className="w-[26rem]  rounded-xl bg-white p-6  shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create an account
          </h1>
          <p className="text-sm text-gray-500">
            Get started with 20 free conversions
          </p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="John Doe"
              className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300 
              pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
            />
          </div>
        </div>

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
          <label className="text-sm font-medium text-gray-700">Password</label>
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
          <input type="checkbox" className="mt-1 accent-[#18b4d8] rounded-full" />
          <span>
            I agree to the{" "}
            <span className="text-[#18b4d8] hover:underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-[#18b4d8] hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </span>
        </label>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 rounded-lg gradient-card py-3 text-white font-medium hover:opacity-90 transition"
        >
          Create account
          <MoveRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50 transition"
          >
            <FaGoogle />
            Google
          </button>

          <button
            type="button"
            className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm hover:bg-gray-50 transition"
          >
            <RiGithubFill />
            GitHub
          </button>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
