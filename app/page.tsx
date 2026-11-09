"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import PhoneOperatorInput from "@/components/PhoneOperatorInput";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";
import { Product, PackageCategory, OperatorName } from "@/types/product";
import { detectOperator } from "@/utils/helpers";
import { Search, AlertCircle, Package, RefreshCw } from "lucide-react";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detectedOperator, setDetectedOperator] = useState<OperatorName | "">("");
  const [activeCategory, setActiveCategory] = useState<PackageCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.products)) {
        setAllProducts(json.products);
        setIsLive(json.isLive ?? false);
        setLastUpdated(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }));
      }
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    const op = detectOperator(val) as OperatorName;
    setDetectedOperator(op || "");
  };

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      if (detectedOperator && detectedOperator !== "Semua") {
        const matchOp =
          p.operator.toLowerCase() === detectedOperator.toLowerCase() ||
          p.name.toLowerCase().includes(detectedOperator.toLowerCase());
        if (!matchOp) return false;
      }
      if (activeCategory !== "Semua") {
        if (p.packageCategory !== activeCategory) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.quota.toLowerCase().includes(q) ||
          p.validity.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [allProducts, detectedOperator, activeCategory, searchQuery]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: 0 };
    allProducts.forEach((p) => {
      if (!detectedOperator || detectedOperator === "Semua" || p.operator === detectedOperator) {
        counts.Semua = (counts.Semua || 0) + 1;
        counts[p.packageCategory] = (counts[p.packageCategory] || 0) + 1;
      }
    });
    return counts;
  }, [allProducts, detectedOperator]);

  return (
    <div className="min-h-screen bg-[#060e1c] text-white">
      <Header totalStock={allProducts.length} isLive={isLive} />

      {/* Main layout: 1-col mobile, 2-col desktop */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-6">

          {/* ── SIDEBAR (desktop) / TOP SECTION (mobile) ── */}
          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {/* Phone input */}
            <PhoneOperatorInput
              phoneNumber={phoneNumber}
              onPhoneChange={handlePhoneChange}
              detectedOperator={detectedOperator}
              onClear={() => { setPhoneNumber(""); setDetectedOperator(""); }}
              onOperatorSelectManual={(op) => setDetectedOperator(op)}
            />

            {/* Stock status card */}
            <div className="bg-[#0d1b30] border border-white/8 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Status Stok Server</span>
                </div>
                <button
                  onClick={loadProducts}
                  disabled={isLoading}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                  title="Refresh stok"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-4 bg-white/5 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  {/* Total stock row */}
                  <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-[11px] text-slate-400">Total Produk Live</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-black text-emerald-400">{allProducts.length} produk</span>
                    </div>
                  </div>

                  {/* Per-operator breakdown */}
                  {["Telkomsel", "Indosat", "XL", "Axis", "Tri"].map(op => {
                    const count = allProducts.filter(p => p.operator === op).length;
                    return (
                      <div key={op} className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">{op}</span>
                        <span className="text-[11px] font-bold text-white font-mono">
                          {count} paket
                        </span>
                      </div>
                    );
                  })}

                  {lastUpdated && (
                    <p className="text-[9px] text-slate-500 pt-1 border-t border-white/5">
                      Diperbarui pukul {lastUpdated}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Category tabs – inline on desktop */}
            <div className="hidden lg:block">
              <CategoryTabs
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                productCounts={categoryCounts}
              />
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div className="mt-4 lg:mt-0 space-y-3">
            {/* Category tabs – scroll on mobile */}
            <div className="lg:hidden">
              <CategoryTabs
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
                productCounts={categoryCounts}
              />
            </div>

            {/* Search + filter row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari paket (10GB, unlimited...)"
                  className="w-full bg-[#0d1b30] border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              {(detectedOperator || searchQuery || activeCategory !== "Semua") && (
                <button
                  onClick={() => { setDetectedOperator(""); setSearchQuery(""); setActiveCategory("Semua"); }}
                  className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white transition-colors whitespace-nowrap"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Result summary */}
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[10px] text-slate-500">
                {detectedOperator ? `Paket ${detectedOperator}` : "Semua operator"} •{" "}
                {activeCategory !== "Semua" ? activeCategory : "semua kategori"}
              </span>
              <span className="text-[10px] font-bold text-slate-400 font-mono">
                {filteredProducts.length} paket
              </span>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-[#0d1b30] border border-white/8 rounded-2xl p-3.5 h-44 animate-pulse space-y-2">
                    <div className="h-3 bg-white/8 rounded w-2/3" />
                    <div className="h-5 bg-white/8 rounded w-3/4 mt-2" />
                    <div className="h-3 bg-white/8 rounded w-1/2" />
                    <div className="h-7 bg-white/8 rounded-lg w-full mt-auto" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} onSelect={(prod) => { setSelectedProduct(prod); setIsModalOpen(true); }} />
                ))}
              </div>
            ) : (
              <div className="bg-[#0d1b30] border border-white/8 rounded-2xl p-10 text-center space-y-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Tidak ada paket</h3>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Coba ubah filter atau pilih operator lain.
                  </p>
                </div>
                <button
                  onClick={() => { setActiveCategory("Semua"); setSearchQuery(""); setDetectedOperator(""); }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        product={selectedProduct}
        initialPhoneNumber={phoneNumber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
