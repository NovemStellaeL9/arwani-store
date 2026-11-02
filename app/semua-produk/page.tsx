"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Product, ActiveCategory } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";
import { getActiveProviders } from "@/lib/providers";

function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-[#081225] px-5 py-6 space-y-4 text-white">
      <div className="flex items-center gap-2 mb-4 animate-pulse">
        <div className="h-9 bg-white/5 rounded-xl w-28" />
        <div className="h-6 bg-white/5 rounded-xl w-36 ml-auto" />
      </div>
      <div className="h-12 bg-white/5 rounded-2xl w-full animate-pulse" />
      <div className="grid grid-cols-2 gap-3 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#0e1a34] rounded-2xl p-4 border border-white/10 space-y-3">
            <div className="h-8 bg-white/5 rounded-xl w-1/3 animate-pulse" />
            <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-8 bg-white/5 rounded-xl w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

function CatalogContent() {
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("Semua");
  const [activeSubgroup, setActiveSubgroup] = useState("Semua Sub-Kategori");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"Default" | "Termurah" | "Termahal" | "AZ">("Default");
  const [stockOnly, setStockOnly] = useState(false);
  const [favorites, setFavorites] = useState<(string | number)[]>([]);
  const [visibleCount, setVisibleCount] = useState(24);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Modal checkout
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Parse Initial Search Parameters
  useEffect(() => {
    const catParam = searchParams.get("category");
    const queryParam = searchParams.get("query");

    if (catParam) {
      if (catParam === "MasaAktif" || catParam === "Masa Aktif") setActiveCategory("Masa Aktif");
      else setActiveCategory(catParam as ActiveCategory);
    }
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);

  // Load live products from API
  const fetchProducts = async () => {
    setIsLoading(true);
    setLoadError("");
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.products)) {
        setAllProducts(json.products);
        setIsLiveApi(Boolean(json.isLive));
      } else {
        throw new Error(json.message || "Gagal memuat produk.");
      }
    } catch (err: any) {
      console.error("Gagal mengambil data produk:", err);
      setLoadError(err?.message || "Koneksi terputus saat memuat katalog produk.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    if (typeof window !== "undefined") {
      try {
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) {
          setFavorites(JSON.parse(storedFavs));
        }
      } catch (e) {
        console.error("Gagal membaca favorit:", e);
      }
    }
  }, []);

  const handleToggleFavorite = (id: string | number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id];
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return updated;
    });
  };

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(24);
  }, [activeCategory, activeSubgroup, searchQuery, sortBy, stockOnly]);

  const availableProducts = allProducts.filter((product) =>
    product.isAvailable ?? ((product.stock ?? 0) > 0)
  );
  const activeProviders = getActiveProviders(allProducts);
  const activeGroups = new Set(
    availableProducts.map((product) => product.group || product.category)
  );
  const providerCategories: ActiveCategory[] = [
    "XL & Axis",
    "Telkomsel",
    "by.U",
    "Smartfren",
    "Indosat",
    "Tri",
  ];
  const serviceCategories: ActiveCategory[] = ["PLN", "E-Wallet", "Pulsa", "Masa Aktif"];
  const categoriesList: ActiveCategory[] = [
    "Semua",
    ...providerCategories.filter((provider) => activeProviders.includes(provider)),
    ...serviceCategories.filter((category) => activeGroups.has(category)),
  ];

  // Filter based on selected category
  const categoryProducts = useMemo(() => {
    if (activeCategory === "Semua") {
      return allProducts;
    }
    return allProducts.filter((p) => {
      if (activeCategory === "Masa Aktif") {
        return p.group === "Masa Aktif" || p.category.includes("MASA_AKTIF");
      }
      if (activeCategory === "XL & Axis") {
        return p.group === "XL & Axis" || p.operator === "XL & Axis" || p.operator === "XL" || p.operator === "Axis";
      }
      if (activeCategory === "PLN") {
        return p.group === "PLN" || p.category === "PLN";
      }
      if (activeCategory === "E-Wallet") {
        return p.group === "E-Wallet" || p.name.toLowerCase().includes("dana");
      }
      if (activeCategory === "Pulsa") {
        return p.group === "Pulsa" || p.name.toLowerCase().includes("pulsa");
      }
      return p.operator === activeCategory || p.group === activeCategory;
    });
  }, [allProducts, activeCategory]);

  // Subgroups available for the active category
  const availableSubgroups = useMemo(() => {
    const subs = Array.from(new Set(categoryProducts.map((p) => p.subgroup || p.category).filter(Boolean)));
    return ["Semua Sub-Kategori", ...subs];
  }, [categoryProducts]);

  // Process filters and search
  const filteredProducts = useMemo(() => {
    let list = [...categoryProducts];

    if (activeSubgroup !== "Semua Sub-Kategori") {
      list = list.filter((p) => (p.subgroup || p.category) === activeSubgroup);
    }

    if (stockOnly) {
      list = list.filter((p) => (p.stock ?? 0) > 0 || p.stock === 999);
    }

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.code && p.code.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.operator && p.operator.toLowerCase().includes(q)) ||
          (p.subgroup && p.subgroup.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === "Termurah") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Termahal") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "AZ") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [categoryProducts, activeSubgroup, stockOnly, searchQuery, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const handleOpenCheckout = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#081225] text-white px-5 py-6 pb-28 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors mb-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
          <h1 className="text-xl font-black text-white tracking-wide">
            Katalog Paket & Layanan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {allProducts.length} produk langsung terhubung dengan server stok
          </p>
        </div>

        {/* Live sync badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{isLiveApi ? "Stok Real-Time" : "Katalog Aktif"}</span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama paket, kuota, atau kode produk..."
          className="w-full px-4 py-3 pl-10 bg-[#0e1a34] border border-white/15 rounded-xl text-white placeholder-slate-400 text-xs font-medium focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all"
        />
        <svg
          className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs p-1"
            aria-label="Bersihkan pencarian"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-5 px-5">
        {categoriesList.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setActiveSubgroup("Semua Sub-Kategori");
              }}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-[#0e1a34] text-slate-300 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Secondary Filter Row: Subgroup, Stock, Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
        {/* Subgroups dropdown */}
        {availableSubgroups.length > 2 && (
          <select
            value={activeSubgroup}
            onChange={(e) => setActiveSubgroup(e.target.value)}
            className="px-3 py-2 bg-[#0e1a34] border border-white/15 rounded-xl text-white font-medium text-xs outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            {availableSubgroups.map((sub) => (
              <option key={sub} value={sub} className="bg-[#081225] text-white">
                {sub}
              </option>
            ))}
          </select>
        )}

        <div className="flex items-center gap-2 ml-auto">
          {/* Stock only toggle */}
          <button
            onClick={() => setStockOnly((prev) => !prev)}
            className={`px-3 py-2 rounded-xl font-bold text-xs border transition-colors ${
              stockOnly
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                : "bg-[#0e1a34] text-slate-300 border-white/10 hover:text-white"
            }`}
          >
            {stockOnly ? "✓ Hanya yang Ada Stok" : "Semua Stok"}
          </button>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-[#0e1a34] border border-white/15 rounded-xl text-white font-medium text-xs outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            <option value="Default" className="bg-[#081225]">Urutan Default</option>
            <option value="Termurah" className="bg-[#081225]">Harga Termurah</option>
            <option value="Termahal" className="bg-[#081225]">Harga Termahal</option>
            <option value="AZ" className="bg-[#081225]">Nama A-Z</option>
          </select>
        </div>
      </div>

      {/* Products Count Indicator */}
      <div className="flex justify-between items-center text-xs text-slate-400">
        <span>Menampilkan {filteredProducts.length} Produk</span>
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("Semua");
              setActiveSubgroup("Semua Sub-Kategori");
              setStockOnly(false);
            }}
            className="text-blue-400 hover:text-blue-300 font-bold"
          >
            Reset Semua Filter
          </button>
        )}
      </div>

      {/* Error State */}
      {loadError && (
        <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-4 text-center space-y-2">
          <p className="text-xs text-rose-300 font-bold">{loadError}</p>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Muat Ulang Katalog
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#0e1a34] rounded-2xl p-4 border border-white/10 space-y-3 h-44 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3" />
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-6 bg-white/10 rounded-xl w-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="bg-[#0e1a34] rounded-3xl p-8 border border-white/10 text-center space-y-3 mt-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Tidak Ada Produk yang Sesuai</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Cobalah mengganti kata kunci pencarian atau memilih kategori lain.
            </p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("Semua");
              setActiveSubgroup("Semua Sub-Kategori");
              setStockOnly(false);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Tampilkan Semua Produk
          </button>
        </div>
      ) : (
        /* Product Cards Grid */
        <div className="grid grid-cols-2 gap-3">
          {displayedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFavorite={favorites.includes(p.id)}
              onToggleFavorite={handleToggleFavorite}
              onSelectProduct={handleOpenCheckout}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="text-center pt-3">
          <button
            onClick={() => setVisibleCount((prev) => prev + 24)}
            className="w-full py-3 bg-[#0e1a34] hover:bg-white/10 border border-white/15 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Tampilkan Lebih Banyak ({filteredProducts.length - visibleCount} tersisa)
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function SemuaProdukPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </Suspense>
  );
}
