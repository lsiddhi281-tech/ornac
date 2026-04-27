import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import heroBanner from "../assets/hero-banner.png";
import catSilk from "../assets/category-silk.png";
import catWedding from "../assets/category-wedding.png";

export default function HomePage() {
  const [homeFeed, setHomeFeed] = useState({
    newArrivals: [],
    trending: [],
    recommended: []
  });

  useEffect(() => {
  api.get("/products/home-feed")
    .then((response)=>{
      console.log(response.data);
      setHomeFeed(response.data);
    })
    .catch((err)=>{
      console.log(err);
    });
}, []);


  const categories = [
    { name: "Silk", img: catSilk, slug: "Silk" },
    { name: "Wedding Sarees", img: catWedding, slug: "Wedding Sarees" },
    { name: "Cotton", img: catSilk, slug: "Cotton" },
    { name: "Paithani", img: catWedding, slug: "Paithani" }
  ];

  return (
    <div className="min-h-screen bg-zinc-50/30 pb-20">
      <section className="relative h-[60vh] overflow-hidden md:h-[82vh]">
        <img src={heroBanner} alt="Luxury Sarees" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,141,107,0.35),transparent_32%)]" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl text-white">
            <span className="mb-4 inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-semibold backdrop-blur-md">
              ORNAQ Saree House 2026
            </span>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Handpicked sarees for <span className="text-brand-300">weddings, gifting, and everyday grace</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-zinc-200 md:text-xl">
              Explore new arrivals, festive Paithani statements, breathable cotton drapes, and premium wedding silhouettes in one polished storefront.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/shop" className="rounded-full bg-white px-8 py-4 text-lg font-bold text-zinc-900 transition-transform hover:scale-105">
                Shop Collection
              </Link>
              <Link to="/shop?isNewArrival=true" className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
                View New Arrivals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Browse Categories</h2>
          <Link to="/shop" className="text-sm font-bold text-brand-700 hover:underline">See all collections</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((category) => (
            <motion.div
              key={category.name}
              whileHover={{ y: -5 }}
              className="group relative h-48 overflow-hidden rounded-2xl shadow-lg md:h-64"
            >
              <Link to={`/shop?category=${encodeURIComponent(category.slug)}`} className="block h-full">
                <img src={category.img} alt={category.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
                <div className="absolute inset-0 flex items-end p-6">
                  <p className="text-xl font-bold uppercase tracking-widest text-white">{category.name}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Fresh drops</p>
          <h2 className="text-3xl font-bold text-zinc-900">🔥 New Arrivals</h2>
          <p className="text-zinc-500">Recently launched styles your admin team has marked for the spotlight.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {homeFeed.newArrivals.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="mt-24 bg-zinc-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Trending Now</h2>
              <p className="mt-2 text-zinc-400">The sarees drawing the most interest across views, carts, and purchases.</p>
            </div>
            <Link to="/shop?sort=trending" className="rounded-full border border-white/20 px-6 py-2 text-sm font-bold transition-all hover:bg-white/10">Explore Trends</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {homeFeed.trending.map((product) => <ProductCard key={product._id} product={product} dark />)}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-4">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700">Recommended</p>
            <h2 className="mt-2 text-3xl font-bold text-zinc-900">Storefront picks</h2>
          </div>
          <Link to="/shop?sort=popularity" className="text-sm font-bold text-brand-700 hover:underline">See more</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {homeFeed.recommended.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-5xl px-4">
        <div className="grid gap-8 border-y border-zinc-200 py-12 md:grid-cols-3">
          {[
            { title: "Color Variants", desc: "Browse multiple tones per saree directly on product pages", label: "Variants" },
            { title: "3-5 Day Delivery", desc: "Pincode-aware delivery checks with free shipping above Rs. 999", label: "Delivery" },
            { title: "Smart Reviews", desc: "Ratings, review images, and verified purchase feedback", label: "Reviews" }
          ].map((item) => (
            <div key={item.title} className="text-center">
              <span className="text-sm font-bold uppercase tracking-[0.24em] text-brand-700">{item.label}</span>
              <h3 className="mt-4 font-bold text-zinc-900">{item.title}</h3>
              <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
