import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useRealtime } from "../hooks/useRealtime";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import ReviewSection from "../components/ReviewSection";
import SkeletonBlock from "../components/SkeletonBlock";
import { formatCurrency, getProductColors, getProductImage } from "../utils/catalog";

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart, markViewed, recentlyViewed } = useStore();
  const [product, setProduct] = useState(null);
  const [discovery, setDiscovery] = useState({
    relatedProducts: [],
    recommendedProducts: [],
    frequentlyBoughtTogether: []
  });
  const [selectedColor, setSelectedColor] = useState("");
  const [activeImage, setActiveImage] = useState("");
  const [checkingPincode, setCheckingPincode] = useState(false);
  const [pincode, setPincode] = useState("");
  const [serviceability, setServiceability] = useState(null);

  useEffect(() => {
    setProduct(null);
    api.get(`/products/${slug}`).then((response) => {
      setProduct(response.data);
      setSelectedColor(response.data.color || response.data.colors?.[0] || "");
      setActiveImage(response.data.images?.[0]?.url || "");
      markViewed(response.data);
      document.title = `${response.data.name} | Ornac`;
      api.get(`/products/discovery/${response.data._id}`).then((related) => setDiscovery(related.data)).catch(() => {});
    });
  }, [slug, markViewed]);

  useRealtime({
    onStockUpdate: ({ productId, stock }) => setProduct((current) => (current && current._id === productId ? { ...current, stock } : current))
  });

  const effectivePrice = useMemo(() => product?.discountPrice || product?.price || 0, [product]);
  const productColors = useMemo(() => getProductColors(product), [product]);
  const activeVariant = useMemo(
    () => product?.variants?.find((variant) => variant.color === selectedColor) || null,
    [product, selectedColor]
  );
  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (activeVariant?.images?.length) return activeVariant.images;
    return product.images || [];
  }, [product, activeVariant]);
  const recentlyViewedOthers = useMemo(
    () => recentlyViewed.filter((item) => item.slug !== slug).slice(0, 4),
    [recentlyViewed, slug]
  );

  const checkPincode = async () => {
    if (!product || !pincode) return;
    setCheckingPincode(true);
    try {
      const response = await api.get(`/products/${product._id}/serviceability/${pincode}`);
      setServiceability(response.data);
    } finally {
      setCheckingPincode(false);
    }
  };

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <SkeletonBlock className="h-[32rem] w-full" />
          <div className="space-y-4">
            <SkeletonBlock className="h-12 w-2/3" />
            <SkeletonBlock className="h-24 w-full" />
            <SkeletonBlock className="h-10 w-40" />
            <SkeletonBlock className="h-12 w-52" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-3 shadow-sm shadow-stone-200/40">
            <img src={activeImage || getProductImage(product)} alt={product.name} className="h-[32rem] w-full rounded-[1.5rem] object-cover" />
          </div>
          {galleryImages.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {galleryImages.map((image) => (
                <button
                  key={image.url}
                  type="button"
                  onClick={() => setActiveImage(image.url)}
                  className={`overflow-hidden rounded-[1.25rem] border ${activeImage === image.url ? "border-brand-400" : "border-stone-200"}`}
                >
                  <img src={image.url} alt={product.name} className="h-24 w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              {product.isNewArrival && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">New Arrival</span>}
              <h1 className="mt-3 text-3xl font-semibold text-stone-900">{product.name}</h1>
              <p className="mt-2 text-sm text-stone-500">{product.category} • {product.fabric}</p>
            </div>
            <div className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-800">
              {Number(product.averageRating || 0).toFixed(1)} / 5
            </div>
          </div>

          <p className="mt-4 text-zinc-600">{product.description}</p>

          <div className="mt-6 flex items-end gap-3">
            <p className="text-3xl font-semibold text-stone-900">{formatCurrency(effectivePrice)}</p>
            {Number(product.discountPercent || 0) > 0 && (
              <>
                <p className="text-lg text-stone-400 line-through">{formatCurrency(product.price)}</p>
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-bold text-red-700">
                  {product.discountPercent}% OFF
                </span>
              </>
            )}
          </div>

          {productColors.length > 0 && (
            <div className="mt-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Color variants</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {productColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      selectedColor === color ? "border-brand-400 bg-brand-50 text-brand-800" : "border-stone-200 text-stone-600"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-stone-50/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className={`text-sm font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                  Live stock: {activeVariant?.stock ?? product.stock}
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Delivery in {product.deliveryEstimate?.minDays || 3}-{product.deliveryEstimate?.maxDays || 5} days
                </p>
              </div>
              <button type="button" onClick={() => addToCart(product, 1, selectedColor)} className="rounded-xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
                Add to cart
              </button>
            </div>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-stone-200 bg-stone-50/70 p-4">
            <p className="font-semibold text-stone-900">Check delivery availability</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <input
                value={pincode}
                onChange={(event) => setPincode(event.target.value)}
                placeholder="Enter pincode"
                className="flex-1 rounded-2xl border border-stone-200 px-4 py-3"
              />
              <button type="button" onClick={checkPincode} className="rounded-2xl bg-stone-900 px-4 py-3 text-white">
                {checkingPincode ? "Checking..." : "Check"}
              </button>
            </div>
            {serviceability && <p className={`mt-3 text-sm ${serviceability.available ? "text-emerald-700" : "text-red-600"}`}>{serviceability.message}</p>}
          </div>
        </div>
      </div>

      <section className="mt-10">
        <ReviewSection
          productId={product._id}
          ratingSummary={{ averageRating: product.averageRating, totalReviews: product.totalReviews }}
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Related products</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discovery.relatedProducts.map((item) => <ProductCard key={item._id} product={item} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Frequently bought together</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discovery.frequentlyBoughtTogether.map((item) => <ProductCard key={item._id} product={item} />)}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">Recommended for you</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {discovery.recommendedProducts.map((item) => <ProductCard key={item._id} product={item} />)}
        </div>
      </section>

      {recentlyViewedOthers.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-semibold">Recently viewed</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyViewedOthers.map((item) => <ProductCard key={item._id} product={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
