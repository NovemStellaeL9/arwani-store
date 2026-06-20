"use client";

import React from "react";
import { getTypeColor, getMasaAktifLogo } from "@/utils/helpers";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeType: string;
  onTypeChange: (t: string) => void;
  availableTypes: string[];
  sortBy: "Default" | "Termurah" | "Termahal" | "AZ";
  onSortChange: (s: "Default" | "Termurah" | "Termahal" | "AZ") => void;
  priceFilter: string;
  onPriceFilterChange: (p: string) => void;
  activeMaOp?: string;
  onMaOpChange?: (op: string) => void;
  isMasaAktif?: boolean;
}

const MASA_AKTIF_OPERATORS = ["Semua", "Telkomsel", "Indosat", "Tri", "Axis", "XL"];

export default function SearchBar({
  searchQuery,
  onSearchChange,
  activeType,
  onTypeChange,
  availableTypes,
  sortBy,
  onSortChange,
  priceFilter,
  onPriceFilterChange,
  activeMaOp,
  onMaOpChange,
  isMasaAktif = false,
}: SearchBarProps) {
  return (
    <div className="space-y-4 px-1">
      {/* Search Input Box */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg
            className="w-4 h-4 text-slate-400 dark:text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari paket internet..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-orange-500 dark:focus:border-emerald-500 focus:ring-4 focus:ring-orange-500/10 dark:focus:ring-emerald-500/5 transition-all duration-300 shadow-sm"
        />
      </div>

      {/* Sorting Control Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Urutkan Produk
        </span>
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
          {(["Default", "Termurah", "Termahal", "AZ"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold transition-all duration-300 uppercase tracking-wider ${
                sortBy === s
                  ? "bg-orange-500 dark:bg-emerald-500 text-white shadow-sm"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              {s === "Default" ? "Biasa" : s === "Termurah" ? "Termurah" : s === "Termahal" ? "Termahal" : "A-Z"}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter Row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          Filter Harga
        </span>
        <select
          value={priceFilter}
          onChange={(e) => onPriceFilterChange(e.target.value)}
          className="text-[10px] font-black bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm outline-none focus:border-orange-500 dark:focus:border-emerald-500 transition-colors"
        >
          <option value="all">Semua Harga</option>
          <option value="under25">Di bawah Rp 25.000</option>
          <option value="25to50">Rp 25.000 - Rp 50.000</option>
          <option value="50to100">Rp 50.000 - Rp 100.000</option>
          <option value="over100">Di atas Rp 100.000</option>
        </select>
      </div>

      {/* Operator Filter for Masa Aktif */}
      {isMasaAktif && activeMaOp && onMaOpChange && (
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Pilih Operator
          </p>
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-5 px-5">
            {MASA_AKTIF_OPERATORS.map((op) => {
              const isActive = activeMaOp === op;
              const logo = getMasaAktifLogo(op);
              return (
                <button
                  key={op}
                  onClick={() => onMaOpChange(op)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm border ${
                    isActive
                      ? "bg-sky-500 dark:bg-sky-600 text-white border-sky-500 dark:border-sky-600"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-800/80 hover:border-sky-400/55"
                  }`}
                >
                  {logo && (
                    <img src={logo} alt={op} className="h-4 w-4 object-contain" />
                  )}
                  {op}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Package Type Pills Filter */}
      {!isMasaAktif && availableTypes.length > 2 && (
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide -mx-5 px-5">
          {availableTypes.map((type) => {
            const col = getTypeColor(type);
            const isActive = activeType === type;
            return (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className="flex-shrink-0 px-3.5 py-2 rounded-xl text-[10px] font-extrabold transition-all duration-300 border shadow-sm uppercase tracking-wide"
                style={{
                  background: isActive ? col.text : col.bg,
                  color: isActive ? "#fff" : col.text,
                  borderColor: isActive ? col.text : col.bg,
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
