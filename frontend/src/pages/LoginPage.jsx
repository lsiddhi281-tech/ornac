import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, requestOtp, verifyOtp, googleLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", phone: "", otp: "" });
  const [otpRequested, setOtpRequested] = useState(false);
  const [previewCode, setPreviewCode] = useState("");
  const [error, setError] = useState("");

  const submitPasswordLogin = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  };

  const submitOtpRequest = async () => {
    setError("");
    try {
      const response = await requestOtp({ phone: form.phone });
      setOtpRequested(true);
      setPreviewCode(response.previewCode || "");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to send OTP");
    }
  };

  const submitOtpVerify = async () => {
    setError("");
    try {
      await verifyOtp({ phone: form.phone, otp: form.otp });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to verify OTP");
    }
  };

  const submitGoogleMock = async () => {
    setError("");
    try {
      await googleLogin({
        email: form.email || "google-demo@ornac.local",
        name: "Google Demo User",
        googleId: "mock-google-user"
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Google login is not configured");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40 md:grid-cols-[1fr_1fr] md:p-8">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Account access</p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-900">Sign in to ORNAQ</h1>
          <p className="mt-2 text-stone-500">Use password login, mobile OTP, or the scaffolded Google sign-in path.</p>

          <form onSubmit={submitPasswordLogin} className="mt-6 space-y-3">
            <input className="w-full rounded-2xl border p-3" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
            <input className="w-full rounded-2xl border p-3" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="w-full rounded-2xl bg-brand-700 p-3 text-white">Login with password</button>
          </form>
          <p className="mt-3 text-sm"><Link to="/forgot-password" className="text-brand-700">Forgot password?</Link></p>
          <p className="mt-4 text-sm">No account? <Link to="/register" className="text-brand-700">Register</Link></p>
        </section>

        <section className="rounded-[1.5rem] bg-stone-50 p-5">
          <h2 className="text-lg font-semibold text-stone-900">Quick sign-in options</h2>
          <div className="mt-4 space-y-3">
            <input className="w-full rounded-2xl border border-stone-200 p-3" placeholder="Mobile number" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
            {!otpRequested ? (
              <button type="button" onClick={submitOtpRequest} className="w-full rounded-2xl border border-stone-300 bg-white p-3 font-semibold text-stone-800">
                Send mobile OTP
              </button>
            ) : (
              <>
                <input className="w-full rounded-2xl border border-stone-200 p-3" placeholder="Enter OTP" value={form.otp} onChange={(event) => setForm((current) => ({ ...current, otp: event.target.value }))} />
                <button type="button" onClick={submitOtpVerify} className="w-full rounded-2xl border border-stone-300 bg-white p-3 font-semibold text-stone-800">
                  Verify OTP
                </button>
                {previewCode && <p className="text-xs text-stone-500">Dev preview OTP: {previewCode}</p>}
              </>
            )}

            <div className="border-t border-stone-200 pt-4">
              <button type="button" onClick={submitGoogleMock} className="w-full rounded-2xl bg-stone-900 p-3 font-semibold text-white">
                Continue with Google
              </button>
              <p className="mt-2 text-xs text-stone-500">Google login is environment-gated for safety and can be enabled without changing this UI.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
