import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useRealtime } from "../hooks/useRealtime";
import { useNotification } from "../context/NotificationContext";
import SkeletonBlock from "../components/SkeletonBlock";
import { formatCurrency } from "../utils/catalog";

const STEPS = ["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const { showToast } = useNotification();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  useRealtime({
    onOrderUpdate: (updatedOrder) => {
      if (updatedOrder._id === id) setOrder(updatedOrder);
    }
  });

  const currentStepIndex = useMemo(() => STEPS.indexOf(order?.orderStatus), [order?.orderStatus]);

  const runAction = async (type) => {
    setActionLoading(true);
    try {
      const response = await api.post(`/orders/${id}/${type}`);
      setOrder(response.data);
    } finally {
      setActionLoading(false);
    }
  };

  const reorder = async () => {
    setActionLoading(true);
    try {
      await api.post(`/orders/${id}/reorder`);
      showToast({
        title: "Items added back to cart",
        message: "You can review them before placing a fresh order.",
        tone: "success"
      });
    } finally {
      setActionLoading(false);
    }
  };

  const downloadInvoice = async () => {
    const response = await api.get(`/orders/${id}/invoice`, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <SkeletonBlock className="h-96 w-full" />
      </div>
    );
  }
  if (!order) return <div className="p-20 text-center font-medium text-red-500">Order not found. Please check your ID.</div>;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-zinc-100 pb-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Order details</p>
            <h1 className="mt-2 text-xl font-bold text-zinc-900">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-zinc-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={downloadInvoice} className="rounded-full border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-700">
              Download invoice
            </button>
            <button type="button" disabled={actionLoading} onClick={reorder} className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 disabled:opacity-50">
              Reorder
            </button>
            {order.canCancel && (
              <button type="button" disabled={actionLoading} onClick={() => runAction("cancel")} className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">
                Cancel order
              </button>
            )}
            {order.canReturn && (
              <button type="button" disabled={actionLoading} onClick={() => runAction("return")} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 disabled:opacity-50">
                Request return
              </button>
            )}
          </div>
        </div>

        <div className="mt-10">
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-0.5 bg-zinc-100 md:left-0 md:top-4 md:h-0.5 md:w-full" />
            <div className="flex flex-col space-y-12 md:flex-row md:justify-between md:space-y-0">
              {STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div key={step} className="relative z-10 flex items-center gap-4 md:flex-col md:gap-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${isCompleted ? "border-brand-600 bg-brand-600 text-white" : "border-zinc-200 bg-white text-zinc-300"}`}>
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? "text-brand-700" : isCompleted ? "text-zinc-900" : "text-zinc-400"}`}>
                      {step.replaceAll("_", " ")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-zinc-100 pt-8 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-bold uppercase text-zinc-400">Shipping To</h3>
            <p className="mt-2 font-medium text-zinc-900">
              {order.shippingAddress.name && <>{order.shippingAddress.name}<br /></>}
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state}<br />
              {order.shippingAddress.pincode}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-zinc-400">Payment & totals</h3>
            <p className="mt-2 font-medium text-zinc-900">{order.paymentMethod} • {order.paymentStatus}</p>
            <p className="mt-1 text-sm text-zinc-500">Subtotal: {formatCurrency(order.subtotal)}</p>
            <p className="text-sm text-zinc-500">Shipping: {formatCurrency(order.shippingFee)}</p>
            <p className="text-lg font-semibold text-brand-700">{formatCurrency(order.totalAmount)}</p>
            {order.refund?.status && order.refund.status !== "NONE" && (
              <p className="mt-3 text-sm text-amber-700">Refund status: {order.refund.status}</p>
            )}
            {order.returnRequest?.status && order.returnRequest.status !== "NONE" && (
              <p className="mt-2 text-sm text-amber-700">Return status: {order.returnRequest.status}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-bold uppercase text-zinc-400">Items</h3>
          <div className="mt-4 space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b border-zinc-50 py-2 last:border-0">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-zinc-900">{item.name}</p>
                    <p className="text-xs text-zinc-500">Qty: {item.qty}{item.selectedColor ? ` • ${item.selectedColor}` : ""}</p>
                  </div>
                </div>
                <p className="font-bold text-zinc-900">{formatCurrency(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-zinc-100 pt-6">
          <h3 className="text-sm font-bold uppercase text-zinc-400">Status updates</h3>
          <div className="mt-3 space-y-3">
            {(order.statusTimeline || []).map((entry, index) => (
              <div key={`${entry.status}-${index}`} className="flex items-start justify-between rounded-2xl bg-stone-50 px-4 py-3">
                <div>
                  <p className="font-semibold text-stone-900">{entry.status.replaceAll("_", " ")}</p>
                  <p className="text-sm text-stone-500">{entry.note}</p>
                </div>
                <span className="text-xs text-stone-400">{new Date(entry.changedAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <Link to="/profile/orders" className="text-sm font-semibold text-brand-700">Back to all orders</Link>
      </div>
    </div>
  );
}
