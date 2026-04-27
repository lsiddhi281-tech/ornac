import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to register");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
        <h1 className="text-3xl font-semibold text-stone-900">Create your ORNAQ account</h1>
        <form onSubmit={submit} className="mt-6 space-y-3">
          <input className="w-full rounded-2xl border p-3" placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <input className="w-full rounded-2xl border p-3" type="email" placeholder="Email" value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          <input className="w-full rounded-2xl border p-3" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <input className="w-full rounded-2xl border p-3" type="password" placeholder="Password" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="w-full rounded-2xl bg-brand-700 p-3 text-white">Create account</button>
        </form>
        <p className="mt-4 text-sm">Already have an account? <Link to="/login" className="text-brand-700">Login</Link></p>
      </div>
    </div>
  );
}
