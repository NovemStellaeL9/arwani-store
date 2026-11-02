"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { getProviderLogo } from "@/utils/helpers";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";

const operatorShortcuts = [
  { name: "XL & Axis", category: "XL & Axis", logo: "/xl.png" },
  { name: "Telkomsel", category: "Telkomsel", logo: "/telkomsel.png" },
  { name: "Indosat", category: "Indosat", logo: "/indosat.png" },
  { name: "Tri", category: "Tri", logo: "/tri.png" },
  { name: "Token PLN", category: "PLN", isIcon: true, icon: "⚡" },
  { name: "Saldo DANA", category: "E-Wallet", isIcon: true, icon: "💳" },
  { name: "Pulsa Transfer", category: "Pulsa", isIcon: true, icon: "📱" },
  { name: "Masa Aktif", category: "Masa Aktif", isIcon: true, icon: "⏳" },
  { name: "Semua Paket", category: "Semua", isIcon: true, icon: "📦" },
];

export default function Home() {
  const router = useRouter();
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.products)) {
          const list: Product[] = json.products;
          // Pick highlight packages (Akrab V4, Flex, Freedom, Tri Happy, PLN, DANA)
          const picks = list.filter((p) => {
            const n = p.name.toLowerCase();
            return (
              n.includes("v4") ||
              n.includes("flex max 7gb") ||
              n.includes("freedom internet 8gb") ||
              n.includes("tri data happy 7gb") ||
              n.includes("pln 20.000") ||
              n.includes("dana 10 ribu")
            );
          }).slice(0, 6);

          setPopularProducts(picks.length > 0 ? picks : list.slice(0, 6));

          // Load favorites
          if (typeof window !== "undefined") {
            const stored = localStorage.getItem("favorites");
            if (stored) {
              const favIds: (string | number)[] = JSON.parse(stored);
              setFavorites(favIds);
              const matched = list.filter((p) => favIds.includes(p.id));
              setFavoriteProducts(matched);
            }
          }
        }
      } catch (err) {
        console.error("Gagal memuat produk beranda:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategoryClick = (category: string) => {
    router.push(`/semua-produk?category=${encodeURIComponent(category)}`);
  };

  const handleToggleFavorite = (id: string | number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#081225] pb-28 text-white">
      {/* Header Bar */}
      <Header />

      {/* Main Container */}
      <div className="px-5 mt-5 space-y-6">
        {/* PROMO HERO BANNER */}
        <Link href="/semua-produk?category=XL+%26+Axis" className="block focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-3xl">
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 border border-white/15 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-white/30 transition-all">
            <span className="inline-block px-2.5 py-1 bg-amber-400 text-slate-950 text-[9px] font-black rounded-lg uppercase tracking-wider mb-2">
              Paket Rekomendasi
            </span>
            <h2 className="text-base font-black leading-snug tracking-wide text-white">
              Paket XL Akrab & Flex Kuota Besar
            </h2>
            <p className="text-xs text-blue-100 font-medium mt-1 max-w-[85%] leading-relaxed">
              Mulai dari 10 GB hingga 600 GB, tersedia stok real-time langsung aktif 24 jam.
            </p>
            <div className="flex items-center gap-1.5 mt-3.5 text-xs font-bold text-amber-300">
              <span>Buka Katalog XL & Axis</span>
              <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </Link>

        {/* TRANSAKSI QUICK SHORTCUT BANNER */}
        <div className="bg-[#0e1a34] rounded-2xl p-4 border border-white/10 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
              🔍
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sudah Melakukan Pemesanan?</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Periksa status transaksi Anda dengan ID Referensi</p>
            </div>
          </div>
          <Link
            href="/transaksi"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex-shrink-0 transition-colors"
          >
            Lacak
          </Link>
        </div>

        {/* CHOOSE OPERATOR & SERVICE GRID */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Pilih Layanan & Operator
            </p>
            <Link href="/semua-produk" className="text-[11px] font-bold text-blue-400 hover:text-blue-300">
              Lihat Semua
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {operatorShortcuts.map((item) => (
              <button
                key={item.name}
                onClick={() => handleCategoryClick(item.category)}
                className="bg-[#0e1a34] hover:bg-[#132244] border border-white/10 hover:border-blue-500/30 rounded-2xl p-3 flex flex-col items-center justify-center text-center transition-all focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <div className="h-11 w-11 rounded-xl bg-white/5 p-1.5 flex items-center justify-center mb-2 border border-white/10">
                  {item.isIcon ? (
                    <span className="text-xl">{item.icon}</span>
                  ) : (
                    <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" />
                  )}
                </div>
                <span className="text-[10px] font-bold text-white leading-tight">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* POPULAR PACKAGES (LIVE STOCK) */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Paket Pilihan Terpopuler
              </p>
              <p className="text-[11px] text-slate-400">Langsung terhubung dengan stok server</p>
            </div>
            <Link href="/semua-produk" className="text-xs font-bold text-blue-400 hover:text-blue-300">
              Semua Paket
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#0e1a34] rounded-2xl p-4 border border-white/10 space-y-3 h-44 animate-pulse">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-4 bg-white/10 rounded w-3/4" />
                  <div className="h-6 bg-white/10 rounded-xl w-full mt-4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {popularProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isFavorite={favorites.includes(p.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectProduct={handleSelectProduct}
                />
              ))}
            </div>
          )}
        </div>

        {/* FAVORITES (IF ANY) */}
        {favoriteProducts.length > 0 && (
          <div>
            <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Paket Tersimpan ({favoriteProducts.length})
            </p>
            <div className="grid grid-cols-2 gap-3">
              {favoriteProducts.slice(0, 4).map((p) => (
                <ProductCard
                  key={`fav-${p.id}`}
                  product={p}
                  isFavorite={true}
                  onToggleFavorite={handleToggleFavorite}
                  onSelectProduct={handleSelectProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}