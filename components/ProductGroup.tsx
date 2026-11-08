"use client";

import React, { useState } from "react";
import Image from "next/image";
import { GroupedProduct, Product } from "@/types/product";
import { formatRupiah, getProviderLogo } from "@/utils/helpers";

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
  const [selectedVariantId, setSelectedVariantId] = useState<string | number>(
    group.variants[0]?.id || ""
  );

  const selectedVariant =
    group.variants.find((v) => v.id === selectedVariantId) ?? group.variants[0];

  const isFavorite = selectedVariant ? favorites.includes(selectedVariant.id) : false;

  const handleVariantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVariantId(e.target.value);
  };

  if (!selectedVariant) return null;

  return (
    <div className="col-span-1 sm:col-span-2 bg-[#0e1a34] rounded-2xl p-5 shadow-md border border-white/10 relative overflow-hidden transition-all duration-200">
      <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500" />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mt-1 mb-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 bg-white/5 rounded-2xl p-2 flex items-center justify-center border border-white/10 flex-shrink-0 relative">
            <Image
              src={getProviderLogo(group.category)}
              alt={group.category}
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                PAKET
              </span>
              <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wide">
                Hemat
              </span>
            </div>
            <h3 className="text-sm font-black text-white">{group.name}</h3>
            <p className="text-[10px] font-medium text-slate-300 mt-0.5">{group.desc}</p>
          </div>
        </div>

        <button
          onClick={() => onToggleFavorite?.(selectedVariant.id)}
          className="self-end sm:self-auto p-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-red-400 transition"
          aria-label="Simpan Favorit"
        >
          <svg
            className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
            Pilih Varian Paket
          </label>
          <select
            value={selectedVariantId}
            onChange={handleVariantChange}
            aria-label="Pilih varian paket"
            className="w-full bg-[#101c38] text-white text-xs font-bold py-2.5 px-3 rounded-xl border border-white/10 outline-none focus:border-blue-500"
          >
            {group.variants.map((v) => (
              <option key={v.id} value={v.id} className="bg-[#081225] text-white">
                {v.name} ({formatRupiah(v.price)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div>
            <span className="text-[9px] text-slate-400 block uppercase">Total Harga</span>
            <span className="font-mono text-sm font-black text-emerald-400">
              {formatRupiah(selectedVariant.price)}
            </span>
          </div>

          <button
            onClick={() => onSelectProduct?.(selectedVariant)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/30"
          >
            Beli Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}
