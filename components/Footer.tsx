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

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto backdrop-blur-xl bg-app-footer-bg border-t border-app-footer-border rounded-t-[2rem] shadow-[0_-10px_35px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_-10px_35px_-12px_rgba(0,0,0,0.4)] px-4 py-2 flex justify-between items-end z-40 h-[4.75rem] transition-colors duration-500">
      
      {/* Left side tabs */}
      <div className="flex justify-around w-[40%] pb-1">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
            isActive("/")
              ? "text-app-primary font-black scale-105"
              : "text-app-text-secondary hover:text-app-text"
          }`}
        >
          <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide">Dashboard</span>
        </Link>

        {/* Semua Produk */}
        <Link
          href="/semua-produk"
          className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
            isActive("/semua-produk")
              ? "text-app-primary font-black scale-105"
              : "text-app-text-secondary hover:text-app-text"
          }`}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide">Semua Paket</span>
        </Link>
      </div>

      {/* Floating Center WA Admin button */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-5 flex flex-col items-center z-50">
        <a
          href={getWaLink("Bantuan CS Admin", "")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Admin via WhatsApp"
          className="bg-emerald-500 dark:bg-emerald-600 w-13 h-13 rounded-full flex items-center justify-center border-4 border-app-bg hover:scale-110 hover:shadow-[0_8px_25px_rgba(16,185,129,0.5)] active:scale-95 transition-all duration-300 shadow-[0_4px_16px_rgba(16,185,129,0.35)]"
        >
          <svg className="w-6.5 h-6.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.184 1.59 6.002L.004 24l6.104-1.601A11.96 11.96 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM18.16 16.924c-.26.735-1.503 1.4-2.074 1.458-.528.054-1.203.11-3.486-.838-2.738-1.134-4.516-3.923-4.654-4.108-.138-.184-1.11-1.478-1.11-2.822s.7-1.996.953-2.285c.253-.29.548-.363.733-.363.184 0 .368.006.533.013.178.008.416-.073.654.492.247.585.83 2.03.904 2.179.073.15.123.324.03.508-.091.184-.138.301-.276.467-.138.167-.291.353-.414.491-.133.15-.276.315-.12.565.156.248.694 1.133 1.493 1.894 1.033.985 1.9 1.288 2.146 1.402.247.114.39.096.536-.07.146-.167.632-.735.802-.988.17-.253.34-.212.565-.125.225.086 1.428.673 1.674.795.247.123.411.184.473.288.062.103.062.605-.198 1.34z" />
          </svg>
        </a>
        <span className="text-[9px] font-black mt-1 text-emerald-500 dark:text-emerald-400 drop-shadow-sm uppercase tracking-widest">
          CS Admin
        </span>
      </div>

      {/* Right side tabs */}
      <div className="flex justify-around w-[40%] pb-1">
        {/* Bantuan */}
        <Link
          href="/bantuan"
          className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
            isActive("/bantuan")
              ? "text-app-primary font-black scale-105"
              : "text-app-text-secondary hover:text-app-text"
          }`}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide">Bantuan</span>
        </Link>

        {/* Admin Login/Dashboard */}
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center transition-all duration-300 active:scale-90 ${
            isActive("/admin")
              ? "text-app-primary font-black scale-105"
              : "text-app-text-secondary hover:text-app-text"
          }`}
        >
          <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            {isAdmin ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            )}
          </svg>
          <span className="text-[9px] font-bold mt-1 tracking-wide text-center leading-none">
            {isAdmin ? "Admin" : "Login Admin"}
          </span>
        </Link>
      </div>

    </div>
  );
}
