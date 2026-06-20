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

// Skeleton screen loader for Suspense & initial state
function CatalogSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] px-5 py-6 space-y-4">
      <div className="flex items-center gap-2 mb-4 animate-pulse">
        <div className="h-9 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-32 ml-auto" />
      </div>
      <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full animate-pulse" />
      <div className="grid grid-cols-2 gap-3 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-150 dark:border-slate-800/80 space-y-3">
            <div className="h-8 bg-slate-200 dark:bg-slate-850 rounded w-1/3 animate-pulse" />
            <div className="h-6 bg-slate-200 dark:bg-slate-850 rounded w-3/4 animate-pulse" />
            <div className="h-10 bg-slate-200 dark:bg-slate-850 rounded-xl w-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Inner catalog contents (reads search params)
function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State Management
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<ActiveCategory>("Telkomsel");
  const [activeType, setActiveType] = useState("Semua Tipe");
  const [activeMaOp, setActiveMaOp] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"Default" | "Termurah" | "Termahal">("Default");
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
  }, [activeCategory, activeType, activeMaOp, searchQuery, sortBy]);

  // ── LOGIKA FILTERING & SORTING DENGAN MEMOIZATION (useMemo) ──
  const baseCategoryProducts = useMemo(() => {
    let filtered = allProducts.filter((p) => p.category === activeCategory);

    // Filter by Masa Aktif Operator Sub-tab
    if (activeCategory === "MasaAktif" && activeMaOp !== "Semua") {
      filtered = filtered.filter((p) => p.desc === activeMaOp);
    }
    return filtered;
  }, [allProducts, activeCategory, activeMaOp]);

  // Dynamically calculate available package types from the base category products
  const availableTypes = useMemo(() => {
    const nonAkrabBase = baseCategoryProducts.filter(
      (p) => !p.name.toLowerCase().includes("akrab")
    );
    return ["Semua Tipe", ...Array.from(new Set(nonAkrabBase.map((p) => getPackageType(p.name))))];
  }, [baseCategoryProducts]);

  // Filter, Search, and Sort display items
  const processedItems = useMemo(() => {
    let list = [...baseCategoryProducts];

    // 1. Search Query Filter
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );
    }

    // 2. Package Type Pills Filter
    if (activeType !== "Semua Tipe" && activeCategory !== "MasaAktif") {
      list = list.filter((p) => getPackageType(p.name) === activeType);
    }

    // 3. Sorting logic
    if (sortBy === "Termurah") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "Termahal") {
      list.sort((a, b) => b.price - a.price);
    }

    // 4. Group AKRAB variants into a master card (For XL & Axis category)
    const akrabGroup = list.filter((p) => p.name.toLowerCase().includes("akrab"));
    const finalItems: DisplayItem[] = list.filter((p) => !p.name.toLowerCase().includes("akrab"));

    if (akrabGroup.length > 0) {
      // Calculate min price for the group
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
  }, [baseCategoryProducts, searchQuery, activeType, activeCategory, sortBy]);

  // Slice list based on visible page size (Virtualization Fallback)
  const paginatedItems = useMemo(() => {
    return processedItems.slice(0, visibleCount);
  }, [processedItems, visibleCount]);

  // Infinite Scroll / Intersection Observer to load more items
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
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] pb-10 transition-colors duration-500">
      
      {/* Top sticky controls */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-white/10 relative z-20">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <span className="text-xs font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
          Katalog Paket
        </span>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {/* Category horizontal scrolling bar */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-5 px-5">
          {(["Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren", "MasaAktif"] as const).map(
            (cat) => {
              const isActive = activeCategory === cat;
              const logo = getProviderLogo(cat === "MasaAktif" ? "Telkomsel" : cat);
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-sm border ${
                    isActive
                      ? "bg-orange-500 dark:bg-emerald-500 text-white border-orange-500 dark:border-emerald-500"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-slate-100 dark:border-slate-800/80 hover:border-orange-500/50 dark:hover:border-emerald-500/50"
                  }`}
                >
                  {cat === "MasaAktif" ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    logo && <img src={logo} alt={cat} className="h-4 w-4 object-contain" />
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
          activeMaOp={activeMaOp}
          onMaOpChange={setActiveMaOp}
          isMasaAktif={activeCategory === "MasaAktif"}
        />

        {/* Product Cards Layout Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 animate-pulse h-40" />
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
          <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-3xl mt-4 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
            <div className="text-5xl mb-3.5 opacity-55 animate-bounce">📦</div>
            <h4 className="text-slate-700 dark:text-slate-350 text-sm font-black uppercase tracking-wider">
              Tidak Ada Paket Ditemukan
            </h4>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1.5 px-6 font-semibold">
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
