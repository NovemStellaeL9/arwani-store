"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Product, PackageCategory, OperatorName } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import CheckoutModal from "@/components/CheckoutModal";
import { getOperatorMeta } from "@/utils/helpers";
import {
  ArrowLeft,
  Search,
  Loader2,
  AlertCircle,
  Clock,
  CalendarDays,
  CalendarRange,
  Users,
  ShieldAlert,
  Layers,
} from "lucide-react";

const OPERATORS: OperatorName[] = [
  "Semua",
  "XL",
  "Indosat",
  "Tri",
  "Axis",
  "Telkomsel",
  "PLN",
  "DANA",
];

const CATEGORIES: {
  id: PackageCategory;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "Semua", label: "Semua", icon: Layers },
  { id: "Bulanan", label: "Bulanan", icon: CalendarRange },
  { id: "Harian", label: "Harian", icon: Clock },
  { id: "Mingguan", label: "Mingguan", icon: CalendarDays },
  { id: "Combo", label: "Combo / Akrab", icon: Users },
  { id: "Masa Aktif", label: "Masa Aktif", icon: ShieldAlert },
];

type SortOption = "Default" | "Termurah" | "Termahal" | "AZ";

function CatalogContent() {
  const searchParams = useSearchParams();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeOperator, setActiveOperator] = useState<OperatorName>("Semua");
  const [activeCategory, setActiveCategory] = useState<PackageCategory>("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("Default");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Modal checkout
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const catParam = searchParams.get("category");
    const opParam = searchParams.get("operator");
    const queryParam = searchParams.get("query");

    if (catParam) {
      setActiveCategory(catParam as PackageCategory);
    }
    if (opParam) {
      setActiveOperator(opParam as OperatorName);
    }
    if (queryParam) setSearchQuery(queryParam);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setLoadError("");
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success && Array.isArray(json.products)) {
          setAllProducts(json.products);
        } else {
          throw new Error(json.message || "Gagal memuat produk.");
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Koneksi terputus saat memuat katalog produk.";
        setLoadError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let list = allProducts.filter((p) => {
      if (activeOperator !== "Semua") {
        const matchOp =
          p.operator.toLowerCase() === activeOperator.toLowerCase() ||
          p.name.toLowerCase().includes(activeOperator.toLowerCase());
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
          p.quota.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    if (sortBy === "Termurah") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "Termahal") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else if (sortBy === "AZ") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [allProducts, activeOperator, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#081225] px-4 py-5 pb-28 text-white space-y-4">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-base font-black tracking-wide">Katalog Produk Tersedia</h1>
          <p className="text-[11px] text-slate-400">
            Hanya produk dengan stok aktif dari server pusat
          </p>
        </div>
      </div>

      {/* Operator Filter Horizontal Scroll */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
          Pilih Layanan / Operator
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {OPERATORS.map((op) => {
            const isSelected = activeOperator === op;
            const meta = getOperatorMeta(op);
            return (
              <button
                key={op}
                onClick={() => setActiveOperator(op)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  isSelected
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-600/30"
                    : "bg-[#0e1a34] border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                {op !== "Semua" && (
                  <div className="w-4 h-4 relative flex-shrink-0">
                    <Image
                      src={meta.logo}
                      alt={op}
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </div>
                )}
                <span>{op}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter Horizontal Scroll */}
      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 px-1">
          Kategori Paket
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-blue-500/20 border-blue-400 text-blue-300 font-bold"
                    : "bg-[#0e1a34] border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input & Sort */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kuota (misal: 15 GB, 28 hari)..."
            className="w-full bg-[#0e1a34] border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          aria-label="Urutkan paket kuota"
          className="bg-[#0e1a34] border border-white/10 rounded-2xl px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-blue-500"
        >
          <option value="Default">Urutan Default</option>
          <option value="Termurah">Termurah</option>
          <option value="Termahal">Termahal</option>
          <option value="AZ">Nama A-Z</option>
        </select>
      </div>

      {/* Info Count */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>Menampilkan {filteredProducts.length} Produk Aktif</span>
        {(activeOperator !== "Semua" || activeCategory !== "Semua" || searchQuery) && (
          <button
            onClick={() => {
              setActiveOperator("Semua");
              setActiveCategory("Semua");
              setSearchQuery("");
            }}
            className="text-blue-400 hover:text-blue-300 font-bold"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Error / Loading / Content */}
      {loadError && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{loadError}</span>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 py-8">
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
              onSelect={(item) => {
                setSelectedProduct(item);
                setIsModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="bg-[#0e1a34] border border-white/10 rounded-3xl p-8 text-center space-y-3 my-4">
          <p className="text-sm font-bold text-white">Tidak ada paket yang cocok.</p>
          <p className="text-xs text-slate-400">
            Hanya produk dengan stok aktif dari server pusat yang ditampilkan.
          </p>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        product={selectedProduct}
        initialPhoneNumber=""
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default function SemuaProdukPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#081225] flex items-center justify-center text-white">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
