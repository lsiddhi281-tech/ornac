import { useState } from "react";
import api from "../../services/api";
import { formatCurrency } from "../../utils/catalog";

const STATUS_COLORS = {
  PLACED: "bg-blue-100 text-blue-700",
  CONFIRMED: "bg-indigo-100 text-indigo-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  OUT_FOR_DELIVERY: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
  PAYMENT_FAILED: "bg-red-50 text-red-600"
};

const FILTERS = [
  { label: "All", value: "" },
  { label: "Placed", value: "PLACED" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" }
];

export default function OrderManagement({ orders, refreshOrders, filterValue, onFilterChange }) {
  const [updatingId, setUpdatingId] = useState(null);

  const updateOrder = async (id, orderStatus) => {
    setUpdatingId(id);
    try {
      await api.patch(`/orders/${id}/status`, { orderStatus });
      refreshOrders();
    } catch {
      window.alert("Error updating order");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-zinc-900">Order Management</h2>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.label}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filterValue === filter.value ? "bg-brand-700 text-white" : "bg-stone-100 text-stone-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 text-xs font-bold uppercase text-zinc-500">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {orders.map((order) => (
              <tr key={order._id} className="group hover:bg-zinc-50/50">
                <td className="px-6 py-4 font-mono font-bold text-zinc-900">#{order._id.slice(-8).toUpperCase()}</td>
                <td className="px-6 py-4">
                  <p className="font-semibold text-zinc-900">{order.userId?.name || "Guest"}</p>
                  <p className="text-xs text-zinc-400">{order.userId?.email}</p>
                </td>
                <td className="px-6 py-4 font-bold text-zinc-900">{formatCurrency(order.totalAmount)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_COLORS[order.orderStatus] || "bg-zinc-100"}`}>
                    {order.orderStatus.replaceAll("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select
                      disabled={updatingId === order._id}
                      className="rounded-lg border border-zinc-200 p-1.5 text-xs outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50"
                      value={order.orderStatus}
                      onChange={(event) => updateOrder(order._id, event.target.value)}
                    >
                      {["PLACED", "CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"].map((status) => (
                        <option key={status} value={status}>{status.replaceAll("_", " ")}</option>
                      ))}
                    </select>
                    <a
                      href={`/profile/orders/${order._id}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-zinc-200 p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-600"
                      title="View Order"
                    >
                      View
                    </a>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-sm text-stone-500">
                  No orders found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
