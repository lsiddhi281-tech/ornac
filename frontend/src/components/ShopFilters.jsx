import { cleanFilters, mergeCategories, sortOptions } from "../utils/catalog";

export default function ShopFilters({ filters, metadata, onChange, onReset }) {
  const categories = mergeCategories(metadata.categories);

  return (
    <aside className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Refine collection</p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-900">Filters</h2>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          Reset
        </button>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Search</label>
          <input
            type="search"
            value={filters.searchQuery}
            onChange={(event) => onChange("searchQuery", event.target.value)}
            placeholder="Search by saree name"
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Category</label>
          <select
            value={filters.category}
            onChange={(event) => onChange("category", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Fabric</label>
          <select
            value={filters.fabric}
            onChange={(event) => onChange("fabric", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          >
            <option value="">All fabrics</option>
            {(metadata.fabrics || []).map((fabric) => (
              <option key={fabric} value={fabric}>
                {fabric}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Color</label>
          <select
            value={filters.color}
            onChange={(event) => onChange("color", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          >
            <option value="">All colors</option>
            {(metadata.colors || []).map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Sort by</label>
          <select
            value={filters.sort}
            onChange={(event) => onChange("sort", event.target.value)}
            className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Min price</label>
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(event) => onChange("minPrice", event.target.value)}
              placeholder="1000"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Max price</label>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(event) => onChange("maxPrice", event.target.value)}
              placeholder="5000"
              className="mt-2 w-full rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 outline-none transition focus:border-brand-300 focus:bg-white focus:ring-4 focus:ring-brand-100"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3">
          <input
            type="checkbox"
            checked={filters.isNewArrival === "true"}
            onChange={(event) => onChange("isNewArrival", event.target.checked ? "true" : "")}
            className="h-4 w-4 rounded border-stone-300 text-brand-700 focus:ring-brand-300"
          />
          <span className="text-sm font-medium text-stone-700">Show only new arrivals</span>
        </label>
      </div>

      <div className="mt-6 rounded-2xl bg-brand-50 px-4 py-3 text-xs text-stone-600">
        Active query: <span className="font-semibold text-stone-900">{Object.keys(cleanFilters(filters)).length}</span> filter(s)
      </div>
    </aside>
  );
}
