import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import SkeletonBlock from "../components/SkeletonBlock";
import { formatCurrency } from "../utils/catalog";

const statusClasses = {
  PLACED: "bg-blue-50 text-blue-700",
  CONFIRMED: "bg-indigo-50 text-indigo-700",
  SHIPPED: "bg-violet-50 text-violet-700",
  OUT_FOR_DELIVERY: "bg-amber-50 text-amber-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
  PAYMENT_FAILED: "bg-red-50 text-red-700"
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/user")
      .then((response) => setOrders(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f7f0e7_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Your orders</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">Order history</h1>
        <p className="mt-2 text-stone-600">Track placed orders, open full details, and request cancellation or return where available.</p>

        <div className="mt-8 space-y-4">
          {loading &&
            Array.from({ length: 3 }).map((_, index) => <SkeletonBlock key={index} className="h-36 w-full" />)}

          {!loading && orders.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white px-6 py-16 text-center shadow-sm shadow-stone-200/40">
              <h2 className="text-2xl font-semibold text-stone-900">No orders yet</h2>
              <p className="mt-2 text-stone-500">Your placed orders will appear here once checkout is complete.</p>
              <Link to="/shop" className="mt-6 inline-flex rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
                Start shopping
              </Link>
            </div>
          )}

          {!loading &&
            orders.map((order) => (
              <Link
                key={order._id}
                to={`/profile/orders/${order._id}`}
                className="block rounded-[2rem] border border-stone-200 bg-white p-5 shadow-sm shadow-stone-200/40 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Order ID</p>
                    <p className="mt-2 font-semibold text-stone-900">#{order._id.slice(-8).toUpperCase()}</p>
                    <p className="mt-1 text-sm text-stone-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Payment</p>
                    <p className="mt-2 text-sm font-semibold text-stone-900">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Total</p>
                    <p className="mt-2 text-sm font-semibold text-stone-900">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div className="md:text-right">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[order.orderStatus] || "bg-stone-100 text-stone-700"}`}>
                      {order.orderStatus.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
