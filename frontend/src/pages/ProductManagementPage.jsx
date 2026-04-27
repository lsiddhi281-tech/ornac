import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useRealtime } from "../hooks/useRealtime";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import ProductEditor from "../components/admin/ProductEditor";
import { cleanFilters, formatCurrency, getProductImage, mergeCategories } from "../utils/catalog";

export default function ProductManagementPage() {
  const [products, setProducts] = useState([]);
  const [metadata, setMetadata] = useState({ categories: [], fabrics: [] });
  const [filters, setFilters] = useState({
    searchQuery: "",
    category: "",
    fabric: "",
    minPrice: "",
    maxPrice: ""
  });
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  const deferredSearch = useDeferredValue(filters.searchQuery);
  const debouncedSearch = useDebouncedValue(deferredSearch, 250);
  const categories = useMemo(() => mergeCategories(metadata.categories), [metadata.categories]);

  const fetchData = async () => {
    try {
      const response = await api.get("/products", {
        params: cleanFilters({
          ...filters,
          searchQuery: debouncedSearch
        })
      });
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get("/products/filters/meta").then((response) => setMetadata(response.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, filters.category, filters.fabric, filters.minPrice, filters.maxPrice]);

  useRealtime({
    onStockUpdate: () => fetchData(),
    onOrderUpdate: () => fetchData()
  });

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchData();
    } catch {
      window.alert("Error deleting product");
    }
  };

  const updateStock = async (id, delta) => {
    try {
      await api.patch(`/products/${id}/stock/adjust`, { delta });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f7f0e7_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col justify-between gap-6 border-b border-stone-200 pb-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Inventory management</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">Manage saree catalog</h1>
            <p className="mt-2 text-stone-600">Search inventory, edit products, adjust stock in real time, and keep the storefront current.</p>
          </div>
          <Link to="/admin/products/add" className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 font-bold text-white shadow-xl transition-all hover:bg-stone-800">
            <span className="text-xl">+</span> Add New Product
          </Link>
        </div>

        <div className="mt-8 grid gap-4 rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 lg:grid-cols-[2fr_1fr_1fr_auto]">
          <input
            type="search"
            placeholder="Search by product name or keyword"
            className="rounded-2xl border border-stone-200 bg-stone-50 p-4 outline-none focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100 lg:col-span-2"
            value={filters.searchQuery}
            onChange={(event) => setFilters((current) => ({ ...current, searchQuery: event.target.value }))}
          />
          <select
            className="rounded-2xl border border-stone-200 bg-stone-50 p-4 outline-none focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            value={filters.category}
            onChange={(event) => setFilters((current) => ({ ...current, category: event.target.value }))}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="rounded-2xl border border-stone-200 bg-stone-50 p-4 outline-none focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            value={filters.fabric}
            onChange={(event) => setFilters((current) => ({ ...current, fabric: event.target.value }))}
          >
            <option value="">All Fabrics</option>
            {metadata.fabrics.map((fabric) => (
              <option key={fabric} value={fabric}>
                {fabric}
              </option>
            ))}
          </select>
          <div className="flex items-center justify-end px-4 text-sm font-bold text-stone-400">
            {loading ? "Loading..." : `Showing ${products.length} items`}
          </div>
        </div>

        <div className="mt-10 hidden overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm shadow-stone-200/40 lg:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/70 text-[10px] font-black uppercase tracking-[0.24em] text-stone-400">
              <tr>
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Price</th>
                <th className="px-6 py-5 text-center">Live Stock</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {products.map((product) => (
                <tr key={product._id} className="group transition-colors hover:bg-stone-50/70">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={getProductImage(product)} alt={product.name} className="h-14 w-14 rounded-xl object-cover shadow-sm" />
                      <div>
                        <p className="font-bold text-stone-900">{product.name}</p>
                        <p className="text-xs text-stone-400">{product.fabric} • {product.color}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-black uppercase tracking-tight text-brand-800">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-stone-900">{formatCurrency(product.price)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="flex items-center overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
                        <button type="button" onClick={() => updateStock(product._id, -1)} className="px-3 py-1.5 font-bold transition-colors hover:bg-stone-100">
                          -
                        </button>
                        <span className={`min-w-[40px] text-center font-black ${product.stock < 5 ? "bg-red-50 text-red-600" : "text-stone-900"}`}>
                          {product.stock}
                        </span>
                        <button type="button" onClick={() => updateStock(product._id, 1)} className="px-3 py-1.5 font-bold transition-colors hover:bg-stone-100">
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(product)}
                        className="rounded-xl border border-stone-200 px-3 py-2 text-xs font-semibold text-stone-700 transition hover:border-brand-300 hover:text-brand-800"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(product._id)}
                        className="rounded-xl p-2.5 text-stone-400 transition-all hover:bg-red-50 hover:text-red-600"
                        title="Delete Product"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && !loading && (
            <div className="py-20 text-center">
              <p className="mt-4 font-bold text-stone-400">No products found matching your search.</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-4 lg:hidden">
          {products.map((product) => (
            <article key={product._id} className="rounded-[2rem] border border-stone-200 bg-white p-4 shadow-sm shadow-stone-200/40">
              <div className="flex gap-4">
                <img src={getProductImage(product)} alt={product.name} className="h-24 w-20 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-stone-900">{product.name}</p>
                  <p className="mt-1 text-sm text-stone-500">{product.category} • {product.fabric}</p>
                  <p className="mt-2 text-sm font-semibold text-brand-800">{formatCurrency(product.price)}</p>
                  <p className={`mt-2 text-sm font-semibold ${product.stock < 5 ? "text-red-600" : "text-stone-700"}`}>
                    Stock: {product.stock}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex items-center overflow-hidden rounded-xl border border-stone-200">
                  <button type="button" onClick={() => updateStock(product._id, -1)} className="px-3 py-2 text-sm font-bold hover:bg-stone-100">-</button>
                  <span className="min-w-10 px-3 text-center text-sm font-bold">{product.stock}</span>
                  <button type="button" onClick={() => updateStock(product._id, 1)} className="px-3 py-2 text-sm font-bold hover:bg-stone-100">+</button>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setEditingProduct(product)} className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700">
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteProduct(product._id)} className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {editingProduct && (
          <ProductEditor
            product={editingProduct}
            categories={categories}
            onClose={() => setEditingProduct(null)}
            onSaved={fetchData}
          />
        )}
      </div>
    </div>
  );
}
