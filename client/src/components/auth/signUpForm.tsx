import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  MoveRight,
  User,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { RiGithubFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { AccountIntro, LoginAltBtn } from "./ui";
import {  githubSignin } from "../../../../server/src/config/auth";
import { useAuth } from "../../context/authContext";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUpWithGoogle = (url: string) => {
    window.location.href = url;
  };
const authSignUpWithGoogle = async () => {
  const res = await fetch("http://localhost:3000/auth/authExternals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  const data = await res.json();
  handleSignUpWithGoogle(data.url);
}
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await signup(name, email, password);
      navigate("/in/home");
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#f0f6ff] px-4">
      <form
        onSubmit={handleSubmit}
        className="md:w-[26rem] max-w-md rounded-xl bg-white p-6 shadow-xl space-y-6"
      >
        <AccountIntro
          heading="Create an account"
          paragraph="Get started with 20 free conversions"
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
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
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 rounded-lg gradient-card py-3 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
          <MoveRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          OR CONTINUE WITH
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="flex gap-3">
          <LoginAltBtn onClickBtn={authSignUpWithGoogle}>
            <FaGoogle className="w-5 h-5" />
            Google
          </LoginAltBtn>

          <LoginAltBtn onClickBtn={githubSignin}>
            <RiGithubFill className="w-5 h-5" />
            GitHub
          </LoginAltBtn>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
