import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", {
        token: searchParams.get("token"),
        password
      });
      setMessage(response.data.message);
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold text-stone-900">Reset password</h1>
      <p className="mt-2 text-stone-500">Set a new password for your account.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          required
          minLength={6}
          className="w-full rounded-2xl border border-stone-200 p-3.5"
          type="password"
          placeholder="New password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {message && <p className="text-sm text-stone-700">{message}</p>}
        <button disabled={loading} className="w-full rounded-2xl bg-brand-700 p-3.5 text-white disabled:opacity-50">
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-500">Back to <Link to="/login" className="text-brand-700">login</Link></p>
    </div>
  );
}
