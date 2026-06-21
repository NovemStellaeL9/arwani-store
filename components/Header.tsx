"use client";

import React, { useState, useEffect } from "react";

export default function Header() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format Indonesian Date
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  return (
    <div className="bg-white/[0.04] backdrop-blur-xl text-white px-5 py-6 rounded-b-[2.5rem] shadow-xl relative z-20 border-b border-white/10 transition-all duration-300">
      
      {/* Greeting Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-base font-black tracking-tight text-white flex items-center gap-1">
            Halo Kak, Selamat Datang 👋
          </h2>
          <p className="text-[11px] text-[#cbd5e1] font-semibold mt-1">
            Pilih paket internet terbaikmu hari ini
          </p>
        </div>
      </div>

      {/* STORE CARD: Floating glass card */}
      <div className="bg-white/[0.08] backdrop-blur-md border border-white/12 rounded-2xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:scale-[1.01] transition-transform duration-300">
        <div className="flex justify-between items-center mb-2.5">
          <h1 className="text-sm font-black tracking-wider text-white">
            ARWANI D'GABRIEL STORE
          </h1>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black rounded-lg uppercase tracking-wider animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Online
          </span>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-[#cbd5e1] font-semibold">
          <span>Jam Operasional: 24 Jam</span>
          <span className="font-extrabold text-blue-400 uppercase tracking-wide">
            {currentDate || "Memuat tanggal..."}
          </span>
        </div>
      </div>
      
    </div>
  );
}
