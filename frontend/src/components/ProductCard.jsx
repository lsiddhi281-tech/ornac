import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatCurrency, getProductColors, getProductImage } from "../utils/catalog";

export default function ProductCard({ product, dark = false }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const discounted = Number(product.discountPercent || 0) > 0;
  const wishlisted = wishlist.some((item) => item._id === product._id);
  const colors = getProductColors(product).slice(0, 3);

  return (
    <motion.article
      whileHover={{ y: -5 }}
      className={`overflow-hidden rounded-2xl border transition-all ${
        dark ? "border-zinc-800 bg-zinc-800 text-white shadow-xl" : "border-zinc-100 bg-white shadow-sm hover:shadow-md"
      }`}
    >
      <Link to={`/product/${product.slug}`} className="relative block">
        <img src={getProductImage(product)} alt={product.name} className="h-72 w-full object-cover transition-transform duration-500 hover:scale-105" />
        {discounted && (
          <span className="absolute left-2 top-2 rounded bg-red-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
            {product.discountPercent}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute bottom-2 left-2 rounded-full bg-stone-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
            New Arrival
          </span>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <span className="absolute right-2 top-2 rounded bg-amber-500 px-2 py-1 text-[10px] font-bold uppercase text-white">
            Low Stock
          </span>
        )}
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-1 text-lg font-bold">{product.name}</h3>
            <p className={`text-sm ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{product.fabric} • {product.color}</p>
          </div>
          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            className={`rounded-full border px-3 py-2 text-xs font-bold transition ${
              wishlisted ? "border-brand-200 bg-brand-50 text-brand-800" : dark ? "border-zinc-700" : "border-zinc-200"
            }`}
          >
            {wishlisted ? "Saved" : "Save"}
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="text-xl font-black">{formatCurrency(product.discountPrice || product.price)}</p>
            {discounted && <p className="text-sm text-stone-400 line-through">{formatCurrency(product.price)}</p>}
          </div>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${product.stock > 0 ? "text-emerald-500" : "text-red-500"}`}>
            {product.stock > 0 ? "In Stock" : "Sold Out"}
          </p>
        </div>
        {colors.length > 0 && (
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
            <span className="font-semibold uppercase tracking-[0.18em]">Colors</span>
            <div className="flex flex-wrap gap-1">
              {colors.map((color) => (
                <span key={color} className={`rounded-full px-2 py-1 ${dark ? "bg-zinc-700 text-zinc-100" : "bg-stone-100 text-stone-700"}`}>
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="mt-5">
          <button
            type="button"
            onClick={() => addToCart(product, 1, product.color)}
            className={`w-full rounded-xl py-2.5 text-xs font-bold transition-all ${
              dark ? "bg-white text-zinc-900 hover:bg-zinc-200" : "bg-brand-700 text-white hover:bg-brand-800"
            }`}
          >
            Add to cart
          </button>
        </div>
      </div>
    </motion.article>
  );
}
