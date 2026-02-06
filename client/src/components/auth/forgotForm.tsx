import { useState } from "react";
import { Mail, MoveLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AccountIntro from "./ui/accountIntro";
import { ApiError, apiRequest } from "../../api/client";

const ForgotForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await apiRequest<{ message: string }>("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMessage(res.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#f0f6ff] px-4">
      <form
        onSubmit={handleSubmit}
        className="md:w-[26rem] max-w-md rounded-xl bg-white p-6 shadow-xl space-y-6"
      >
        <AccountIntro
          heading="Forgot Password?"
          paragraph="No worries, we'll send you reset instructions"
        />

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

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

        <div className="space-y-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl
              gradient-card py-2 text-white hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>

          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 rounded-xl
              hover:bg-[#18b4d8] py-2 text-black hover:text-white hover:opacity-90 transition"
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
