"use client";

import React from 'react';

const products = [
  { id: 1, name: "Pulsa All Operator", desc: "Isi ulang cepat 24 jam", icon: "📱" },
  { id: 2, name: "Kuota Data", desc: "Paket hemat semua provider", icon: "🌐" },
  { id: 3, name: "App Premium", desc: "Netflix, Spotify, Canva Pro", icon: "💎" },
  { id: 4, name: "Top Up Game", desc: "MLBB, FF, PUBG Mobile", icon: "🎮" },
];

export default function LandingPage() {
  const whatsappNumber = "6285967096912"; // Nomor WA Anda sudah terpasang otomatis

  // Fungsi pembuat link WhatsApp Anti-Blokir
  const getWaLink = (productName: string) => {
    const message = `Halo Arwani D'Gabriel Store, saya ingin memesan ${productName}. Bagaimana prosedurnya?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-emerald-600">ARWANI D'GABRIEL <span className="text-slate-400">STORE</span></h1>
          <a 
            href={getWaLink("Informasi Umum")}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition"
          >
            Hubungi Admin
          </a>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Solusi Kebutuhan Digital <br/> <span className="text-emerald-600">Cepat, Murah, Terpercaya.</span>
        </h2>
        <p className="text-lg text-slate-600 mb-10">
          Tersedia Pulsa, Kuota, hingga Akun Premium. Pembayaran mudah via QRIS dan transaksi langsung via WhatsApp.
        </p>
      </section>

      <section id="produk" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <a 
              key={item.id} 
              href={getWaLink(item.name)}
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition group block"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-slate-500 text-sm mb-6">{item.desc}</p>
              <div className="w-full py-3 bg-emerald-50 text-emerald-700 text-center font-bold rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition">
                Pesan Sekarang
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-slate-400 text-sm bg-emerald-900 text-white mt-10">
        <p>© 2026 Arwani D'Gabriel Store. Pelayanan sepenuh hati.</p>
      </footer>
    </div>
  );
}