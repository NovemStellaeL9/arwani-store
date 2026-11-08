"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatRupiah, getWaLink } from "@/utils/helpers";
import { TransactionRecord } from "@/types/product";
import {
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Loader2,
  RefreshCw,
} from "lucide-react";

function TransaksiContent() {
  const searchParams = useSearchParams();
  const [searchRef, setSearchRef] = useState("");
  const [checkLoading, setCheckLoading] = useState(false);
  const [activeCheckResult, setActiveCheckResult] = useState<TransactionRecord | null>(null);
  const [checkError, setCheckError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const queryRef = searchParams.get("refid");
    if (queryRef) {
      setSearchRef(queryRef);
      handleCheck(queryRef);
    }
  }, [searchParams]);

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

      if (json.success && json.transaction) {
        setActiveCheckResult(json.transaction);
      } else {
        setCheckError(json.message || "Pesanan dengan ID referensi tersebut tidak ditemukan.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Koneksi terputus saat memeriksa status.";
      setCheckError(msg);
    } finally {
      setCheckLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#081225] px-5 py-6 text-white space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-base font-black tracking-wide">Lacak Pesanan Kuota</h1>
          <p className="text-[11px] text-slate-400">
            Periksa status real-time pembayaran &amp; injeksi paket
          </p>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-[#0e1a34] p-4 rounded-3xl border border-white/10 shadow-xl space-y-3">
        <label
          htmlFor="ref-search"
          className="text-xs font-bold text-slate-300 uppercase tracking-wider block"
        >
          ID Referensi Transaksi
        </label>
        <div className="flex gap-2">
          <input
            id="ref-search"
            type="text"
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            placeholder="Contoh: ARW-261109-12345"
            className="flex-1 bg-black/40 border border-white/10 focus:border-blue-500 px-4 py-3 rounded-2xl text-white font-mono text-xs uppercase tracking-wider outline-none"
          />
          <button
            onClick={() => handleCheck(searchRef)}
            disabled={checkLoading}
            className="px-4 py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
          >
            {checkLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Cari</span>
          </button>
        </div>

        {checkError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{checkError}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {activeCheckResult && (
        <div className="bg-[#0e1a34] p-5 rounded-3xl border border-white/10 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] text-slate-400 block">ID Referensi</span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-sm font-bold text-white">
                  {activeCheckResult.refid}
                </span>
                <button
                  onClick={() => handleCopy(activeCheckResult.refid)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Status Badge */}
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border ${
                activeCheckResult.status === "SUCCESS"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                  : activeCheckResult.status === "PENDING"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : activeCheckResult.status === "PROCESSING" || activeCheckResult.status === "PAID"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                  : "bg-red-500/20 text-red-300 border-red-500/30"
              }`}
            >
              {activeCheckResult.status === "SUCCESS" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : activeCheckResult.status === "PENDING" ? (
                <Clock className="w-3.5 h-3.5" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              )}
              {activeCheckResult.statusLabel || activeCheckResult.status}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Nomor Tujuan:</span>
              <span className="font-mono font-bold text-white">
                {activeCheckResult.phoneNumber}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Paket Kuota:</span>
              <span className="font-bold text-white text-right max-w-[60%]">
                {activeCheckResult.productName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Metode Pembayaran:</span>
              <span className="font-mono font-bold text-blue-400">
                {activeCheckResult.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Pembayaran:</span>
              <span className="font-mono font-black text-emerald-400">
                {formatRupiah(activeCheckResult.totalAmount)}
              </span>
            </div>
            {activeCheckResult.sn && (
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-slate-400">Serial Number (SN):</span>
                <span className="font-mono text-amber-300 font-bold">
                  {activeCheckResult.sn}
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10">
              <span className="text-[10px] text-slate-400 block mb-0.5">Catatan Sistem:</span>
              <p className="text-[11px] text-slate-300 leading-relaxed bg-black/30 p-2.5 rounded-xl border border-white/5">
                {activeCheckResult.message || "Transaksi tercatat di sistem."}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={getWaLink(
                activeCheckResult.productName,
                activeCheckResult.totalAmount,
                activeCheckResult.phoneNumber,
                activeCheckResult.refid
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Bantuan CS WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransaksiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#081225] flex items-center justify-center text-white">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      }
    >
      <TransaksiContent />
    </Suspense>
  );
}
