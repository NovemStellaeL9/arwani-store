"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getWaLink } from "@/utils/helpers";

export default function Footer() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = () => {
    if (typeof window !== "undefined") {
      setIsAdmin(localStorage.getItem("admin_logged_in") === "true");
    }
  };

  useEffect(() => {
    checkAdmin();
    window.addEventListener("storage", checkAdmin);
    window.addEventListener("admin_login_change", checkAdmin);
    return () => {
      window.removeEventListener("storage", checkAdmin);
      window.removeEventListener("admin_login_change", checkAdmin);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      aria-label="Navigasi Utama Bawah"
      className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto backdrop-blur-xl bg-[#081225]/90 border-t border-white/10 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-3 py-2 flex justify-between items-end z-40 h-[4.75rem]"
    >
      {/* Left side tabs */}
      <div className="flex justify-around w-[42%] pb-1">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg p-1 ${
            isActive("/") ? "text-blue-400 font-extrabold" : "text-slate-300 hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide">Beranda</span>
        </Link>

        {/* Semua Produk */}
        <Link
          href="/semua-produk"
          className={`flex flex-col items-center justify-center transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg p-1 ${
            isActive("/semua-produk") ? "text-blue-400 font-extrabold" : "text-slate-300 hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide">Katalog</span>
        </Link>
      </div>

      {/* Floating Center WA Admin button */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center z-50">
        <a
          href={getWaLink("Bantuan CS Toko", "")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi CS Admin via WhatsApp"
          className="bg-emerald-500 hover:bg-emerald-400 w-12 h-12 rounded-full flex items-center justify-center border-4 border-[#081225] shadow-lg transition-transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
        >
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.184 1.59 6.002L.004 24l6.104-1.601A11.96 11.96 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM18.16 16.924c-.26.735-1.503 1.4-2.074 1.458-.528.054-1.203.11-3.486-.838-2.738-1.134-4.516-3.923-4.654-4.108-.138-.184-1.11-1.478-1.11-2.822s.7-1.996.953-2.285c.253-.29.548-.363.733-.363.184 0 .368.006.533.013.178.008.416-.073.654.492.247.585.83 2.03.904 2.179.073.15.123.324.03.508-.091.184-.138.301-.276.467-.138.167-.291.353-.414.491-.133.15-.276.315-.12.565.156.248.694 1.133 1.493 1.894 1.033.985 1.9 1.288 2.146 1.402.247.114.39.096.536-.07.146-.167.632-.735.802-.988.17-.253.34-.212.565-.125.225.086 1.428.673 1.674.795.247.123.411.184.473.288.062.103.062.605-.198 1.34z" />
          </svg>
        </a>
        <span className="text-[9px] font-bold mt-1 text-emerald-400 uppercase tracking-wider">
          CS Admin
        </span>
      </div>

      {/* Right side tabs */}
      <div className="flex justify-around w-[42%] pb-1">
        {/* Transaksi */}
        <Link
          href="/transaksi"
          className={`flex flex-col items-center justify-center transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg p-1 ${
            isActive("/transaksi") ? "text-blue-400 font-extrabold" : "text-slate-300 hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide">Transaksi</span>
        </Link>

        {/* Admin Login/Dashboard */}
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg p-1 ${
            isActive("/admin") ? "text-blue-400 font-extrabold" : "text-slate-300 hover:text-white"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            {isAdmin ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            )}
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide text-center leading-none">
            {isAdmin ? "Admin" : "Admin"}
          </span>
        </Link>
      </div>
    </nav>
  );
}
