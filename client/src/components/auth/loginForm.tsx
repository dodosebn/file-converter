import { Eye, EyeOff, Lock, Mail, MoveRight } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { RiGithubFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AccountIntro, LoginAltBtn } from "./ui";
import { useAuth } from "../../context/authContext";
const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login(email, password);
    navigate("/in/home");
  };
  const API_BASE = "http://localhost:3000";

const startOAuth = async (provider: "google" | "github") => {
  try {
    const res = await fetch(`${API_BASE}/auth/${provider}`, {
      method: "POST",
    });

    if (!res.ok) throw new Error("OAuth init failed");

    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    console.error(`${provider} OAuth error`, err);
  }
};


  return (
    <div className="flex items-center justify-center bg-[#f0f6ff] px-4">
      <form
        onSubmit={handleSubmit}
        className="md:w-[26rem] max-w-md rounded-xl bg-white p-6 shadow-xl space-y-6"
      >
        <AccountIntro
          heading="Welcome Back"
          paragraph="Enter your credentials to access your account"
        />

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300 
              pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-[#18b4d8]"
            >
              Forgot Password
            </Link>
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300
              pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {/* Remember me */}
        <label className="flex items-start gap-2 text-sm text-gray-600">
          <input type="checkbox" />
          <span>Remember me for 30 days</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg gradient-card py-3 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
          <MoveRight className="w-4 h-4" />
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        {/* OAuth */}
        <div className="flex gap-3">
          <LoginAltBtn onClickBtn={() => startOAuth("google")}>
            <FaGoogle className="w-5 h-5" />
            Google
          </LoginAltBtn>

          <LoginAltBtn onClickBtn={() => startOAuth("github")}>
            <RiGithubFill className="w-5 h-5" />
            GitHub
          </LoginAltBtn>
        </div>

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
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
