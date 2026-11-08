"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Search, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white/[0.04] backdrop-blur-xl text-white px-5 py-5 rounded-b-[2rem] shadow-xl relative z-20 border-b border-white/10 transition-all">
      {/* Top Bar with Greeting & Quick Link to Transactions */}
      <div className="flex justify-between items-center mb-3.5">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-black tracking-tight text-white">
              Arwani Store
            </span>
            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-black rounded-full border border-blue-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              Reseller Kuota
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">
            Isi ulang paket data &amp; kuota internet otomatis 24 Jam
          </p>
        </div>

        <Link
          href="/transaksi"
          className="px-3 py-1.5 bg-[#122244] hover:bg-[#1a2f5d] border border-blue-500/30 hover:border-blue-400 rounded-xl text-xs font-bold text-blue-300 flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Lacak</span>
        </Link>
      </div>

      {/* Store Status Card */}
      <div className="bg-[#0f1d38] border border-white/10 rounded-2xl p-3.5 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-wider text-white uppercase">
              ARWANI D&apos;GABRIEL STORE
            </h1>
            <p className="text-[10px] text-slate-400">
              Serverless Auto Injeksi &bull; Midtrans / QRIS Dynamic Ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-lg uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Online</span>
        </div>
      </div>
    </header>
  );
}
