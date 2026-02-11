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
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { Spinner } from "..";

const API_BASE = "http://localhost:3000";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [oauthLoading, setOauthLoading] = useState<null | "google" | "github">(null);

  // OAuth login
  const startOAuth = async (provider: "google" | "github") => {
    try {
      setOauthLoading(provider);

      const res = await fetch(`${API_BASE}/auth/${provider}`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("OAuth init failed");

      const { url } = await res.json();
      window.location.href = url;
    } catch {
      toast.error(`Failed to start ${provider} login`);
      setOauthLoading(null);
    }
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Call your signup function (from context or API hook)
      await signup(name, email, password);

      toast.success("Account created successfully 🎉");
      navigate("/in/home");
    } catch (err) {
      // Show error toast properly
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  const isBusy = loading || oauthLoading !== null;

  return (
    <div className="flex items-center justify-center bg-[#f0f6ff] px-4">
      <form
        onSubmit={handleSubmit}
        className={`md:w-[26rem] max-w-md rounded-xl bg-white p-6 shadow-xl space-y-6 ${
          isBusy ? "pointer-events-none opacity-95" : ""
        }`}
      >
        <AccountIntro
          heading="Create an account"
          paragraph="Get started with 20 free conversions"
        />

        {/* Name */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={name}
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
              className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border bg-[#f0f6ff] border-gray-300 pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#18b4d8]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ?  <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isBusy}
          className="w-full flex items-center justify-center gap-2 rounded-lg gradient-card py-3 text-white font-medium disabled:opacity-60"
        >
          {loading ? (
            <>
              <Spinner size={18} />
              Creating account...
            </>
          ) : (
            <>
              Create account
              <MoveRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* OAuth */}
        <div className="flex gap-3">
          <LoginAltBtn onClickBtn={() => startOAuth("google")}>
            {oauthLoading === "google" ? <Spinner size={18} /> : <FaGoogle className="w-5 h-5" />}
            Google
          </LoginAltBtn>

          <LoginAltBtn onClickBtn={() => startOAuth("github")}>
            {oauthLoading === "github" ? <Spinner size={18} /> : <RiGithubFill className="w-5 h-5" />}
            GitHub
          </LoginAltBtn>
        </div>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignUpForm;
