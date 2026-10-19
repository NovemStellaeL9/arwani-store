"use client";

import React, { useState } from "react";
import Link from "next/link";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Bagaimana cara melakukan pembelian paket atau layanan?",
    a: "Pilih paket yang Anda butuhkan melalui halaman Beranda atau Katalog. Klik tombol 'Beli Sekarang' pada produk yang dipilih, masukkan nomor tujuan, lalu pilih proses transaksi otomatis atau melalui konfirmasi WhatsApp CS Admin.",
  },
  {
    q: "Bagaimana cara mengecek status pesanan yang telah dibuat?",
    a: "Buka menu 'Transaksi' di navigasi bawah atau melalui beranda. Masukkan ID Referensi pesanan Anda (contoh: ARW-xxxx-xxxx) lalu klik 'Periksa Status' untuk melihat status terkini langsung dari server penyedia.",
  },
  {
    q: "Berapa lama proses transaksi hingga paket aktif?",
    a: "Transaksi diproses secara real-time melalui sistem API. Umumnya kuota atau pulsa masuk dalam 1 hingga 3 menit setelah pembayaran dan proses order berhasil.",
  },
  {
    q: "Apakah perpanjangan masa aktif kartu menambah kuota data?",
    a: "Tidak. Layanan Masa Aktif khusus menambah masa berlaku kartu SIM Anda agar tidak terblokir atau memasuki masa tenggang, dan tidak menyertakan kuota data internet utama.",
  },
  {
    q: "Bagaimana jika nomor tujuan salah diinput?",
    a: "Mohon pastikan nomor tujuan sudah benar sebelum memproses transaksi. Karena sistem memproses pesanan secara langsung dan instan, transaksi yang sudah terlanjur diproses ke nomor yang salah tidak dapat ditarik kembali.",
  },
  {
    q: "Bagaimana jika membutuhkan bantuan pelanggan?",
    a: "Anda dapat menghubungi CS Admin kami kapan saja melalui tombol WhatsApp yang berada di tengah bilah navigasi bawah.",
  },
];

export default function Bantuan() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#081225] pb-28 text-white px-5 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 font-bold hover:text-blue-300 transition-colors mb-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>
          <h1 className="text-xl font-black text-white tracking-wide">
            Pusat Bantuan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Panduan lengkap transaksi dan tanya jawab seputar layanan
          </p>
        </div>
      </div>

      {/* Panduan 3 Langkah */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Panduan Pembelian
        </h2>
        <div className="bg-[#0e1a34] rounded-2xl p-5 border border-white/10 shadow-md space-y-4">
          <div className="flex gap-3.5">
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-black flex items-center justify-center flex-shrink-0 border border-blue-500/30">
              1
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Pilih Produk & Masukkan Nomor
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Pilih paket kuota, masa aktif, atau voucher yang diinginkan dari katalog dan isi nomor handphone tujuan.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 border-t border-white/5 pt-3">
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-black flex items-center justify-center flex-shrink-0 border border-blue-500/30">
              2
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Pilih Jalur Transaksi
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Pilih proses otomatis langsung via API, atau konfirmasi manual melalui CS WhatsApp kami.
              </p>
            </div>
          </div>

          <div className="flex gap-3.5 border-t border-white/5 pt-3">
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 text-xs font-black flex items-center justify-center flex-shrink-0 border border-blue-500/30">
              3
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-wider">
                Lacak Status Pesanan
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                Simpan ID Referensi untuk melacak status transaksi Anda secara langsung di menu Transaksi.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Pertanyaan yang Sering Diajukan
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div
                key={i}
                className="bg-[#0e1a34] border border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full px-4 py-3.5 text-left flex justify-between items-center text-white hover:bg-white/5 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-xs font-bold leading-snug">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-slate-400 transform transition-transform duration-200 ml-2 flex-shrink-0 ${
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
                  <div className="px-4 pb-4 pt-2 text-xs text-slate-300 leading-relaxed border-t border-white/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Prompt */}
      <div className="bg-[#0e1a34] rounded-2xl p-5 border border-white/10 text-center space-y-3">
        <p className="text-xs text-slate-300">
          Masih memiliki pertanyaan atau kendala transaksi?
        </p>
        <a
          href="https://wa.me/6285967096912?text=Halo%20CS%20Arwani%20Store,%20saya%20butuh%20bantuan."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Hubungi CS WhatsApp
        </a>
      </div>
    </div>
  );
}
