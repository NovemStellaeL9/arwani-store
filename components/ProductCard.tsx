"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatRupiah, getOperatorMeta } from "@/utils/helpers";
import { Clock, Zap, Package } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export default function ProductCard({ product, onSelect }: ProductCardProps) {
  const meta = getOperatorMeta(product.operator);

  // Stok 999 = unlimited (PLN / masa aktif), tampilkan "Tersedia"
  const stockDisplay =
    product.stock >= 999 ? "Tersedia" :
    product.stock > 10 ? `${product.stock} stok` :
    product.stock > 0 ? `Sisa ${product.stock}` : "Habis";

  const stockColor =
    product.stock >= 999 ? "text-emerald-400" :
    product.stock > 10 ? "text-emerald-400" :
    product.stock > 0 ? "text-amber-400" : "text-red-400";

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-[#0d1b30] hover:bg-[#102040] border border-white/8 hover:border-blue-500/40 rounded-2xl p-3.5 shadow-sm transition-all duration-150 cursor-pointer flex flex-col gap-2.5 active:scale-[0.98]"
    >
      {/* Operator + Validity row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 relative flex-shrink-0">
            <Image
              src={meta.logo}
              alt={product.operator}
              width={16}
              height={16}
              className="object-contain"
            />
          </div>
          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.badgeBg} ${meta.badgeText} ${meta.borderColor}`}>
            {product.operator}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] text-slate-400">
          <Clock className="w-2.5 h-2.5" />
          <span>{product.validity}</span>
        </div>
      </div>

      {/* Quota – focal point */}
      <div>
        <span className="text-base font-black text-white leading-none">
          {product.quota}
        </span>
        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1 leading-snug">
          {product.name}
        </p>
      </div>

      {/* Stock */}
      <div className="flex items-center gap-1">
        <Package className="w-2.5 h-2.5 text-slate-500" />
        <span className={`text-[9px] font-bold ${stockColor}`}>{stockDisplay}</span>
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-auto">
        <span className="text-sm font-black text-emerald-400 font-mono">
          {formatRupiah(product.price)}
        </span>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onSelect(product); }}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-black flex items-center gap-1 transition-all active:scale-95 shadow-sm shadow-blue-600/30"
        >
          <Zap className="w-2.5 h-2.5 fill-current" />
          Beli
        </button>
      </div>
    </div>
  );
}
