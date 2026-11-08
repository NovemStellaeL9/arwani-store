"use client";

import React from "react";
import { PackageCategory } from "@/types/product";
import {
  Layers,
  Clock,
  CalendarDays,
  CalendarRange,
  Users,
  ShieldAlert,
} from "lucide-react";

interface CategoryTabsProps {
  activeCategory: PackageCategory;
  onSelectCategory: (cat: PackageCategory) => void;
  productCounts?: Record<string, number>;
}

const CATEGORIES: {
  id: PackageCategory;
  label: string;
  sub: string;
  icon: React.ElementType;
}[] = [
  { id: "Semua", label: "Semua", sub: "Semua Paket", icon: Layers },
  { id: "Bulanan", label: "Bulanan", sub: "28 - 30 Hari", icon: CalendarRange },
  { id: "Harian", label: "Harian", sub: "1 - 5 Hari", icon: Clock },
  { id: "Mingguan", label: "Mingguan", sub: "7 Hari", icon: CalendarDays },
  { id: "Combo", label: "Akrab / Combo", sub: "Kuota Bersama", icon: Users },
  { id: "Masa Aktif", label: "Masa Aktif", sub: "Perpanjang Kartu", icon: ShieldAlert },
];

export default function CategoryTabs({
  activeCategory,
  onSelectCategory,
  productCounts,
}: CategoryTabsProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Kategori Paket Tersedia
        </h3>
        <span className="text-[11px] text-slate-400">Pilih jenis paket</span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const Icon = cat.icon;
          const count = productCounts ? productCounts[cat.id] : undefined;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all text-left ${
                isActive
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 font-bold"
                  : "bg-[#0e1a34] border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-medium"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                  isActive ? "bg-white/20 text-white" : "bg-white/5 text-blue-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="text-xs font-bold">{cat.label}</span>
                  {count !== undefined && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive
                          ? "bg-white text-blue-700"
                          : "bg-white/10 text-slate-400"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] leading-tight block mt-0.5 ${
                    isActive ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  {cat.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
