"use client";

import React from "react";
import { Product } from "@/types/product";
import {
  formatRupiah,
  getPackageType,
  getTypeColor,
  getProviderLogo,
  getMasaAktifLogo,
  getWaLink,
  getProductBadge,
} from "@/utils/helpers";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps) {
  const isMasaAktif = product.category === "MasaAktif";
  const pkgType = isMasaAktif ? "Masa Aktif" : getPackageType(product.name);
  const typeColor = getTypeColor(pkgType);
  const logo = isMasaAktif
    ? getMasaAktifLogo(product.desc)
    : getProviderLogo(product.category);

  const badge = getProductBadge(product.name, product.price, product.category, product.id);

  return (
    <div className="bg-white/[0.08] backdrop-blur-md rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 hover:bg-white/[0.12] transition-all duration-300 border border-white/12 flex flex-col justify-between group overflow-hidden relative">
      {/* Top Accent Line */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: typeColor.text }}
      />

      <div>
        {/* Card Header (Logo & Favorite) */}
        <div className="flex items-start justify-between mb-3 mt-1">
          <div className="w-12 h-12 flex items-center justify-center bg-white/5 p-2 rounded-2xl border border-white/10 flex-shrink-0 shadow-inner">
            {logo ? (
              <img
                src={logo}
                alt={product.category}
                className="max-h-full max-w-full object-contain filter drop-shadow-sm"
              />
            ) : (
              <div
                className="w-full h-full rounded-xl flex items-center justify-center text-[10px] font-black"
                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
              >
                {product.desc.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center">
            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(product.id)}
              aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-rose-500/10 group/fav hover:scale-110 active:scale-90 transition-all duration-300"
            >
              <svg
                className={`w-4 h-4 transition-all duration-300 ${
                  isFavorite
                    ? "fill-rose-500 stroke-rose-500 scale-110"
                    : "stroke-slate-400 fill-none group-hover/fav:stroke-rose-400"
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
 
        {/* Dynamic Badges */}
        {badge && (
          <div className="mb-2">
            {badge === "🔥 PROMO CIRCEL 🔥" ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-widest animate-pulse">
                🔥 PROMO CIRCEL 🔥
              </span>
            ) : badge === "BEST SELLER" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[8.5px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                ⭐ BEST SELLER
              </span>
            ) : badge === "PROMO" ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[8.5px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                🏷️ PROMO
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[8.5px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                ✨ BARU
              </span>
            )}
          </div>
        )}

        {/* Type Badge */}
        <div className="mb-2">
          <span
            className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", color: typeColor.text }}
          >
            {pkgType}
          </span>
        </div>

        {/* Product Title & Description */}
        <h3 className="text-xs font-black text-white leading-snug line-clamp-2 min-h-[2rem]">
          {product.name}
        </h3>
        <p className="text-[10px] font-semibold text-slate-400 mt-1 uppercase tracking-wide">
          {product.desc}
        </p>
      </div>

      {/* Pricing & Call to Action */}
      <div className="mt-4 pt-2.5 border-t border-white/10 w-full flex flex-col gap-2">
        <p className="text-sm font-black text-[#3B82F6]">
          {formatRupiah(product.price)}
        </p>
        
        <a
          href={getWaLink(product.name, product.price)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300 flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 active:scale-95"
        >
          {/* Cart Icon */}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Beli Sekarang
        </a>
      </div>
    </div>
  );
}
