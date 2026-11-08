"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatRupiah, getOperatorMeta } from "@/utils/helpers";
import { Clock, Zap, Sparkles } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const meta = getOperatorMeta(product.operator);

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-[#0e1a34] hover:bg-[#122244] border border-white/10 hover:border-blue-500/50 rounded-3xl p-4 shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* Top Tag & Operator Logo */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 relative flex-shrink-0">
              <Image
                src={meta.logo}
                alt={product.operator}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}
            >
              {product.operator}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>{product.validity}</span>
          </div>
        </div>

        {/* Quota Highlight Pill */}
        <div className="mb-2">
          <span className="inline-flex items-center gap-1 text-sm font-black text-amber-300 bg-amber-400/10 px-2.5 py-1 rounded-xl border border-amber-400/20">
            {product.isPopular && <Sparkles className="w-3 h-3 text-amber-400" />}
            {product.quota}
          </span>
        </div>

        {/* Package Title */}
        <h4 className="text-xs font-bold text-white leading-snug group-hover:text-blue-300 transition-colors line-clamp-2 min-h-[2rem]">
          {product.name}
        </h4>

        {/* Short Description */}
        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {product.desc}
        </p>
      </div>

      {/* Bottom: Price & Action CTA */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-end justify-between gap-2">
        <div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">
            Harga Akhir
          </span>
          <span className="text-sm font-black text-emerald-400 font-mono tracking-tight">
            {formatRupiah(product.price)}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(product);
          }}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-blue-600/30 transition-all active:scale-95"
        >
          <Zap className="w-3 h-3 fill-current" />
          <span>Beli</span>
        </button>
      </div>

      {/* Live Available Pill */}
      {product.isAvailable && (
        <div className="absolute top-3 right-3 hidden">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
      )}
    </div>
  );
}
