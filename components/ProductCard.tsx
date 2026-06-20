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

  // Check if it is a Circel Reguler product to add a custom badge
  const isCircel = product.name.toLowerCase().includes("circel");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between group overflow-hidden relative">
      {/* Top Edge Indicator */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5 opacity-90 transition-colors duration-300"
        style={{ backgroundColor: typeColor.text }}
      />

      <div>
        {/* Card Header (Logo & Badges & Favorite) */}
        <div className="flex items-start justify-between mb-3 mt-1">
          <div className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-950/40 p-1.5 rounded-xl border border-slate-100/80 dark:border-slate-800/50 flex-shrink-0">
            {logo ? (
              <img
                src={logo}
                alt={product.category}
                className="max-h-full max-w-full object-contain filter drop-shadow-sm"
              />
            ) : (
              <div
                className="w-full h-full rounded-lg flex items-center justify-center text-[10px] font-black"
                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
              >
                {product.desc.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {/* Favorite button */}
            <button
              onClick={() => onToggleFavorite(product.id)}
              aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              className="p-1.5 rounded-full bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 hover:bg-red-50 dark:hover:bg-red-950/20 group/fav hover:scale-110 active:scale-90 transition-all duration-350"
            >
              <svg
                className={`w-4 h-4 transition-all duration-350 ${
                  isFavorite
                    ? "fill-red-500 stroke-red-500 scale-110"
                    : "stroke-slate-400 dark:stroke-slate-500 fill-none group-hover/fav:stroke-red-400"
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

        {/* Circel Promo Badge */}
        {isCircel && (
          <div className="mb-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 uppercase tracking-widest border border-red-200 dark:border-red-900/30 animate-pulse">
              🔥 PROMO CIRCEL 🔥
            </span>
          </div>
        )}

        {/* Type Badge */}
        <div className="mb-2">
          <span
            className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
            style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
          >
            {pkgType}
          </span>
        </div>

        {/* Product Title & Description */}
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 leading-snug line-clamp-2 min-h-[2rem]">
          {product.name}
        </h3>
        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wide">
          {product.desc}
        </p>
      </div>

      {/* Pricing & Call to Action */}
      <div className="mt-4 pt-2.5 border-t border-slate-50 dark:border-slate-800/60 w-full flex flex-col gap-2">
        <p className="text-sm font-black text-orange-500 dark:text-emerald-400">
          {formatRupiah(product.price)}
        </p>
        
        <a
          href={getWaLink(product.name, product.price)}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center py-2 rounded-xl text-[10px] font-extrabold transition-all duration-300 uppercase tracking-widest shadow-sm hover:shadow-md flex items-center justify-center gap-1 border"
          style={{
            backgroundColor: typeColor.bg,
            color: typeColor.text,
            borderColor: typeColor.bg,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = typeColor.text;
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = typeColor.text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = typeColor.bg;
            e.currentTarget.style.color = typeColor.text;
            e.currentTarget.style.borderColor = typeColor.bg;
          }}
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
