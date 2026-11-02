"use client";

import React, { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { formatRupiah, detectOperator, getWaLink } from "@/utils/helpers";

interface CheckoutModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (order: any) => void;
}

export default function CheckoutModal({
  product,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [detectedOp, setDetectedOp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber("");
      setDetectedOp("");
      setOrderResult(null);
      setErrorMsg("");
      setCopied(false);
    }
  }, [isOpen, product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  const handlePhoneChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, "");
    setPhoneNumber(clean);
    setDetectedOp(detectOperator(clean));
    setErrorMsg("");
  };

  const handleDirectApiOrder = async () => {
    if (!product) return;

    if (phoneNumber.length < 4) {
      setErrorMsg("Nomor tujuan minimal 4 digit angka.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    const refid = `ARW-${Date.now().toString().slice(-8)}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productcode: product.code || product.name,
          phonenumber: phoneNumber,
          refid,
          productName: product.name,
          category: product.category,
        }),
      });

      const json = await res.json();

      if (json.success) {
        setOrderResult(json.data);
        saveLocalOrder({
          refid: json.data.refid || refid,
          trxuuid: json.data.trxuuid,
          productcode: product.code || product.name,
          productName: product.name,
          phonenumber: phoneNumber,
          price: product.price,
          status: "00",
          statusLabel: "Sukses",
          message: json.data.message || "Pembelian berhasil diproses.",
          time: json.data.time || new Date().toLocaleString("id-ID"),
        });
        if (onSuccess) onSuccess(json.data);
      } else {
        const data = json.data || {};
        const msg = data.message || json.message || "Pesanan tidak dapat diproses saat ini.";
        setOrderResult({
          refid,
          status: data.status || "01",
          message: msg,
          failed: true,
          insufficientBalance: msg.toLowerCase().includes("saldo tidak cukup") || msg.toLowerCase().includes("sisa saldo"),
        });
        saveLocalOrder({
          refid,
          productcode: product.code || product.name,
          productName: product.name,
          phonenumber: phoneNumber,
          price: product.price,
          status: data.status || "01",
          statusLabel: "Menunggu CS",
          message: msg,
          time: new Date().toLocaleString("id-ID"),
        });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Koneksi ke server terputus. Silakan coba kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveLocalOrder = (order: any) => {
    if (typeof window === "undefined") return;
    try {
      const existing = JSON.parse(localStorage.getItem("arwani_user_orders") || "[]");
      existing.unshift({
        ...order,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("arwani_user_orders", JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.error("Gagal menyimpan riwayat pesanan lokal:", e);
    }
  };

  const handleCopyRef = (text: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !product) return null;

  const isPln = product.category === "PLN" || product.name.toLowerCase().includes("pln");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#0b1730] text-white border border-white/15 rounded-3xl p-6 shadow-2xl space-y-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
              Formulir Pembelian
            </p>
            <h2 id="modal-title" className="text-base font-extrabold text-white mt-0.5 leading-snug">
              {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
            aria-label="Tutup jendela pembelian"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Success State */}
        {orderResult && !orderResult.failed && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-center space-y-1.5">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-black text-emerald-300">Transaksi Berhasil Diterima</p>
              <p className="text-[11px] text-emerald-200/90 leading-relaxed">
                {orderResult.message || "Pesanan telah dikirim ke sistem dan sedang diproses."}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">ID Referensi:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-blue-300">
                  <span>{orderResult.refid}</span>
                  <button
                    onClick={() => handleCopyRef(orderResult.refid)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                  >
                    {copied ? "Tersalin" : "Salin"}
                  </button>
                </div>
              </div>
              {orderResult.trxuuid && (
                <div className="flex justify-between items-center py-1 border-b border-white/5">
                  <span className="text-slate-400">UUID Sistem:</span>
                  <span className="font-mono text-[10px] text-slate-300 max-w-[180px] truncate">
                    {orderResult.trxuuid}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-400">Nomor Tujuan:</span>
                <span className="font-bold text-white">{phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Total Harga:</span>
                <span className="font-extrabold text-emerald-400">{formatRupiah(product.price)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              Selesai & Tutup
            </button>
          </div>
        )}

        {/* Failed or Balance Low Notice */}
        {orderResult && orderResult.failed && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-200 space-y-2">
              <p className="text-xs font-black text-amber-300 uppercase tracking-wide">
                Konfirmasi Pesanan
              </p>
              <p className="text-[11px] leading-relaxed text-amber-100">
                {orderResult.insufficientBalance
                  ? "Sistem otomatis sedang dalam antrean pengisian saldo. Anda dapat langsung memproses pesanan ini melalui WhatsApp Admin tanpa biaya tambahan."
                  : orderResult.message}
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Kode ID Pesanan:</span>
                <span className="font-mono font-bold text-blue-300">{orderResult.refid}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tujuan:</span>
                <span className="font-bold text-white">{phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Harga:</span>
                <span className="font-black text-white">{formatRupiah(product.price)}</span>
              </div>
            </div>

            <a
              href={getWaLink(product.name, product.price, phoneNumber, orderResult.refid)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.184 1.59 6.002L.004 24l6.104-1.601A11.96 11.96 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM18.16 16.924c-.26.735-1.503 1.4-2.074 1.458-.528.054-1.203.11-3.486-.838-2.738-1.134-4.516-3.923-4.654-4.108-.138-.184-1.11-1.478-1.11-2.822s.7-1.996.953-2.285c.253-.29.548-.363.733-.363.184 0 .368.006.533.013.178.008.416-.073.654.492.247.585.83 2.03.904 2.179.073.15.123.324.03.508-.091.184-.138.301-.276.467-.138.167-.291.353-.414.491-.133.15-.276.315-.12.565.156.248.694 1.133 1.493 1.894 1.033.985 1.9 1.288 2.146 1.402.247.114.39.096.536-.07.146-.167.632-.735.802-.988.17-.253.34-.212.565-.125.225.086 1.428.673 1.674.795.247.123.411.184.473.288.062.103.062.605-.198 1.34z" />
              </svg>
              Lanjutkan via WhatsApp Admin
            </a>

            <button
              onClick={() => setOrderResult(null)}
              className="w-full py-2.5 text-center text-xs text-slate-400 hover:text-white transition-colors"
            >
              Coba Ulangi
            </button>
          </div>
        )}

        {/* Input Form */}
        {!orderResult && (
          <div className="space-y-4">
            {/* Product Meta */}
            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Kategori / Kode:</span>
                <span className="font-mono font-bold text-slate-200">
                  {product.category} ({product.code || product.name})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Harga Paket:</span>
                <span className="text-sm font-black text-blue-400">{formatRupiah(product.price)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status Stok:</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {product.stock === 999 || product.stock === 9999
                    ? "Selalu Tersedia"
                    : typeof product.stock === "number"
                    ? `${product.stock} Tersedia`
                    : "Tersedia"}
                </span>
              </div>
            </div>

            {/* Input Field */}
            <div className="space-y-1.5">
              <label htmlFor="phone-input" className="block text-xs font-bold text-slate-200">
                {isPln ? "Nomor Meter / ID Pelanggan PLN" : "Nomor Handphone Tujuan"}
              </label>
              <div className="relative">
                <input
                  id="phone-input"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder={isPln ? "Contoh: 14012345678" : "Contoh: 081234567890"}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 text-sm font-mono focus:border-blue-400 focus:ring-2 focus:ring-blue-400/40 focus:outline-none transition-all"
                  autoFocus
                  disabled={isSubmitting}
                />
                {detectedOp && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    {detectedOp}
                  </span>
                )}
              </div>
              {errorMsg && <p className="text-[11px] text-rose-400 font-semibold">{errorMsg}</p>}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDirectApiOrder}
                disabled={isSubmitting || phoneNumber.length < 4}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Memproses Transaksi...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Proses Sekarang (API)</span>
                  </>
                )}
              </button>

              <a
                href={getWaLink(product.name, product.price, phoneNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-white/10 focus:ring-2 focus:ring-white/30 focus:outline-none"
              >
                <svg className="w-4 h-4 text-emerald-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.184 1.59 6.002L.004 24l6.104-1.601A11.96 11.96 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM18.16 16.924c-.26.735-1.503 1.4-2.074 1.458-.528.054-1.203.11-3.486-.838-2.738-1.134-4.516-3.923-4.654-4.108-.138-.184-1.11-1.478-1.11-2.822s.7-1.996.953-2.285c.253-.29.548-.363.733-.363.184 0 .368.006.533.013.178.008.416-.073.654.492.247.585.83 2.03.904 2.179.073.15.123.324.03.508-.091.184-.138.301-.276.467-.138.167-.291.353-.414.491-.133.15-.276.315-.12.565.156.248.694 1.133 1.493 1.894 1.033.985 1.9 1.288 2.146 1.402.247.114.39.096.536-.07.146-.167.632-.735.802-.988.17-.253.34-.212.565-.125.225.086 1.428.673 1.674.795.247.123.411.184.473.288.062.103.062.605-.198 1.34z" />
                </svg>
                <span>Pesan Manual via WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

