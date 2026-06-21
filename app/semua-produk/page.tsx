"use client";
 
import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Product, GroupedProduct, DisplayItem, ActiveCategory } from "@/types/product";
import { getDbProvider } from "@/utils/db";
import { getPackageType, getProviderLogo, getTypeColor } from "@/utils/helpers";
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import ProductGroup from "@/components/ProductGroup";
 
// Shimmer skeleton component matching product cards
function ProductCardSkeleton() {
  return (
    <div className="bg-white/[0.08] backdrop-blur-md rounded-2xl p-4 border border-white/12 shadow-sm flex flex-col justify-between h-44 relative overflow-hidden">
      <div className="animate-shimmer absolute inset-0 z-0" />
      <div className="space-y-3 relative z-10">
        {/* Badge skeleton */}
        <div className="h-4 bg-white/5 animate-pulse rounded-md w-16" />
        {/* Title skeleton */}
        <div className="space-y-1.5">
          <div className="h-3.5 bg-white/5 animate-pulse rounded-md w-11/12" />
          <div className="h-3.5 bg-white/5 animate-pulse rounded-md w-8/12" />
        </div>
        {/* Description skeleton */}
        <div className="h-3 bg-white/5 animate-pulse rounded-md w-10/12" />
      </div>
      <div className="flex items-center justify-between mt-4 relative z-10">
        {/* Price skeleton */}
        <div className="h-5 bg-white/5 animate-pulse rounded-md w-20" />
        {/* Button skeleton */}
        <div className="h-7 w-7 rounded-full bg-white/5 animate-pulse" />
      </div>
    </div>
  );
}

// Skeleton screen loader for initial load
function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-[#081225] px-5 py-6 space-y-4 text-white">
      <div className="flex items-center gap-2 mb-4 animate-pulse">
        <div className="h-9 bg-white/5 rounded-xl w-24" />
        <div className="h-6 bg-white/5 rounded-xl w-32 ml-auto" />
      </div>
      <div className="h-12 bg-white/5 rounded-2xl w-full animate-pulse" />
      <div className="grid grid-cols-2 gap-3 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white/[0.08] rounded-2xl p-4 border border-white/12 space-y-3">
            <div className="h-8 bg-white/5 rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-white/5 rounded w-3/4 animate-pulse" />
            <div className="h-10 bg-white/5 rounded-xl w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
 
// Inner catalog contents (reads search params)
function CatalogContent() {
  const searchParams = useSearchParams();
 
  // State Management
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("Semua");
  const [activeType, setActiveType] = useState("Semua Tipe");
  const [activeMaOp, setActiveMaOp] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"Default" | "Termurah" | "Termahal" | "AZ">("Default");
  const [priceFilter, setPriceFilter] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoading, setIsLoading] = useState(true);
 
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
 
  // Parse Initial Search Parameters
  useEffect(() => {
    const catParam = searchParams.get("category");
    const typeParam = searchParams.get("type");
    const queryParam = searchParams.get("query");
 
    if (catParam) setActiveCategory(catParam as ActiveCategory);
    if (typeParam) setActiveType(typeParam);
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);
 
  // Load products and favorites on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDbProvider();
        const prods = await db.getProducts();
        setAllProducts(prods);
 
        const storedFavs = localStorage.getItem("favorites");
        if (storedFavs) {
          setFavorites(JSON.parse(storedFavs));
        }
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
 
  // Sync favorites to localStorage
  const handleToggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };
 
  // Reset page pagination size when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [activeCategory, activeType, activeMaOp, searchQuery, sortBy, priceFilter]);
 
  // ── LOGIKA FILTERING & SORTING DENGAN MEMOIZATION (useMemo) ──
  const baseCategoryProducts = useMemo(() => {
    if (activeCategory === "Semua") {
      return allProducts.filter((p) => p.category !== "MasaAktif");
    }
    let filtered = allProducts.filter((p) => p.category === activeCategory);
 
    if (activeCategory === "MasaAktif" && activeMaOp !== "Semua") {
      filtered = filtered.filter((p) => p.desc === activeMaOp);
    }
    return filtered;
  }, [allProducts, activeCategory, activeMaOp]);
 
  const availableTypes = useMemo(() => {
    const nonAkrabBase = baseCategoryProducts.filter(
      (p) => !p.name.toLowerCase().includes("akrab")
    );
    return ["Semua Tipe", ...Array.from(new Set(nonAkrabBase.map((p) => getPackageType(p.name))))];
  }, [baseCategoryProducts]);
 
  const processedItems = useMemo(() => {
    let list = [...baseCategoryProducts];
 
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
 
    if (activeType !== "Semua Tipe" && activeCategory !== "MasaAktif") {
      list = list.filter((p) => getPackageType(p.name) === activeType);
    }
 
    if (priceFilter === "under25") {
      list = list.filter((p) => p.price < 25000);
    } else if (priceFilter === "25to50") {
      list = list.filter((p) => p.price >= 25000 && p.price <= 50000);
    } else if (priceFilter === "50to100") {
      list = list.filter((p) => p.price >= 50000 && p.price <= 100000);
    } else if (priceFilter === "over100") {
      list = list.filter((p) => p.price > 100000);
    }
 
    if (sortBy === "Termurah") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Termahal") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "AZ") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
 
    const akrabGroup = list.filter((p) => p.name.toLowerCase().includes("akrab"));
    const finalItems: DisplayItem[] = list.filter((p) => !p.name.toLowerCase().includes("akrab"));
 
    if (akrabGroup.length > 0) {
      const minPrice = Math.min(...akrabGroup.map((a) => a.price));
      finalItems.unshift({
        id: "master-akrab",
        category: "XL & Axis",
        name: "Paket Keluarga AKRAB",
        desc: "Pilih Ukuran Kuota Berdasarkan Area Anda",
        price: minPrice,
        icon: "👪",
        isGroup: true,
        variants: akrabGroup,
      } as GroupedProduct);
    }
 
    return finalItems;
  }, [baseCategoryProducts, searchQuery, activeType, activeCategory, sortBy, priceFilter]);
 
  const paginatedItems = useMemo(() => {
    return processedItems.slice(0, visibleCount);
  }, [processedItems, visibleCount]);
 
  useEffect(() => {
    if (paginatedItems.length >= processedItems.length) return;
 
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 20, processedItems.length));
        }
      },
      { rootMargin: "150px" }
    );
 
    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);
 
    return () => {
      if (currentRef) observer.unobserve(currentRef);
      observer.disconnect();
    };
  }, [paginatedItems, processedItems]);
 
  const handleCategoryClick = (cat: ActiveCategory) => {
    setActiveCategory(cat);
    setActiveType("Semua Tipe");
    setActiveMaOp("Semua");
    setSortBy("Default");
  };
 
  return (
    <div className="flex flex-col min-h-screen bg-[#081225] pb-10">
      
      {/* Sticky Header */}
      <div className="bg-white/[0.04] backdrop-blur-md text-white px-5 py-4 flex items-center justify-between border-b border-white/10 relative z-20">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <span className="text-xs font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
          Katalog Paket
        </span>
      </div>
  
      <div className="px-5 mt-5 space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-5 px-5">
          {(["Semua", "Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren", "MasaAktif"] as const).map(
            (cat) => {
              const isActive = activeCategory === cat;
              const logo = getProviderLogo(cat === "MasaAktif" || cat === "Semua" ? "Telkomsel" : cat);
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm border hover:scale-[1.03] active:scale-95 duration-300 ${
                    isActive
                      ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-500/20"
                      : "bg-white/5 text-[#cbd5e1] border-white/10 hover:border-blue-500"
                  }`}
                >
                  {cat === "MasaAktif" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : cat === "Semua" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  ) : (
                    logo && (
                      <span className="bg-white/10 p-0.5 rounded-md flex items-center justify-center h-5 w-5 border border-white/10 shadow-sm">
                        <img src={logo} alt={cat} className="h-3.5 w-3.5 object-contain" />
                      </span>
                    )
                  )}
                  {cat === "MasaAktif" ? "Masa Aktif" : cat}
                </button>
              );
            }
          )}
        </div>
  
        {/* Filter & Search Dashboard */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeType={activeType}
          onTypeChange={setActiveType}
          availableTypes={availableTypes}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          activeMaOp={activeMaOp}
          onMaOpChange={setActiveMaOp}
          isMasaAktif={activeCategory === "MasaAktif"}
        />

        {/* STATISTICS COUNTER */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Menampilkan {processedItems.length} Produk
          </span>
        </div>
  
        {/* AUTOMATED PROMO BANNERS */}
        <div className="space-y-3">
          {/* Circel Promo Banner */}
          {(activeCategory === "XL & Axis" || activeCategory === "Semua") && 
            (activeType === "Circel Reguler 28 Hari" || activeType === "Semua Tipe") && (
              <div className="bg-gradient-to-r from-rose-500/80 to-red-500/80 border border-white/10 rounded-3xl p-4 text-white shadow-lg relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
                <div className="absolute right-0 bottom-0 translate-y-4 translate-x-2 w-24 h-24 bg-white/10 rounded-full blur-lg" />
                <span className="inline-block px-2 py-0.5 bg-yellow-400 text-rose-900 text-[9px] font-black rounded uppercase tracking-wider mb-1.5">
                  Promo Spesial
                </span>
                <h3 className="text-xs font-black tracking-wide uppercase">
                  🔥 PROMO CIRCEL XL 🔥
                </h3>
                <div className="text-[10px] font-semibold text-rose-100 mt-1.5 space-y-0.5">
                  <p>• Kuota Besar Harga Hemat</p>
                  <p>• Masa Aktif 28 Hari</p>
                  <p>• Full Utama 24 Jam</p>
                </div>
              </div>
          )}
  
          {/* AKRAB Promo Banner */}
          {(activeCategory === "XL & Axis" || activeCategory === "Semua") && 
            (activeType === "AKRAB" || activeType === "Semua Tipe") && (
              <div className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 border border-white/10 rounded-3xl p-4 text-white shadow-lg relative overflow-hidden group hover:scale-[1.01] transition-all duration-300">
                <div className="absolute right-0 bottom-0 translate-y-4 translate-x-2 w-24 h-24 bg-white/10 rounded-full blur-lg" />
                <span className="inline-block px-2 py-0.5 bg-yellow-300 text-amber-900 text-[9px] font-black rounded uppercase tracking-wider mb-1.5">
                  Info Penting
                </span>
                <h3 className="text-xs font-black tracking-wide uppercase">
                  🔥 PROMO AKRAB XL & AXIS 🔥
                </h3>
                <div className="text-[10px] font-semibold text-amber-100 mt-1.5 space-y-0.5">
                  <p>• Cek Area Terlebih Dahulu</p>
                  <p>• Estimasi Kuota Berbeda Tiap Wilayah</p>
                </div>
                <a 
                  href="https://gress-cell.github.io/GRESS-CELL-CEK-AREA/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center gap-1 text-[9px] font-bold bg-white/10 text-blue-400 px-2 py-1 rounded-lg border border-white/10 hover:bg-white/20 active:scale-95 transition-all"
                >
                  Cek Area Di Sini
                  <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
          )}
        </div>
  
        {/* Product Cards Layout Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))
          ) : paginatedItems.map((item) => {
            if ("isGroup" in item && item.isGroup) {
              return (
                <ProductGroup
                  key={item.id}
                  group={item}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            }
            const prod = item as Product;
            return (
              <ProductCard
                key={prod.id}
                product={prod}
                isFavorite={favorites.includes(prod.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            );
          })}
        </div>
  
        {/* Load more trigger marker */}
        {paginatedItems.length < processedItems.length && (
          <div ref={loadMoreRef} className="py-6 text-center text-xs font-bold text-slate-400 animate-pulse">
            Memuat paket selanjutnya...
          </div>
        )}
  
        {/* Empty Search / Filter Results State */}
        {!isLoading && processedItems.length === 0 && (
          <div className="text-center py-14 bg-white/[0.08] backdrop-blur-md rounded-3xl mt-4 border border-white/12 shadow-md">
            <div className="text-5xl mb-3.5 opacity-55 animate-bounce">📦</div>
            <h4 className="text-white text-sm font-black uppercase tracking-wider">
              Tidak Ada Paket Ditemukan
            </h4>
            <p className="text-slate-400 text-xs mt-1.5 px-6 font-semibold">
              Coba gunakan kata kunci pencarian lain atau pilih kategori operator yang berbeda.
            </p>
          </div>
        )}
      </div>
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
