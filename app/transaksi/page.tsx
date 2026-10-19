"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatRupiah } from "@/utils/helpers";

interface OrderRecord {
  refid: string;
  trxuuid?: string;
  productcode: string;
  productName: string;
  phonenumber: string;
  price: number;
  status: string;
  statusLabel: string;
  message: string;
  time?: string;
  createdAt?: string;
}

function TransaksiContent() {
  const searchParams = useSearchParams();
  const [searchRef, setSearchRef] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [activeCheckResult, setActiveCheckResult] = useState<any | null>(null);
  const [checkError, setCheckError] = useState("");
  const [orders, setOrders] = useState<OrderRecord[]>([]);

  useEffect(() => {
    const queryRef = searchParams.get("refid");
    if (queryRef) {
      setSearchRef(queryRef);
      handleCheck(queryRef);
    }
  }, [searchParams]);

  useEffect(() => {
    loadLocalOrders();
  }, []);

  const loadLocalOrders = () => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("arwani_user_orders");
      if (stored) {
        setOrders(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Gagal memuat riwayat lokal:", e);
    }
  };

  const handleCheck = async (refToSearch: string) => {
    const cleanRef = refToSearch.trim();
    if (!cleanRef) {
      setCheckError("Silakan masukkan ID Referensi pesanan.");
      return;
    }

    setCheckLoading(true);
    setCheckError("");
    setActiveCheckResult(null);

    try {
      const res = await fetch(`/api/check-status?refid=${encodeURIComponent(cleanRef)}`);
      const json = await res.json();

      if (json.success && json.data) {
        setActiveCheckResult(json.data);

        // Update in local history if matching
        setOrders((prev) => {
          const updated = prev.map((item) => {
            if (item.refid.toLowerCase() === cleanRef.toLowerCase()) {
              return {
                ...item,
                status: json.data.status,
                statusLabel: json.data.statusLabel || (json.data.status === "00" ? "Sukses" : "Gagal"),
                message: json.data.message || item.message,
                trxuuid: json.data.trxuuid || item.trxuuid,
              };
            }
            return item;
          });
          localStorage.setItem("arwani_user_orders", JSON.stringify(updated));
          return updated;
        });
      } else {
        setCheckError(json.message || "Pesanan dengan ID referensi tersebut tidak ditemukan.");
      }
    } catch (err: any) {
      setCheckError(err?.message || "Koneksi terputus saat memeriksa status.");
    } finally {
      setCheckLoading(false);
    }
  };

  const handleRefreshItem = (refid: string) => {
    setSearchRef(refid);
    handleCheck(refid);
  };

  const handleClearHistory = () => {
    if (confirm("Apakah Anda yakin ingin menghapus riwayat pesanan di perangkat ini?")) {
      localStorage.removeItem("arwani_user_orders");
      setOrders([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#081225] text-white px-5 py-6 pb-28 space-y-6">
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
            Cek Transaksi
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Lacak status pembelian Anda langsung dari server penyedia
          </p>
        </div>
      </div>

      {/* Search by RefID Box */}
      <div className="bg-[#0e1a34] rounded-2xl p-5 border border-white/10 shadow-lg space-y-3">
        <label htmlFor="refid-search" className="block text-xs font-bold text-slate-200">
          Lacak ID Referensi (RefID)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="refid-search"
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Contoh: ARW-261019-12345"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/15 rounded-xl text-white placeholder-slate-400 text-sm font-mono focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none transition-all"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCheck(searchRef);
            }}
          />
          <button
            onClick={() => handleCheck(searchRef)}
            disabled={checkLoading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            {checkLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Memeriksa...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Periksa Status</span>
              </>
            )}
          </button>
        </div>

        {checkError && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {checkError}
          </div>
        )}
      </div>

      {/* Active Checked Result Card */}
      {activeCheckResult && (
        <div className="bg-[#0e1a34] rounded-2xl p-5 border border-blue-500/40 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                Hasil Pemeriksaan Langsung
              </p>
              <h2 className="text-sm font-mono font-bold text-white mt-0.5">
                {activeCheckResult.refid}
              </h2>
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                activeCheckResult.status === "00"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : activeCheckResult.statusLabel === "Diproses"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
              }`}
            >
              {activeCheckResult.statusLabel || (activeCheckResult.status === "00" ? "Sukses" : "Gagal")}
            </span>
          </div>

          <p className="text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/5 leading-relaxed">
            {activeCheckResult.message || "Status transaksi terkonfirmasi."}
          </p>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {activeCheckResult.productcode && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Kode Produk:</span>
                <span className="font-mono font-bold text-white">{activeCheckResult.productcode}</span>
              </div>
            )}
            {activeCheckResult.phonenumber && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Tujuan:</span>
                <span className="font-mono font-bold text-white">{activeCheckResult.phonenumber}</span>
              </div>
            )}
            {activeCheckResult.price > 0 && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Harga:</span>
                <span className="font-bold text-emerald-400">{formatRupiah(activeCheckResult.price)}</span>
              </div>
            )}
            {activeCheckResult.time && (
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] text-slate-400 block font-medium">Waktu Transaksi (WIB):</span>
                <span className="font-mono text-slate-300 text-[11px]">{activeCheckResult.time}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Local Orders History Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Riwayat Pesanan Anda ({orders.length})
          </h2>
          {orders.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-[10px] text-slate-400 hover:text-rose-400 transition-colors"
            >
              Bersihkan Riwayat
            </button>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="bg-[#0e1a34] rounded-2xl p-8 border border-white/10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 text-slate-400 mx-auto flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-white">Belum Ada Riwayat Pesanan</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Pesanan yang Anda buat akan tercatat otomatis di perangkat ini untuk memudahkan pelacakan status.
              </p>
            </div>
            <Link
              href="/semua-produk"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Lihat Katalog Paket
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((item, idx) => (
              <div
                key={`${item.refid}-${idx}`}
                className="bg-[#0e1a34] rounded-2xl p-4 border border-white/10 shadow-md space-y-3 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[11px] font-bold text-blue-300 block">
                      {item.refid}
                    </span>
                    <h3 className="text-xs font-extrabold text-white mt-0.5">
                      {item.productName || item.productcode}
                    </h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      item.status === "00"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : item.statusLabel === "Diproses"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                        : "bg-slate-700 text-slate-300 border-white/10"
                    }`}
                  >
                    {item.statusLabel || (item.status === "00" ? "Sukses" : "Gagal")}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2 text-slate-300">
                  <span>Nomor: <span className="font-mono font-bold text-white">{item.phonenumber}</span></span>
                  <span className="font-bold text-emerald-400">{formatRupiah(item.price)}</span>
                </div>

                {item.message && (
                  <p className="text-[11px] text-slate-400 bg-white/5 p-2 rounded-lg leading-relaxed">
                    {item.message}
                  </p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => handleRefreshItem(item.refid)}
                    className="flex-1 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Periksa Ulang
                  </button>
                  <a
                    href={`https://wa.me/6285967096912?text=${encodeURIComponent(
                      `Halo CS Admin, saya ingin menanyakan status pesanan saya dengan ID: ${item.refid}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    Tanya CS
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TransaksiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#081225] p-5 text-white flex items-center justify-center">
          <p className="text-xs text-slate-400">Memuat data transaksi...</p>
        </div>
      }
    >
      <TransaksiContent />
    </Suspense>
  );
}

