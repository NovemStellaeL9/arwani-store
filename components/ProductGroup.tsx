"use client";

import React, { useState } from "react";
import { GroupedProduct, Product } from "@/types/product";
import { formatRupiah, getProviderLogo, getTypeColor, getWaLink } from "@/utils/helpers";

interface ProductGroupProps {
  group: GroupedProduct;
  onToggleFavorite?: (id: number) => void;
  favorites?: number[];
}

export default function ProductGroup({
  group,
  onToggleFavorite,
  favorites = [],
}: ProductGroupProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<number>(group.variants[0].id);

  const selectedVariant =
    group.variants.find((v) => v.id === selectedVariantId) ?? group.variants[0];

  const typeColor = getTypeColor("AKRAB");
  const isFavorite = favorites.includes(selectedVariant.id);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariantId(Number(e.target.value));
  };

  return (
    <div className="col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-md border border-slate-100 dark:border-slate-800 relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Top Banner Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400 dark:bg-amber-500" />

      {/* Header Info */}
      <div className="flex items-start justify-between mt-1 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950/40 rounded-xl p-2.5 flex items-center justify-center border border-slate-100/80 dark:border-slate-800/60 flex-shrink-0">
            <img
              src={getProviderLogo(group.category)}
              alt={group.category}
              className="max-h-full max-w-full object-contain filter drop-shadow-sm"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span
                className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                style={{ backgroundColor: typeColor.bg, color: typeColor.text }}
              >
                AKRAB
              </span>
              <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-55 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100 dark:border-amber-900/30 uppercase tracking-wide">
                Keluarga
              </span>
            </div>
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-200">
              {group.name}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              {group.desc}
            </p>
          </div>
        </div>

        {/* Cek Area & Estimasi Kuota Link */}
        <a
          href="https://gress-cell.github.io/GRESS-CELL-CEK-AREA/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[9px] font-black px-3 py-2 rounded-xl border border-amber-200 dark:border-amber-900/40 hover:bg-amber-100 dark:hover:bg-amber-950/60 flex items-center gap-1 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Cek Area & Estimasi Kuota AKRAB
        </a>
      </div>

      {/* Variant Selector Dropdown */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4">
        <div className="flex justify-between items-center mb-1.5 px-1">
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Pilih Varian Paket:
          </label>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(selectedVariant.id)}
              className="text-[10px] font-extrabold text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-1 transition-all duration-300"
            >
              <svg
                className={`w-3.5 h-3.5 ${
                  isFavorite ? "fill-red-500 stroke-red-500 scale-110" : "stroke-slate-400 fill-none"
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
              {isFavorite ? "Favorit" : "Sukai"}
            </button>
          )}
        </div>
        
        <select
          value={selectedVariantId}
          onChange={handleVariantChange}
          className="w-full p-3 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs bg-slate-50 dark:bg-slate-950 font-bold text-slate-700 dark:text-slate-350 outline-none focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-emerald-500/5 focus:border-orange-500 dark:focus:border-emerald-500 transition-all duration-300"
        >
          {group.variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} — {v.desc} — {formatRupiah(v.price)}
            </option>
          ))}
        </select>
        
        {/* Warning Text for AKRAB Area Estimates */}
        <div className="mt-3.5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 px-3.5 py-2.5 rounded-xl flex items-start gap-2">
          <span className="text-xs">⚠️</span>
          <p className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold leading-normal">
            Kuota yang didapat dapat berbeda pada setiap area. Silakan cek estimasi area terlebih dahulu.
          </p>
        </div>
      </div>

      {/* Pricing and WhatsApp Buy action */}
      <div className="mt-4 flex justify-between items-center bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100/80 dark:border-slate-850">
        <div>
          <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Harga Varian
          </p>
          <p className="text-lg font-black text-orange-500 dark:text-emerald-400 mt-0.5">
            {formatRupiah(selectedVariant.price)}
          </p>
        </div>
        
        <a
          href={getWaLink(selectedVariant.name, selectedVariant.price)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-orange-500 dark:bg-emerald-500 hover:bg-orange-600 dark:hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:-translate-y-0.5 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Pesan Sekarang
        </a>
      </div>
    </div>
  );
}
