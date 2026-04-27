import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { categoryOptions, mergeCategories } from "../utils/catalog";

export default function AddProductPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [metadata, setMetadata] = useState({ categories: categoryOptions, fabrics: [] });
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Silk",
    fabric: "",
    color: "",
    colorsInput: "",
    price: "",
    discountPercent: "",
    stock: "",
    deliveryEstimateMinDays: 3,
    deliveryEstimateMaxDays: 5,
    featured: false,
    isNewArrival: true
  });
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const categories = useMemo(() => mergeCategories(metadata.categories), [metadata.categories]);

  useEffect(() => {
    api.get("/products/filters/meta").then((response) => setMetadata(response.data)).catch(() => {});
  }, []);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
    setPreviews(selectedFiles.map((file) => URL.createObjectURL(file)));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      let images = [];
      if (files.length) {
        const formData = new FormData();
        files.forEach((file) => formData.append("images", file));
        const uploadResponse = await api.post("/uploads/products", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        images = uploadResponse.data;
      }

      const colors = form.colorsInput
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      await api.post("/products", {
        ...form,
        color: form.color || colors[0] || "",
        colors,
        price: Number(form.price),
        discountPercent: Number(form.discountPercent || 0),
        stock: Number(form.stock),
        images
      });

      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f7f0e7_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="flex flex-col gap-4 border-b border-stone-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Catalog publishing</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">Add a new saree product</h1>
            <p className="mt-2 text-stone-600">Create a catalog listing with discounts, color variants, delivery settings, and new-arrival highlighting.</p>
          </div>
          <button type="button" onClick={() => navigate(-1)} className="text-sm font-bold text-stone-500 hover:text-stone-900">
            Cancel and go back
          </button>
        </div>

        {error && <div className="mt-6 rounded-[1.5rem] bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>}

        <form onSubmit={submit} className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
              <h2 className="text-lg font-semibold text-stone-900">General information</h2>
              <input required className="w-full rounded-2xl border border-stone-200 p-3.5" placeholder="Product Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              <textarea required rows={5} className="w-full rounded-2xl border border-stone-200 p-3.5" placeholder="Describe drape, border, weave feel, and occasion." value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
            </div>

            <div className="space-y-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
              <h2 className="text-lg font-semibold text-stone-900">Attributes</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <select className="rounded-2xl border border-stone-200 p-3.5" value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <input required className="rounded-2xl border border-stone-200 p-3.5" placeholder="Fabric" value={form.fabric} onChange={(event) => setForm((current) => ({ ...current, fabric: event.target.value }))} />
                <input required className="rounded-2xl border border-stone-200 p-3.5" placeholder="Primary color" value={form.color} onChange={(event) => setForm((current) => ({ ...current, color: event.target.value }))} />
                <input className="rounded-2xl border border-stone-200 p-3.5" placeholder="All colors (comma separated)" value={form.colorsInput} onChange={(event) => setForm((current) => ({ ...current, colorsInput: event.target.value }))} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
              <h2 className="text-lg font-semibold text-stone-900">Pricing and launch</h2>
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" className="rounded-2xl border border-stone-200 p-3.5" placeholder="Price" value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} />
                <input type="number" className="rounded-2xl border border-stone-200 p-3.5" placeholder="Discount %" value={form.discountPercent} onChange={(event) => setForm((current) => ({ ...current, discountPercent: event.target.value }))} />
                <input required type="number" className="rounded-2xl border border-stone-200 p-3.5" placeholder="Stock" value={form.stock} onChange={(event) => setForm((current) => ({ ...current, stock: event.target.value }))} />
                <label className="flex items-center gap-2 rounded-2xl border border-stone-200 px-4">
                  <input type="checkbox" checked={form.isNewArrival} onChange={(event) => setForm((current) => ({ ...current, isNewArrival: event.target.checked }))} />
                  <span className="text-sm font-medium">New arrival</span>
                </label>
                <label className="flex items-center gap-2 rounded-2xl border border-stone-200 px-4">
                  <input type="checkbox" checked={form.featured} onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))} />
                  <span className="text-sm font-medium">Featured</span>
                </label>
              </div>
            </div>

            <div className="space-y-4 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
              <h2 className="text-lg font-semibold text-stone-900">Product media</h2>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-stone-500" />
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((src, index) => (
                    <img key={index} src={src} alt="Preview" className="h-24 w-full rounded-2xl object-cover" />
                  ))}
                </div>
              )}
            </div>

            <button disabled={submitting} className="w-full rounded-[1.5rem] bg-brand-700 py-5 text-xl font-black text-white shadow-xl shadow-brand-200/60 transition-all hover:bg-brand-800 disabled:opacity-50">
              {submitting ? "Publishing saree..." : "Publish product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
