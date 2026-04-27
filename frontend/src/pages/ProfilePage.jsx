import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffdf9_0%,#f5efe6_100%)]">
      <div className="mx-auto max-w-5xl px-4 py-12">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Your profile</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-900">Account hub</h1>
        <p className="mt-2 max-w-2xl text-stone-600">
          Review your saved details, orders, wishlist activity, and the authentication methods connected to your ORNAQ account.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_1fr]">
          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
            <h2 className="text-xl font-semibold text-stone-900">Basic details</h2>
            <div className="mt-5 space-y-4 text-sm text-stone-600">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Name</p>
                <p className="mt-1 text-base font-semibold text-stone-900">{user?.name || "ORNAQ customer"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Email</p>
                <p className="mt-1">{user?.email || "Not added yet"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Phone</p>
                <p className="mt-1">{user?.phone || "Not added yet"}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-400">Sign-in methods</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(user?.authProviders || ["password"]).map((provider) => (
                    <span key={provider} className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
                      {provider.replace("_", " ")}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm shadow-stone-200/40">
            <h2 className="text-xl font-semibold text-stone-900">Quick actions</h2>
            <div className="mt-5 grid gap-3">
              <Link to="/profile/orders" className="rounded-[1.25rem] border border-stone-200 px-4 py-4 text-sm font-semibold text-stone-800 transition hover:border-brand-300 hover:text-brand-800">
                View order history
              </Link>
              <Link to="/wishlist" className="rounded-[1.25rem] border border-stone-200 px-4 py-4 text-sm font-semibold text-stone-800 transition hover:border-brand-300 hover:text-brand-800">
                Open wishlist
              </Link>
              <Link to="/shop?sort=trending" className="rounded-[1.25rem] border border-stone-200 px-4 py-4 text-sm font-semibold text-stone-800 transition hover:border-brand-300 hover:text-brand-800">
                Explore trending sarees
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
