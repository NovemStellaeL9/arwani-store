"use client";

import React, { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import PhoneOperatorInput from "@/components/PhoneOperatorInput";
import CategoryTabs from "@/components/CategoryTabs";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";
import { Product, PackageCategory, OperatorName } from "@/types/product";
import { detectOperator } from "@/utils/helpers";
import { Search, Sparkles, AlertCircle } from "lucide-react";

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detectedOperator, setDetectedOperator] = useState<OperatorName | "">("");
  const [activeCategory, setActiveCategory] = useState<PackageCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch products from serverless route handler /api/products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.products)) {
          setAllProducts(json.products);
        }
      } catch (err) {
        console.error("Gagal memuat produk:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Handler saat nomor telepon berubah -> Deteksi operator otomatis
  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    const op = detectOperator(val) as OperatorName;
    if (op) {
      setDetectedOperator(op);
    } else {
      setDetectedOperator("");
    }
  };

  const handleClearPhone = () => {
    setPhoneNumber("");
    setDetectedOperator("");
  };

  const handleManualOperatorSelect = (op: OperatorName) => {
    setDetectedOperator(op);
  };

  // Filter list produk berdasarkan:
  // 1. Operator yang terdeteksi (atau dipilih)
  // 2. Kategori durasi paket (Harian, Mingguan, Bulanan, Combo, Unlimited)
  // 3. Kata kunci pencarian
  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) => {
      // Filter Operator
      if (detectedOperator && detectedOperator !== "Semua") {
        const matchOp =
          p.operator.toLowerCase() === detectedOperator.toLowerCase() ||
          p.name.toLowerCase().includes(detectedOperator.toLowerCase());
        if (!matchOp) return false;
      }

      // Filter Kategori Paket
      if (activeCategory !== "Semua") {
        if (p.packageCategory !== activeCategory) return false;
      }

      // Filter Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchQuery =
          p.name.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q) ||
          p.quota.toLowerCase().includes(q) ||
          p.validity.toLowerCase().includes(q);
        if (!matchQuery) return false;
      }

      return true;
    });
  }, [allProducts, detectedOperator, activeCategory, searchQuery]);

  // Hitung jumlah paket per kategori untuk badge tab
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

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#081225] pb-28 text-white">
      {/* Top Header */}
      <Header />

      <div className="px-4 mt-4 space-y-5">
        {/* FITUR UTAMA 1: Input Nomor HP dengan Deteksi Otomatis Logo Operator */}
        <PhoneOperatorInput
          phoneNumber={phoneNumber}
          onPhoneChange={handlePhoneChange}
          detectedOperator={detectedOperator}
          onClear={handleClearPhone}
          onOperatorSelectManual={handleManualOperatorSelect}
        />

        {/* FITUR UTAMA 2: Kategori Paket Kuota (Harian, Mingguan, Bulanan, Combo, Unlimited) */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          productCounts={categoryCounts}
        />

        {/* Search Bar & Status */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kuota (misal: 10 GB, Unlimited)..."
              className="w-full bg-[#0e1a34] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {detectedOperator && (
            <button
              onClick={() => setDetectedOperator("")}
              className="px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-bold text-slate-300 hover:text-white transition-colors flex-shrink-0"
            >
              Semua Operator
            </button>
          )}
        </div>

        {/* Section Heading & Result Info */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {detectedOperator
                ? `Katalog Kuota ${detectedOperator}`
                : "Semua Paket Kuota"}
            </h2>
            <p className="text-[10px] text-slate-400">
              Harga final tertera sudah termasuk markup transparan
            </p>
          </div>
          <span className="text-[10px] font-bold font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
            {filteredProducts.length} Produk
          </span>
        </div>

        {/* FITUR UTAMA 3: Product Grid Display */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 py-8 text-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#0e1a34] border border-white/10 rounded-3xl p-4 h-52 animate-pulse space-y-3"
              >
                <div className="h-5 bg-white/10 rounded-lg w-1/2"></div>
                <div className="h-4 bg-white/10 rounded-lg w-3/4"></div>
                <div className="h-8 bg-white/10 rounded-xl w-full mt-6"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={handleSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#0e1a34] border border-white/10 rounded-3xl p-8 text-center space-y-3 my-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-400">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">Tidak Ada Paket yang Cocok</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Coba ganti filter kategori, hapus kata kunci pencarian, atau pilih operator lain.
            </p>
            <button
              onClick={() => {
                setActiveCategory("Semua");
                setSearchQuery("");
                setDetectedOperator("");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </div>

      {/* FITUR UTAMA 4: Cart / Modal Checkout */}
      <CheckoutModal
        product={selectedProduct}
        initialPhoneNumber={phoneNumber}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
