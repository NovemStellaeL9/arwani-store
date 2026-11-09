"use client";

import React from "react";
import { PackageCategory } from "@/types/product";

interface CategoryTabsProps {
  activeCategory: PackageCategory;
  onSelectCategory: (cat: PackageCategory) => void;
  productCounts?: Record<string, number>;
}

const CATEGORIES: { id: PackageCategory; label: string }[] = [
  { id: "Semua", label: "Semua" },
  { id: "Bulanan", label: "Bulanan" },
  { id: "Harian", label: "Harian" },
  { id: "Mingguan", label: "Mingguan" },
  { id: "Combo", label: "Combo" },
  { id: "Masa Aktif", label: "Masa Aktif" },
];

export default function CategoryTabs({
  activeCategory,
  onSelectCategory,
  productCounts,
}: CategoryTabsProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = productCounts?.[cat.id];
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-[#0d1b30] border border-white/8 text-slate-400 hover:text-white hover:border-white/20"
            }`}
          >
            <span>{cat.label}</span>
            {count !== undefined && (
              <span className={`text-[9px] px-1 py-0.5 rounded-md font-black ${
                isActive ? "bg-white/20 text-white" : "bg-white/8 text-slate-500"
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
