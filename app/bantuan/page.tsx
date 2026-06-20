"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Bagaimana cara melakukan pembelian paket?",
    a: "Pilih operator seluler Anda di halaman utama atau cari paket di halaman katalog. Klik tombol 'Beli Sekarang' pada paket yang dipilih. Anda akan diarahkan ke WhatsApp Admin dengan format pesanan otomatis. Selesaikan pembayaran sesuai arahan admin, lalu paket akan diaktifkan secara instan.",
  },
  {
    q: "Metode pembayaran apa saja yang tersedia?",
    a: "Kami menerima pembayaran melalui transfer Bank (BCA, Mandiri, BNI, BRI) serta berbagai layanan dompet digital E-Wallet (DANA, OVO, GoPay, LinkAja, ShopeePay) dan QRIS untuk kemudahan transaksi.",
  },
  {
    q: "Berapa lama proses aktivasi paket data?",
    a: "Setelah transfer pembayaran kami terima, proses aktivasi paket data biasanya memakan waktu antara 1 hingga 5 menit saja.",
  },
  {
    q: "Apakah perpanjangan masa aktif kartu menambah kuota?",
    a: "Tidak. Layanan Masa Aktif hanya menambah masa berlaku kartu SIM Anda agar tidak hangus/memasuki masa tenggang, dan tidak menyertakan kuota internet utama.",
  },
  {
    q: "Bagaimana jika terjadi kesalahan input nomor?",
    a: "Mohon pastikan kembali nomor yang dimasukkan sudah benar sebelum melakukan transfer. Kesalahan penginputan nomor di luar tanggung jawab kami apabila paket sudah terlanjur diaktifkan.",
  },
];

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-app-bg pb-10 transition-colors duration-500">
      
      {/* Header Stick */}
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
          Pusat Bantuan
        </span>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* Cara Pemesanan */}
        <div>
          <p className="text-[11px] font-bold text-app-text-secondary uppercase tracking-widest mb-3.5">
            Panduan Cara Memesan
          </p>
          <div className="bg-app-card rounded-3xl p-5 border border-app-border shadow-sm space-y-4 transition-colors duration-500">
            
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-app-primary-light text-app-primary-dark text-xs font-black flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs font-black text-app-text uppercase tracking-wider">
                  Pilih Produk
                </h4>
                <p className="text-[10px] text-app-text-secondary mt-0.5 leading-relaxed font-semibold">
                  Cari paket data seluler atau masa aktif yang Anda butuhkan melalui dashboard or katalog produk.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-app-primary-light text-app-primary-dark text-xs font-black flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs font-black text-app-text uppercase tracking-wider">
                  Kirim Pesanan WhatsApp
                </h4>
                <p className="text-[10px] text-app-text-secondary mt-0.5 leading-relaxed font-semibold">
                  Klik tombol beli untuk mengirim detail produk secara otomatis ke WhatsApp CS Admin kami.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-app-primary-light text-app-primary-dark text-xs font-black flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs font-black text-app-text uppercase tracking-wider">
                  Pembayaran & Proses
                </h4>
                <p className="text-[10px] text-app-text-secondary mt-0.5 leading-relaxed font-semibold">
                  Ikuti instruksi pembayaran dari CS Admin kami. Setelah transfer dikonfirmasi, paket data akan diisi.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Collapsible FAQ */}
        <div>
          <p className="text-[11px] font-bold text-app-text-secondary uppercase tracking-widest mb-3">
            Tanya Jawab (FAQ)
          </p>
          <div className="space-y-2">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-app-card border border-app-border rounded-2xl overflow-hidden shadow-sm transition-colors duration-500"
                >
                  <button
                    onClick={() => toggleFaq(i)}
                    className="w-full px-4 py-3.5 text-left flex justify-between items-center text-app-text hover:bg-app-bg transition-all duration-300"
                  >
                    <span className="text-xs font-black leading-tight">{faq.q}</span>
                    <svg
                      className={`w-4 h-4 text-app-text-secondary transform transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-[10.5px] font-medium text-app-text-secondary leading-relaxed border-t border-app-border">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
