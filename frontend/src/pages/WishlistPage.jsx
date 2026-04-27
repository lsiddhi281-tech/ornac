import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";

export default function WishlistPage() {
  const { wishlist } = useStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-zinc-600">No items in wishlist yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
