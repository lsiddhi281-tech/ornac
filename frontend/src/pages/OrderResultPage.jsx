import { Link, useLocation } from "react-router-dom";

export default function OrderResultPage() {
  const { state } = useLocation();
  const paymentStatus = state?.payment?.paymentStatus || "FAILED";
  const success = paymentStatus !== "FAILED";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="rounded-2xl border p-6 text-center">
        <h1 className={`text-2xl font-bold ${success ? "text-emerald-600" : "text-red-600"}`}>
          {success ? "Order Confirmed" : "Payment Failed"}
        </h1>
        <p className="mt-3 text-sm text-zinc-600">
          {state?.message || (success ? "Your order has been placed successfully." : "Please try again.")}
        </p>
        {state?.order?._id && <p className="mt-3 text-xs text-zinc-500">Order ID: {state.order._id}</p>}
        {state?.payment?.transactionId && <p className="mt-1 text-xs text-zinc-500">Transaction: {state.payment.transactionId}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link className="rounded-lg border px-4 py-2" to="/shop">Continue Shopping</Link>
          {state?.order?._id && <Link className="rounded-lg border px-4 py-2" to={`/profile/orders/${state.order._id}`}>View Order</Link>}
          {!success && <Link className="rounded-lg bg-brand-700 px-4 py-2 text-white" to="/checkout">Retry</Link>}
        </div>
      </div>
    </div>
  );
}
