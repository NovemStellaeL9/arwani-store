"use client";

import React from "react";
import Link from "next/link";

export default function TentangKami() {
  return (
    <div className="flex flex-col min-h-screen bg-app-bg pb-10 transition-colors duration-500">
      
      {/* Header stick */}
      <div className="bg-app-header-bg text-app-header-text px-5 py-4 flex items-center justify-between border-b border-app-border/10 relative z-20">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-app-header-text/80 hover:text-app-header-text transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <span className="text-xs font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
          Tentang Kami
        </span>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* Profile Card */}
        <div className="bg-app-card rounded-3xl p-6 border border-app-border shadow-sm relative overflow-hidden transition-colors duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-emerald-500/5 rounded-full blur-2xl -mr-8 -mt-8" />
          
          <h2 className="text-base font-black text-app-text uppercase tracking-wider mb-2">
            Arwani D'Gabriel Store
          </h2>
          <p className="text-xs text-app-primary font-extrabold uppercase tracking-widest mb-4">
            Solusi Kebutuhan Digital Anda
          </p>
          <p className="text-xs text-app-text-secondary leading-relaxed font-medium">
            Arwani D'Gabriel Store didirikan untuk mempermudah transaksi pembelian paket data internet, pulsa, dan perpanjangan masa aktif kartu seluler dari berbagai operator telekomunikasi terkemuka di Indonesia. Kami berdedikasi tinggi untuk memberikan pelayanan yang super cepat, harga murah yang bersaing, serta transaksi yang aman dan terpercaya bagi semua pelanggan kami.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Cepat */}
          <div className="bg-app-card rounded-2xl p-4 border border-app-border shadow-sm transition-colors duration-500">
            <div className="w-9 h-9 bg-app-primary-light rounded-xl flex items-center justify-center text-app-primary mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xs font-black text-app-text uppercase tracking-wider">
              Instan & Cepat
            </h3>
            <p className="text-[10px] text-app-text-secondary mt-1 leading-relaxed">
              Proses pengiriman paket data langsung diproses setelah konfirmasi WhatsApp diterima.
            </p>
          </div>

          {/* Hemat */}
          <div className="bg-app-card rounded-2xl p-4 border border-app-border shadow-sm transition-colors duration-500">
            <div className="w-9 h-9 bg-app-success-light rounded-xl flex items-center justify-center text-app-success mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1" />
              </svg>
            </div>
            <h3 className="text-xs font-black text-app-text uppercase tracking-wider">
              Harga Terbaik
            </h3>
            <p className="text-[10px] text-app-text-secondary mt-1 leading-relaxed">
              Harga paket data dijamin murah dibanding aplikasi ritel seluler resmi lainnya.
            </p>
          </div>

          {/* Lengkap */}
          <div className="bg-app-card rounded-2xl p-4 border border-app-border shadow-sm transition-colors duration-500">
            <div className="w-9 h-9 bg-app-info-light rounded-xl flex items-center justify-center text-app-info mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xs font-black text-app-text uppercase tracking-wider">
              Paket Lengkap
            </h3>
            <p className="text-[10px] text-app-text-secondary mt-1 leading-relaxed">
              Mulai dari data reguler, flash, combo flex, hingga penambahan masa aktif kartu setahun.
            </p>
          </div>

          {/* CS Siaga */}
          <div className="bg-app-card rounded-2xl p-4 border border-app-border shadow-sm transition-colors duration-500">
            <div className="w-9 h-9 bg-app-danger-light rounded-xl flex items-center justify-center text-app-danger mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-xs font-black text-app-text uppercase tracking-wider">
              Dukungan CS
            </h3>
            <p className="text-[10px] text-app-text-secondary mt-1 leading-relaxed">
              Tim admin CS kami selalu siaga melayani pemesanan dan pertanyaan seputar produk.
            </p>
          </div>

        </div>

        {/* ── ADMIN ACCESS BAR ── */}
        <div className="pt-6 border-t border-app-border flex flex-col items-center">
          <p className="text-[9px] font-bold text-app-text-secondary uppercase tracking-widest mb-2.5">
            Manajemen Internal
          </p>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-5 py-2.5 bg-app-card hover:bg-app-bg text-app-text text-[10px] font-black uppercase tracking-widest rounded-xl transition duration-300 active:scale-95 border border-app-border shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Buka Mode Admin
          </Link>
        </div>

      </div>
    </div>
  );
}
