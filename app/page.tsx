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
    <div className="flex flex-col min-h-screen bg-[#081225] pb-8">
      {/* ── HEADER ── */}
      <Header />

      {/* ── CONTENT ── */}
      <div className="px-5 mt-6 space-y-6">
        
        {/* ── PROMO BANNER ── */}
        <Link href="/semua-produk?category=XL+%26+Axis&type=Circel+Reguler+28+Hari" className="block">
          <div className="bg-gradient-to-r from-rose-500/80 to-amber-500/80 border border-white/10 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
            {/* Background decorative elements */}
            <div className="absolute right-0 bottom-0 translate-y-4 translate-x-2 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -left-4 -top-4 w-16 h-16 bg-amber-400/20 rounded-full blur-md" />
            
            <span className="inline-block px-2.5 py-1 bg-amber-400 text-rose-900 text-[9px] font-black rounded-lg uppercase tracking-wider mb-2.5">
              Promo Terbatas 🔥
            </span>
            <h2 className="text-base font-black leading-snug tracking-wide text-white">
              Paket XL & Axis Circel Reguler 28 Hari
            </h2>
            <p className="text-[10px] text-rose-100 font-semibold mt-1 max-w-[80%]">
              Internet full 24 jam mulai dari 10 GB hingga 69 GB. Proses instan langsung aktif!
            </p>
            <div className="flex items-center gap-1 mt-4 text-[10px] font-bold text-white">
              <span>Beli Sekarang</span>
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </Link>

        {/* ── CHOOSE OPERATOR GRID ── */}
        <div>
          <p className="text-[11px] font-bold text-[#cbd5e1] uppercase tracking-widest mb-3.5">
            Pilih Provider Paket
          </p>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className="group bg-white/[0.08] backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center border border-white/12 shadow-[0_4px_20px_0_rgba(0,0,0,0.15)] hover:scale-[1.03] hover:bg-white/[0.12] hover:border-blue-500/30 active:scale-95 transition-all duration-300"
              >
                <div className="h-14 w-14 bg-white/5 rounded-xl p-2 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110 shadow-inner border border-white/10">
                  <img src={getProviderLogo(cat)} alt={cat} className="max-h-full max-w-full object-contain filter drop-shadow-sm" />
                </div>
                <span className="text-[10px] font-black text-white tracking-wide uppercase leading-none text-center">
                  {cat}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── MASA AKTIF BANNER SHORTCUT ── */}
        <div>
          <p className="text-[11px] font-bold text-[#cbd5e1] uppercase tracking-widest mb-3">
            Perpanjangan Kartu
          </p>
          <Link href="/semua-produk?category=MasaAktif">
            <div className="bg-white/[0.08] backdrop-blur-md rounded-2xl p-4 flex items-center gap-3.5 border border-white/12 hover:border-blue-500/40 hover:bg-white/[0.12] shadow-md transition-all duration-300 active:scale-[0.99] group">
              <div className="w-11 h-11 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/30">
                <svg className="w-5.5 h-5.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-black text-white uppercase tracking-wider">
                  Masa Aktif Ekstra
                </p>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wide">
                  Tambah masa aktif tanpa beli kuota utama
                </p>
              </div>
              <svg className="w-4 h-4 text-slate-400 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        {/* ── FAVORITE PRODUCTS ── */}
        {favoriteProducts.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-[11px] font-bold text-[#cbd5e1] uppercase tracking-widest">
                Paket Favorit Anda ({favoriteProducts.length})
              </p>
              <Link href="/semua-produk" className="text-[9px] font-black text-blue-400 uppercase tracking-wider hover:text-blue-300">
                Lihat Semua
              </Link>
            </div>
            
            <div className="flex overflow-x-auto pb-2 gap-3 -mx-5 px-5 scrollbar-hide">
              {favoriteProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/semua-produk?category=${encodeURIComponent(p.category)}&query=${encodeURIComponent(p.name)}`}
                  className="flex-shrink-0 w-36 bg-white/[0.08] border border-white/12 rounded-2xl p-3 shadow-md hover:bg-white/[0.12] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider mb-2 inline-block">
                      {p.category}
                    </span>
                    <h3 className="text-[10px] font-black text-white leading-tight line-clamp-2">
                      {p.name}
                    </h3>
                  </div>
                  <p className="text-xs font-black text-[#3B82F6] mt-2">
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
            <p className="text-[11px] font-bold text-[#cbd5e1] uppercase tracking-widest">
              Promo & Paket Terbaru
            </p>
            <Link href="/semua-produk?category=XL+%26+Axis&type=Circel+Reguler+28+Hari" className="text-[9px] font-black text-blue-400 uppercase tracking-wider hover:text-blue-300">
              Lihat Promo
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white/[0.08] rounded-2xl p-4 border border-white/12 shadow-sm space-y-3">
                  <div className="h-4 bg-white/5 rounded w-12 animate-pulse" />
                  <div className="h-6 bg-white/5 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-white/5 rounded w-1/2 animate-pulse" />
                </div>
              ))
            ) : (
              latestProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/semua-produk?category=${encodeURIComponent(p.category)}&type=Circel+Reguler+28+Hari`}
                  className="bg-white/[0.08] rounded-2xl p-4 border border-white/12 hover:border-blue-500/40 hover:bg-white/[0.12] shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-widest mb-2 inline-block">
                      🔥 Circel
                    </span>
                    <h3 className="text-[11px] font-black text-white leading-tight group-hover:text-blue-400 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wide">
                      {p.desc}
                    </p>
                  </div>
                  <p className="text-xs font-black text-[#3B82F6] mt-3.5">
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