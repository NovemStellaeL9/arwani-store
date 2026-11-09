"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Search } from "lucide-react";

interface HeaderProps {
  totalStock?: number;
  isLive?: boolean;
}

export default function Header({ totalStock, isLive }: HeaderProps) {
  return (
    <header className="bg-[#0a1628] border-b border-white/8 px-4 py-3 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-4 h-4 text-white" />
        </div>
        <div>
          <span className="text-sm font-black text-white leading-none block">Arwani Store</span>
          <span className="text-[9px] text-slate-500 leading-none">Kuota • 24 Jam</span>
        </div>
      </div>

      {/* Center: live stock badge */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-bold text-emerald-400">
          {isLive ? `${totalStock ?? "..."} produk live` : "Memuat..."}
        </span>
      </div>

      {/* Track link */}
      <Link
        href="/transaksi"
        className="p-2 bg-white/5 hover:bg-white/10 border border-white/8 rounded-xl transition-colors"
        title="Lacak Transaksi"
      >
        <Search className="w-4 h-4 text-slate-300" />
      </Link>
    </header>
  );
}
