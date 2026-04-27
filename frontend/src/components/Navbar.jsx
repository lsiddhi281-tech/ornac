import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { businessProfile } from "../utils/businessProfile";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { cartSummary, wishlist } = useStore();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Shop", path: "/shop" },
    { name: "Cart", path: "/cart", count: cartSummary.quantity },
    { name: "Wishlist", path: "/wishlist", count: wishlist.length },
    ...(user ? [{ name: "Orders", path: "/profile/orders" }, { name: "Profile", path: "/profile" }] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <Link to="/" className="shrink-0 text-2xl font-black tracking-tight text-brand-800">
          {businessProfile.brandName}
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar />
        </div>

        <div className="hidden items-center gap-6 text-sm font-bold md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `transition-colors hover:text-brand-700 ${isActive ? "text-brand-800" : "text-stone-600"}`
              }
            >
              {link.name}
              {link.count !== undefined && (
                <span className="ml-2 rounded-full bg-brand-50 px-2 py-1 text-xs text-brand-800">{link.count}</span>
              )}
            </NavLink>
          ))}
          <a
            href={`https://wa.me/${businessProfile.phone.replace("+", "")}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700 transition-all hover:bg-emerald-100"
          >
            WhatsApp
          </a>
          <div className="h-5 w-px bg-stone-200" />
          {user ? (
            <div className="flex items-center gap-4">
              <span className="font-normal text-stone-500">Hi, {user.name.split(" ")[0]}</span>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-stone-900 px-4 py-2 text-white transition-colors hover:bg-stone-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-brand-700 px-6 py-2 text-white shadow-lg shadow-brand-200/60 transition-all hover:bg-brand-800"
            >
              Sign In
            </Link>
          )}
        </div>

        <button type="button" onClick={() => setIsOpen((current) => !current)} className="relative z-50 ml-auto block md:hidden">
          <div className="space-y-1.5">
            <motion.span animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-stone-900" />
            <motion.span animate={isOpen ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-6 bg-stone-900" />
            <motion.span animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }} className="block h-0.5 w-6 bg-stone-900" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 flex flex-col bg-white px-6 pb-8 pt-24 md:hidden"
          >
            <div className="flex flex-col gap-6">
              <SearchBar mobile onNavigate={() => setIsOpen(false)} />
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="text-3xl font-bold text-stone-900"
                >
                  {link.name}
                  {link.count !== undefined && (
                    <span className="ml-3 text-sm font-medium text-stone-400">({link.count})</span>
                  )}
                </Link>
              ))}
              <a
                href={`https://wa.me/${businessProfile.phone.replace("+", "")}`}
                target="_blank"
                rel="noreferrer"
                className="text-3xl font-bold text-emerald-500"
              >
                WhatsApp Support
              </a>
              <div className="mt-8 border-t border-stone-100 pt-8">
                {user ? (
                  <div className="space-y-4">
                    <p className="text-lg text-stone-500">
                      Logged in as <span className="font-bold text-stone-900">{user.name}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full rounded-2xl bg-stone-900 py-4 text-xl font-bold text-white shadow-xl"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-2xl bg-brand-700 py-4 text-center text-xl font-bold text-white shadow-xl shadow-brand-200/60"
                  >
                    Sign In to Account
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
