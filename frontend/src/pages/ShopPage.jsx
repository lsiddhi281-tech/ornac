import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ShopFilters from "../components/ShopFilters";
import api from "../services/api";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { cleanFilters, defaultShopFilters, mergeCategories } from "../utils/catalog";

const readFilters = (searchParams) => ({
  searchQuery: searchParams.get("searchQuery") || "",
  category: searchParams.get("category") || "",
  fabric: searchParams.get("fabric") || "",
  color: searchParams.get("color") || "",
  minPrice: searchParams.get("minPrice") || "",
  maxPrice: searchParams.get("maxPrice") || "",
  sort: searchParams.get("sort") || "newest",
  isNewArrival: searchParams.get("isNewArrival") || ""
});

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [metadata, setMetadata] = useState({ categories: [], fabrics: [], colors: [] });
  const [filters, setFilters] = useState(() => ({ ...defaultShopFilters, ...readFilters(searchParams) }));
  const [loading, setLoading] = useState(true);

  const deferredSearch = useDeferredValue(filters.searchQuery);
  const debouncedSearch = useDebouncedValue(deferredSearch, 250);
  const categories = useMemo(() => mergeCategories(metadata.categories), [metadata.categories]);

  useEffect(() => {
    const nextFilters = { ...defaultShopFilters, ...readFilters(searchParams) };
    setFilters((current) => (JSON.stringify(current) === JSON.stringify(nextFilters) ? current : nextFilters));
  }, [searchParams]);

  useEffect(() => {
    api.get("/products/filters/meta").then((response) => setMetadata(response.data)).catch(() => {});
  }, []);

  useEffect(() => {
    const activeFilters = cleanFilters({
      ...filters,
      searchQuery: debouncedSearch
    });

    setLoading(true);
    setSearchParams(activeFilters, { replace: true });

    api
      .get("/products", { params: activeFilters })
      .then((response) => setProducts(response.data))
      .finally(() => setLoading(false));
  }, [debouncedSearch, filters.category, filters.fabric, filters.color, filters.maxPrice, filters.minPrice, filters.sort, filters.isNewArrival, setSearchParams]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f7f0e7_100%)]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Shop Ornac</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">Discover sarees by fabric, category, and budget.</h1>
          <p className="mt-2 max-w-2xl text-stone-600">Filters and search now query the backend directly, so the listing updates instantly with the same data your admin panel manages.</p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
          <ShopFilters
            filters={filters}
            metadata={{ ...metadata, categories }}
            onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
            onReset={() => setFilters(defaultShopFilters)}
          />

          <section>
            <div className="mb-5 flex flex-col gap-2 rounded-[2rem] border border-stone-200 bg-white px-5 py-4 shadow-sm shadow-stone-200/40 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-800">{loading ? "Searching collection..." : `${products.length} products found`}</p>
                <p className="text-sm text-stone-500">
                  {filters.searchQuery ? `Results for "${filters.searchQuery}"` : "Browse all available sarees"}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-800">
                    {filters.category}
                  </span>
                )}
                {filters.color && (
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-stone-700">
                    {filters.color}
                  </span>
                )}
                {filters.isNewArrival === "true" && (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                    New arrivals
                  </span>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[28rem] animate-pulse rounded-[2rem] bg-white shadow-sm shadow-stone-200/40" />
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => <ProductCard key={product._id} product={product} />)}
              </div>
            )}

            {!loading && products.length === 0 && (
              <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm shadow-stone-200/40">
                <h2 className="text-2xl font-semibold text-stone-900">No sarees matched these filters.</h2>
                <p className="mt-2 text-stone-500">Try widening the price range or clearing a filter to see more products.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
