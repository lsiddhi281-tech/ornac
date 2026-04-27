import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useRealtime } from "../hooks/useRealtime";
import AdminStats from "../components/admin/AdminStats";
import OrderManagement from "../components/admin/OrderManagement";
import { formatCurrency, getProductImage } from "../utils/catalog";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    lowStockCount: 0,
    lowStockItems: [],
    recentOrders: [],
    dailyRevenue: [],
    topSellingProducts: [],
    productAnalytics: []
  });
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    const response = await api.get("/admin/dashboard");
    setDashboard(response.data);
  };

  const fetchOrders = async (status = orderFilter) => {
    const response = await api.get("/orders", { params: status ? { status } : {} });
    setOrders(response.data);
  };

  const fetchData = async (status = orderFilter) => {
    try {
      await Promise.all([fetchDashboard(), fetchOrders(status)]);
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useRealtime({
    onStockUpdate: () => fetchData(),
    onOrderUpdate: () => fetchData(orderFilter)
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f7f0e7_100%)] pb-20">
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Admin dashboard</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">Store command center</h1>
            <p className="mt-2 max-w-2xl text-stone-600">
              Monitor catalog performance, track revenue, act on low-stock alerts, and move orders through fulfillment without touching customer storefront screens.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/products" className="rounded-full border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-800 transition hover:border-brand-300 hover:text-brand-800">
              Manage products
            </Link>
            <Link to="/admin/products/add" className="rounded-full bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-800">
              Add product
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-10 max-w-7xl px-4">
        <AdminStats dashboard={dashboard} />

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.5rem] bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-700">Revenue overview</p>
                <p className="mt-4 text-3xl font-semibold text-stone-900">{formatCurrency(dashboard.totalRevenue)}</p>
                <p className="mt-2 text-sm text-stone-500">Average order value: {formatCurrency(dashboard.averageOrderValue)}</p>
              </div>
              <div className="rounded-[1.5rem] bg-stone-50 p-4">
                <p className="text-sm font-semibold text-stone-700">Daily revenue</p>
                <div className="mt-4 space-y-3">
                  {(dashboard.dailyRevenue || []).map((entry) => (
                    <div key={entry._id} className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">{entry._id}</span>
                      <span className="font-semibold text-stone-900">{formatCurrency(entry.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Inventory watch</p>
                <h2 className="mt-2 text-2xl font-semibold text-stone-900">Low stock items</h2>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                {dashboard.lowStockCount} alerts
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {dashboard.lowStockItems.map((product) => (
                <div key={product._id} className="flex items-center gap-4 rounded-[1.5rem] border border-stone-100 bg-stone-50/70 p-4">
                  <img src={getProductImage(product)} alt={product.name} className="h-16 w-14 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-stone-900">{product.name}</p>
                    <p className="mt-1 truncate text-xs text-stone-500">{product.category} • {product.fabric}</p>
                    <p className="mt-1 text-xs text-stone-500">{formatCurrency(product.price)}</p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-amber-700">{product.stock} left</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-stone-400">Advanced analytics</p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900">User interest score</h2>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {(dashboard.productAnalytics || []).map((product) => (
              <article key={product._id} className="rounded-[1.5rem] border border-stone-100 p-4">
                <div className="flex gap-3">
                  <img src={getProductImage(product)} alt={product.name} className="h-16 w-14 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-stone-900">{product.name}</p>
                    <p className="text-xs text-stone-500">{product.category}</p>
                    <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-700">Interest score {product.interestScore}</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-stone-500">
                  <div>Views: {product.analytics?.views || product.views || 0}</div>
                  <div>Cart adds: {product.analytics?.cartAdds || 0}</div>
                  <div>Wishlist saves: {product.analytics?.wishlistAdds || 0}</div>
                  <div>Purchases: {product.analytics?.purchases || product.soldCount || 0}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
          {loading ? (
            <div className="py-12 text-center text-stone-500">Loading dashboard...</div>
          ) : (
            <OrderManagement
              orders={orders}
              refreshOrders={() => fetchData(orderFilter)}
              filterValue={orderFilter}
              onFilterChange={(value) => {
                setOrderFilter(value);
                fetchData(value);
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}
