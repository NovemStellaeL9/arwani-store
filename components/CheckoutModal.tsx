"use client";

import React, { useState } from "react";
import { Product, PurchaseResponse } from "@/types/product";
import { formatRupiah, detectOperatorFromPhone, getWaLink } from "@/utils/helpers";

interface CheckoutModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess?: (res: PurchaseResponse) => void;
}

export default function CheckoutModal({ product, onClose, onSuccess }: CheckoutModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<PurchaseResponse | null>(null);

  if (!product) return null;

  const detectedOperator = detectOperatorFromPhone(phoneNumber);
  const isOperatorMismatched =
    detectedOperator &&
    product.category !== "MasaAktif" &&
    product.category !== "PLN" &&
    product.category !== "DANA" &&
    !product.category.toLowerCase().includes(detectedOperator.toLowerCase()) &&
    !detectedOperator.toLowerCase().includes(product.category.toLowerCase());

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMsg("Nomor HP minimal 10 digit angka!");
      return;
    }

    if (!product.code) {
      // Jika produk tidak punya SKU code (produk manual lokal), arahkan ke WhatsApp
      window.open(getWaLink(product.name, product.price), "_blank");
      onClose();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productcode: product.code,
          phonenumber: phoneNumber,
        }),
      });

      const data: PurchaseResponse = await res.json();
      setResult(data);

      if (data.success) {
        if (onSuccess) onSuccess(data);
      } else {
        setErrorMsg(data.message || "Transaksi belum berhasil diproses.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] border border-white/10 rounded-3xl w-full max-w-md p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Form */}
        {!result ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {product.category}
              </span>
              {product.code && (
                <span className="text-[10px] font-mono font-semibold text-slate-400">
                  SKU: {product.code}
                </span>
              )}
            </div>

            <h3 className="text-base font-black text-white leading-snug">
              {product.name}
            </h3>
            <p className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
              {product.desc}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-300 font-semibold">Total Pembayaran:</span>
              <span className="text-lg font-black text-blue-400">
                {formatRupiah(product.price)}
              </span>
            </div>

            <form onSubmit={handlePurchase} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Nomor HP Tujuan:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Contoh: 081234567890"
                    maxLength={14}
                    required
                    className="w-full bg-white/[0.07] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                  {detectedOperator && (
                    <div className="absolute right-3 top-2.5 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-black uppercase text-blue-300 border border-white/10">
                      {detectedOperator}
                    </div>
                  )}
                </div>

                {isOperatorMismatched && (
                  <p className="text-[10px] text-amber-400 mt-1.5 flex items-center gap-1 font-semibold">
                    <span>⚠️</span> Nomor terdeteksi {detectedOperator}, tetapi paket ini untuk {product.category}.
                  </p>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting || product.isAvailable === false}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Memproses Pembelian API...</span>
                    </>
                  ) : (
                    <span>Beli Otomatis (Proses Instan)</span>
                  )}
                </button>

                <a
                  href={getWaLink(product.name, product.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Pesan Manual via WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        ) : (
          /* Struk Hasil Transaksi */
          <div className="text-center py-4">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 ${
              result.success ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}>
              {result.success ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            <h4 className="text-lg font-black text-white">
              {result.success ? "Pembelian Berhasil Diproses!" : "Status Transaksi"}
            </h4>
            <p className="text-xs text-slate-300 mt-1 max-w-[90%] mx-auto">
              {result.message}
            </p>

            <div className="mt-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Ref ID:</span>
                <span className="text-slate-200 font-bold">{result.refid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nomor HP:</span>
                <span className="text-slate-200 font-bold">{result.phonenumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Kode Status:</span>
                <span className="text-blue-400 font-bold">{result.status}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
