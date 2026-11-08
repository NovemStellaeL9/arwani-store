"use client";

import React, { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, Search, Settings } from "lucide-react";
import { getWaLink } from "@/utils/helpers";

function subscribeAdminStatus(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getAdminSnapshot() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("admin_logged_in") === "true";
}

function getServerSnapshot() {
  return false;
}

export default function Footer() {
  const pathname = usePathname();
  const isAdmin = useSyncExternalStore(subscribeAdminStatus, getAdminSnapshot, getServerSnapshot);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      aria-label="Navigasi Utama Bawah"
      className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto backdrop-blur-xl bg-[#081225]/95 border-t border-white/10 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.6)] px-4 py-2.5 flex justify-between items-center z-40 h-[4.75rem]"
    >
      {/* Beranda */}
      <Link
        href="/"
        className={`flex flex-col items-center justify-center transition-colors rounded-xl p-1.5 ${
          isActive("/") ? "text-blue-400 font-extrabold" : "text-slate-400 hover:text-white"
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">Beranda</span>
      </Link>

      {/* Katalog */}
      <Link
        href="/semua-produk"
        className={`flex flex-col items-center justify-center transition-colors rounded-xl p-1.5 ${
          isActive("/semua-produk")
            ? "text-blue-400 font-extrabold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">Katalog</span>
      </Link>

      {/* Center WhatsApp Floating Action */}
      <a
        href={getWaLink("Bantuan CS Toko", "")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Hubungi CS Admin via WhatsApp"
        className="w-12 h-12 -mt-6 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 border-2 border-[#081225] transition-transform active:scale-95"
      >
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.184 1.59 6.002L.004 24l6.104-1.601A11.96 11.96 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM18.16 16.924c-.26.735-1.503 1.4-2.074 1.458-.528.054-1.203.11-3.486-.838-2.738-1.134-4.516-3.923-4.654-4.108-.138-.184-1.11-1.478-1.11-2.822s.7-1.996.953-2.285c.253-.29.548-.363.733-.363.184 0 .368.006.533.013.178.008.416-.073.654.492.247.585.83 2.03.904 2.179.073.15.123.324.03.508-.091.184-.138.301-.276.467-.138.167-.291.353-.414.491-.133.15-.276.315-.12.565.156.248.694 1.133 1.493 1.894 1.033.985 1.9 1.288 2.146 1.402.247.114.39.096.536-.07.146-.167.632-.735.802-.988.17-.253.34-.212.565-.125.225.086 1.428.673 1.674.795.247.123.411.184.473.288.062.103.062.605-.198 1.34z" />
        </svg>
      </a>

      {/* Lacak Transaksi */}
      <Link
        href="/transaksi"
        className={`flex flex-col items-center justify-center transition-colors rounded-xl p-1.5 ${
          isActive("/transaksi")
            ? "text-blue-400 font-extrabold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">Lacak</span>
      </Link>

      {/* Admin Panel */}
      <Link
        href="/admin"
        className={`flex flex-col items-center justify-center transition-colors rounded-xl p-1.5 ${
          isActive("/admin")
            ? "text-blue-400 font-extrabold"
            : "text-slate-400 hover:text-white"
        }`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-bold mt-1">
          {isAdmin ? "Admin" : "Masuk"}
        </span>
      </Link>
    </nav>
  );
}
