"use client";

import React, { useState, useEffect } from "react";
import { useRouter as useAppRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getProviderLogo, formatRupiah } from "@/utils/helpers";
import { Product } from "@/types/product";
import { getDbProvider } from "@/utils/db";

const categories = ["Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren"] as const;

export default function Home() {
  const router = useAppRouter();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const db = getDbProvider();
        const allProducts = await db.getProducts();
        
        // 1. Get Latest Products (new Circel products and some flash packages)
        // Let's filter the newest ones or just grab the last 4 added (ids 26 to 30)
        const latest = allProducts.filter(p => p.name.toLowerCase().includes("circel")).slice(0, 4);
        setLatestProducts(latest.length > 0 ? latest : allProducts.slice(0, 4));

        // 2. Get Favorites from localStorage
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) {
          const favIds: number[] = JSON.parse(storedFavs);
          const favs = allProducts.filter((p) => favIds.includes(p.id));
          setFavoriteProducts(favs);
        }
      } catch (error) {
        console.error("Failed to load products for dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleCategoryClick = (cat: string) => {
    router.push(`/semua-produk?category=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] pb-8 transition-colors duration-500">
      {/* ── HEADER ── */}
      <Header />

      {/* ── CONTENT ── */}
      <div className="px-5 mt-6 space-y-6">
        
        {/* ── PROMO BANNER ── */}
        <Link href="/semua-produk?category=XL+%26+Axis&type=Circel+Reguler+28+Hari" className="block">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-5 text-white shadow-md relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
            {/* Background elements */}
            <div className="absolute right-0 bottom-0 translate-y-4 translate-x-2 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-yellow-400/20 rounded-full blur-md" />
            
            <span className="inline-block px-2.5 py-1 bg-yellow-400 text-red-700 text-[9px] font-black rounded-lg uppercase tracking-wider mb-2.5">
              Promo Terbatas 🔥
            </span>
            <h2 className="text-base font-black leading-snug tracking-wide">
              Paket XL & Axis Circel Reguler 28 Hari
            </h2>
            <p className="text-[10px] text-orange-100 font-semibold mt-1 max-w-[80%]">
              Internet full 24 jam mulai dari 10 GB hingga 69 GB. Proses instan langsung aktif!
            </p>
            <div className="flex items-center gap-1 mt-4 text-[10px] font-bold">
              <span>Beli Sekarang</span>
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </Link>

        {/* ── CHOOSE OPERATOR GRID ── */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3.5">
            Pilih Provider Paket
          </p>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="group bg-white dark:bg-slate-900 rounded-2xl p-4 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md active:scale-95 transition-all duration-300"
              >
                <div className="h-9 w-9 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                  <img src={getProviderLogo(cat)} alt={cat} className="max-h-full max-w-full object-contain filter drop-shadow-sm" />
                </div>
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 tracking-wide uppercase leading-none text-center">
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── MASA AKTIF BANNER SHORTCUT ── */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
            Perpanjangan Kartu
          </p>
          <Link href="/semua-produk?category=MasaAktif">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 flex items-center gap-3.5 border border-slate-100 dark:border-slate-800/80 hover:border-sky-500 dark:hover:border-sky-500 shadow-sm hover:shadow-md transition-all duration-300 active:scale-[0.99] group">
              <div className="w-11 h-11 bg-sky-50 dark:bg-sky-950/40 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5.5 h-5.5 text-sky-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Masa Aktif Ekstra
                </p>
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5 tracking-wide">
                  Tambah masa aktif tanpa beli kuota utama
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* ── FAVORITE PRODUCTS ── */}
        {favoriteProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Paket Favorit Anda ({favoriteProducts.length})
              </p>
              <Link href="/semua-produk" className="text-[9px] font-black text-orange-500 dark:text-emerald-400 uppercase tracking-wider">
                Lihat Semua
              </Link>
            </div>
            
            <div className="flex overflow-x-auto pb-2 gap-3 -mx-5 px-5 scrollbar-hide">
              {favoriteProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/semua-produk?category=${encodeURIComponent(p.category)}&query=${encodeURIComponent(p.name)}`}
                  className="flex-shrink-0 w-36 bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30 uppercase tracking-wider mb-2 inline-block">
                      {p.category}
                    </span>
                    <h3 className="text-[10px] font-black text-slate-700 dark:text-slate-300 leading-tight line-clamp-2">
                      {p.name}
                    </h3>
                  </div>
                  <p className="text-xs font-black text-orange-500 dark:text-emerald-400 mt-2">
                    {formatRupiah(p.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── LATEST / NEW PRODUCTS ── */}
        <div>
          <div className="flex justify-between items-center mb-3.5">
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Promo & Paket Terbaru
            </p>
            <Link href="/semua-produk?category=XL+%26+Axis&type=Circel+Reguler+28+Hari" className="text-[9px] font-black text-orange-500 dark:text-emerald-400 uppercase tracking-wider">
              Lihat Promo
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/85 shadow-sm space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12 animate-pulse" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 animate-pulse" />
                </div>
              ))
            ) : (
              latestProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/semua-produk?category=${encodeURIComponent(p.category)}&type=Circel+Reguler+28+Hari`}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 hover:border-orange-500 dark:hover:border-emerald-500 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 uppercase tracking-widest mb-2 inline-block">
                      🔥 Circel
                    </span>
                    <h3 className="text-[11px] font-black text-slate-800 dark:text-slate-300 leading-tight group-hover:text-orange-500 dark:group-hover:text-emerald-400 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide">
                      {p.desc}
                    </p>
                  </div>
                  <p className="text-xs font-black text-orange-500 dark:text-emerald-400 mt-3.5">
                    {formatRupiah(p.price)}
                  </p>
                </Link>
              ))
            )}
          </div>
        </div>



      </div>
    </div>
  );
}