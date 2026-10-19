"use client";

import React, { useState } from "react";
import { GroupedProduct, Product } from "@/types/product";
import { formatRupiah, getProviderLogo, getTypeColor } from "@/utils/helpers";

interface ProductGroupProps {
  group: GroupedProduct;
  onToggleFavorite?: (id: string | number) => void;
  favorites?: (string | number)[];
  onSelectProduct?: (product: Product) => void;
}

export default function ProductGroup({
  group,
  onToggleFavorite,
  favorites = [],
  onSelectProduct,
}: ProductGroupProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | number>(group.variants[0].id);

  const selectedVariant =
    group.variants.find((v) => v.id === selectedVariantId) ?? group.variants[0];

  const typeColor = getTypeColor("XL Akrab");
  const isFavorite = favorites.includes(selectedVariant.id);

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariantId(e.target.value);
  };

  return (
    <div className="col-span-1 sm:col-span-2 bg-[#0e1a34] rounded-2xl p-5 shadow-md border border-white/10 relative overflow-hidden transition-all duration-200">
      {/* Top Banner Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mt-1 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white/5 rounded-2xl p-2 flex items-center justify-center border border-white/10 flex-shrink-0">
            <img
              src={getProviderLogo(group.category)}
              alt={group.category}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                AKRAB
              </span>
              <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                Keluarga
              </span>
            </div>
            <h3 className="text-sm font-black text-white">
              {group.name}
            </h3>
            <p className="text-[10px] font-medium text-slate-300 mt-0.5">
              {group.desc}
            </p>
          </div>
        </div>

        {/* Cek Area Link */}
        <a
          href="https://gress-cell.github.io/GRESS-CELL-CEK-AREA/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 bg-amber-500/20 text-amber-300 text-[10px] font-bold px-3 py-2 rounded-xl border border-amber-500/30 hover:bg-amber-500/30 flex items-center gap-1 transition-colors focus:ring-2 focus:ring-amber-400 focus:outline-none"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Cek Area XL AKRAB
        </a>
      </div>

      {/* Variant Selector Dropdown */}
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center mb-1.5 px-1">
          <label htmlFor="variant-select" className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
            Pilih Varian Paket:
          </label>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(selectedVariant.id)}
              className="text-[10px] font-bold text-slate-300 hover:text-rose-400 flex items-center gap-1 transition-colors focus:ring-2 focus:ring-rose-400 focus:outline-none"
            >
              <svg
                className={`w-3.5 h-3.5 ${
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
              {isFavorite ? "Favorit" : "Simpan"}
            </button>
          )}
        </div>

        <select
          id="variant-select"
          value={selectedVariantId}
          onChange={handleVariantChange}
          className="w-full p-3 border border-white/15 rounded-xl text-xs bg-[#081225] font-bold text-white outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors cursor-pointer"
        >
          {group.variants.map((v) => (
            <option key={v.id} value={v.id} className="bg-[#081225] text-white">
              {v.name} | {v.desc} | {formatRupiah(v.price)}
            </option>
          ))}
        </select>

        {/* Informative Area Note */}
        <div className="mt-3 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-xl flex items-start gap-2">
          <span className="text-xs">ℹ️</span>
          <p className="text-[11px] text-amber-200 leading-normal">
            Kuota yang diperoleh dapat berbeda berdasarkan area wilayah Anda. Silakan periksa estimasi area terlebih dahulu.
          </p>
        </div>
      </div>

      {/* Pricing and Action */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
        <div>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Harga Varian
          </p>
          <p className="text-base font-black text-blue-400 mt-0.5">
            {formatRupiah(selectedVariant.price)}
          </p>
        </div>

        <button
          onClick={() => onSelectProduct && onSelectProduct(selectedVariant)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Beli Paket Ini
        </button>
      </div>
    </div>
  );
}
