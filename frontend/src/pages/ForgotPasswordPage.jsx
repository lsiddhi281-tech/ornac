import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const response = await api.post("/auth/forgot-password", { email });
    setMessage(response.data.message);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-3xl font-semibold text-stone-900">Forgot password</h1>
      <p className="mt-2 text-stone-500">Enter your email and we’ll send a reset link.</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <input
          required
          className="w-full rounded-2xl border border-stone-200 p-3.5"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        <button disabled={loading} className="w-full rounded-2xl bg-brand-700 p-3.5 text-white disabled:opacity-50">
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-500">Remembered your password? <Link to="/login" className="text-brand-700">Login</Link></p>
    </div>
  );
}
