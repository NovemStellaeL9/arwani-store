"use client";

import React from "react";
import { ActiveCategory } from "@/types/product";
import { getProviderLogo } from "@/utils/helpers";

interface CategoryTabsProps {
  activeCategory: ActiveCategory;
  onCategoryClick: (category: ActiveCategory) => void;
}

const mainCategories: ActiveCategory[] = [
  "Telkomsel",
  "by.U",
  "Indosat",
  "XL & Axis",
  "Tri",
  "Smartfren",
];

export default function CategoryTabs({
  activeCategory,
  onCategoryClick,
}: CategoryTabsProps) {
  return (
    <div className="mt-6 px-1">
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3.5 px-1">
        Pilih Operator Utama
      </p>
      
      {/* Grid Menu Categories */}
      <div className="grid grid-cols-3 gap-3">
        {mainCategories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className={`group flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 cursor-pointer hover:-translate-y-1.5 active:scale-95 shadow-sm hover:shadow-md ${
                isActive
                  ? "border-orange-500 dark:border-emerald-500 ring-2 ring-orange-500/20 dark:ring-emerald-500/10"
                  : "border-slate-100 dark:border-slate-800/80 hover:border-orange-400 dark:hover:border-emerald-400"
              }`}
            >
              <div className="h-10 w-10 flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110">
                <img
                  src={getProviderLogo(cat)}
                  alt={cat}
                  className="max-h-full max-w-full object-contain filter drop-shadow-sm group-hover:drop-shadow-md"
                />
              </div>
              <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 text-center leading-tight tracking-wide uppercase">
                {cat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Extra Services Banner (Masa Aktif) */}
      <div className="mt-5">
        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
          Layanan Ekstra
        </p>
        <button
          onClick={() => onCategoryClick("MasaAktif")}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.99] shadow-sm hover:shadow-md ${
            activeCategory === "MasaAktif"
              ? "border-sky-500 dark:border-sky-500 ring-2 ring-sky-500/20"
              : "border-slate-100 dark:border-slate-800/80 hover:border-sky-400/60"
          }`}
        >
          <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/40 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300">
            <svg
              className="w-5 h-5 text-sky-600 dark:text-sky-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-black text-slate-800 dark:text-slate-200">
              Perpanjang Masa Aktif
            </p>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">
              Tsel · Indosat · Tri · Axis · XL
            </p>
          </div>
          <svg
            className="w-4 h-4 text-slate-300 dark:text-slate-600 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
