import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { formatCurrency, getProductImage } from "../utils/catalog";

export default function CartPage() {
  const { cart, cartSummary, removeFromCart, updateCartQuantity } = useStore();
  const shipping = cartSummary.subtotal >= 999 ? 0 : 50;
  const total = cartSummary.subtotal + shipping;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe6_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl font-semibold text-stone-900">Your cart</h1>
        <p className="mt-2 text-stone-500">Manage quantities, remove duplicates safely, and keep track of delivery eligibility in real time.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-4">
            {cart.length === 0 && (
              <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm shadow-stone-200/40">
                <h2 className="text-2xl font-semibold text-stone-900">Your cart is empty</h2>
                <p className="mt-2 text-stone-500">Add a few ORNAQ sarees to continue checkout.</p>
                <Link to="/shop" className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
                  Continue shopping
                </Link>
              </div>
            )}

            {cart.map((item) => (
              <article key={`${item._id}-${item.selectedColor || "default"}`} className="rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40">
                <div className="flex gap-4">
                  <img src={getProductImage(item)} alt={item.name} className="h-28 w-24 rounded-[1.5rem] object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-stone-900">{item.name}</p>
                        <p className="mt-1 text-sm text-stone-500">{item.fabric} • {item.selectedColor || item.color}</p>
                        <p className="mt-2 text-sm font-semibold text-brand-800">{formatCurrency(item.discountPrice || item.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item._id, item.selectedColor)}
                        className="text-sm font-semibold text-red-600"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center overflow-hidden rounded-xl border border-stone-200">
                        <button type="button" onClick={() => updateCartQuantity(item._id, item.qty - 1, item.selectedColor)} className="px-4 py-2 text-lg font-bold hover:bg-stone-100">-</button>
                        <span className="min-w-12 text-center text-sm font-bold">{item.qty}</span>
                        <button type="button" onClick={() => updateCartQuantity(item._id, item.qty + 1, item.selectedColor)} className="px-4 py-2 text-lg font-bold hover:bg-stone-100">+</button>
                      </div>
                      <p className="text-base font-semibold text-stone-900">{formatCurrency((item.discountPrice || item.price) * item.qty)}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <aside className="h-fit rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
            <h2 className="text-xl font-semibold text-stone-900">Order summary</h2>
            <div className="mt-6 space-y-3 text-sm text-stone-600">
              <div className="flex justify-between"><span>Items</span><span>{cartSummary.quantity}</span></div>
              <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(cartSummary.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span></div>
              <div className="flex justify-between text-lg font-semibold text-stone-900"><span>Total</span><span>{formatCurrency(total)}</span></div>
            </div>
            <p className="mt-4 rounded-2xl bg-stone-50 px-4 py-3 text-sm text-stone-500">
              {shipping === 0 ? "Free shipping unlocked." : "Add more items to cross Rs. 999 and unlock free delivery."}
            </p>
            <Link to="/checkout" className={`mt-6 block rounded-[1.25rem] px-5 py-3 text-center text-sm font-semibold text-white ${cart.length ? "bg-brand-700" : "pointer-events-none bg-stone-300"}`}>
              Proceed to checkout
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
