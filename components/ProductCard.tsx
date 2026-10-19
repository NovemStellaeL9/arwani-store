"use client";

import React from "react";
import { Product } from "@/types/product";
import {
  formatRupiah,
  getPackageType,
  getTypeColor,
  getProviderLogo,
  getMasaAktifLogo,
} from "@/utils/helpers";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string | number) => void;
  onSelectProduct?: (product: Product) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
}: ProductCardProps) {
  const isMasaAktif = product.category.includes("MASA_AKTIF") || product.category === "MasaAktif";
  const pkgType = isMasaAktif ? "Masa Aktif" : getPackageType(product.name);
  const typeColor = getTypeColor(pkgType);
  const logo = isMasaAktif
    ? getMasaAktifLogo(product.operator || product.desc || "")
    : getProviderLogo(product.operator || product.category);

  const isStockEmpty = product.stock === 0;

  return (
    <div className="bg-[#0e1a34] rounded-2xl p-4 shadow-md hover:shadow-xl hover:border-blue-500/40 transition-all duration-200 border border-white/10 flex flex-col justify-between group overflow-hidden relative">
      <div>
        {/* Card Header (Logo, Category, Favorite) */}
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 flex items-center justify-center bg-white/5 p-1.5 rounded-xl border border-white/10 flex-shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={product.operator || product.category}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div
                className="w-full h-full rounded-lg flex items-center justify-center text-[10px] font-black"
                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
              >
                {(product.operator || product.category).slice(0, 3).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Live Stock Badge */}
            {product.stock !== undefined && (
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                  isStockEmpty
                    ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                    : product.stock === 999 || product.stock === 9999
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-blue-500/20 text-blue-300 border-blue-500/30"
                }`}
              >
                {isStockEmpty
                  ? "Habis"
                  : product.stock === 999 || product.stock === 9999
                  ? "Tersedia"
                  : `${product.stock} Stok`}
              </span>
            )}

            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(product.id)}
              aria-label={isFavorite ? "Hapus dari Favorit" : "Simpan ke Favorit"}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-rose-500/20 transition-colors focus:ring-2 focus:ring-rose-400 focus:outline-none"
            >
              <svg
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavorite ? "fill-rose-500 stroke-rose-500" : "stroke-slate-400 fill-none"
                }`}
                viewBox="0 0 24 24"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Type Badge */}
        <div className="mb-2">
          <span
            className="text-[9px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-block"
            style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
          >
            {pkgType}
          </span>
        </div>

        {/* Product Title & Subtitle */}
        <h3 className="text-xs font-black text-white leading-snug line-clamp-2 min-h-[2rem]">
          {product.name}
        </h3>
        <p className="text-[10px] font-medium text-slate-300 mt-1 uppercase tracking-wider font-mono">
          Kode: {product.code || product.name}
        </p>
      </div>

      {/* Pricing & Checkout Action */}
      <div className="mt-4 pt-3 border-t border-white/10 w-full flex flex-col gap-2">
        <p className="text-sm font-black text-blue-400">
          {formatRupiah(product.price)}
        </p>

        <button
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className={`w-full py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none ${
            isStockEmpty
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
              : "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"
          }`}
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {isStockEmpty ? "Cek Ketersediaan" : "Beli Sekarang"}
        </button>
      </div>
    </div>
  );
}
