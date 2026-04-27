import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useStore } from "../context/StoreContext";
import { useNotification } from "../context/NotificationContext";
import PaymentModal from "../components/PaymentModal";
import { formatCurrency } from "../utils/catalog";

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 50;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, cartSummary, clearCart } = useStore();
  const { showToast } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: ""
  });

  const subtotal = useMemo(() => cartSummary.subtotal, [cartSummary]);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const totalAmount = subtotal + shippingFee;

  const placeOrder = async () => {
    if (!cart.length) return;
    setProcessing(true);
    setError("");
    try {
      const method = paymentMethod === "COD" ? "COD" : "MOCK";
      const res = await api.post("/orders", {
        paymentMethod: method,
        items: cart.map((item) => ({
          product: item._id,
          qty: item.qty,
          selectedColor: item.selectedColor || item.color
        })),
        shippingAddress: address
      });
      if (res.data?.order?.paymentStatus !== "FAILED") {
        await clearCart();
        showToast({
          title: "Order placed successfully",
          message: "You can now track the order timeline from your profile.",
          tone: "success"
        });
      }
      navigate("/order-result", { state: res.data });
    } catch (errorResponse) {
      const message = errorResponse.response?.data?.message || "Order failed";
      setError(message);
      navigate("/order-result", {
        state: {
          order: null,
          payment: {
            paymentMethod,
            paymentStatus: "FAILED",
            transactionId: null
          },
          message
        }
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <PaymentModal open={processing} message="Processing payment, please wait..." />
      <h1 className="text-3xl font-semibold text-stone-900">Checkout</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <h2 className="font-semibold text-stone-900">Delivery address</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input className="rounded-2xl border border-stone-200 p-3.5" placeholder="Full name" value={address.name} onChange={(event) => setAddress((current) => ({ ...current, name: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 p-3.5" placeholder="Phone" value={address.phone} onChange={(event) => setAddress((current) => ({ ...current, phone: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 p-3.5 sm:col-span-2" placeholder="Address line 1" value={address.line1} onChange={(event) => setAddress((current) => ({ ...current, line1: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 p-3.5 sm:col-span-2" placeholder="Address line 2 (optional)" value={address.line2} onChange={(event) => setAddress((current) => ({ ...current, line2: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 p-3.5" placeholder="City" value={address.city} onChange={(event) => setAddress((current) => ({ ...current, city: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 p-3.5" placeholder="State" value={address.state} onChange={(event) => setAddress((current) => ({ ...current, state: event.target.value }))} />
              <input className="rounded-2xl border border-stone-200 p-3.5" placeholder="Pincode" value={address.pincode} onChange={(event) => setAddress((current) => ({ ...current, pincode: event.target.value }))} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
            <h2 className="font-semibold text-stone-900">Payment method</h2>
            <label className="mt-4 flex items-center gap-3 rounded-2xl border border-stone-200 p-4">
              <input type="radio" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} />
              <div>
                <p className="font-semibold text-stone-900">Cash on Delivery</p>
                <p className="text-sm text-stone-500">Pay when your order arrives.</p>
              </div>
            </label>
            <label className="mt-3 flex items-center gap-3 rounded-2xl border border-stone-200 p-4">
              <input type="radio" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} />
              <div>
                <p className="font-semibold text-stone-900">Mock Online Payment</p>
                <p className="text-sm text-stone-500">Structured so Razorpay or another gateway can be plugged in later.</p>
              </div>
            </label>
          </div>
        </div>

        <div className="rounded-[2rem] border border-stone-200 bg-white p-6">
          <h2 className="font-semibold text-stone-900">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm">
            {cart.map((item) => (
              <div key={`${item._id}-${item.selectedColor || "default"}`} className="flex justify-between gap-3">
                <span>{item.name} x {item.qty}{item.selectedColor ? ` • ${item.selectedColor}` : ""}</span>
                <span>{formatCurrency((item.discountPrice || item.price) * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2 border-t border-stone-100 pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? "Free" : formatCurrency(shippingFee)}</span></div>
            <div className="flex justify-between text-lg font-semibold text-stone-900"><span>Total</span><span>{formatCurrency(totalAmount)}</span></div>
          </div>
          <p className="mt-3 text-xs text-stone-500">
            {shippingFee === 0 ? "You unlocked free shipping above Rs. 999." : "Free delivery applies for orders above Rs. 999."}
          </p>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <button
            type="button"
            onClick={placeOrder}
            disabled={!cart.length || processing || !address.name || !address.phone || !address.line1 || !address.city || !address.state || !address.pincode}
            className="mt-6 w-full rounded-2xl bg-brand-700 px-5 py-3 text-white disabled:opacity-50"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
