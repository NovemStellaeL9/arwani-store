"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, TransactionRecord } from "@/types/product";
import {
  formatRupiah,
  detectOperator,
  getOperatorMeta,
  getWaPaymentConfirmationLink,
} from "@/utils/helpers";
import {
  X,
  Smartphone,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  QrCode,
  Wallet,
  ArrowRight,
  Loader2,
  AlertCircle,
  Download,
  MessageCircle,
} from "lucide-react";

interface CheckoutModalProps {
  product: Product | null;
  initialPhoneNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (order: TransactionRecord) => void;
}

export default function CheckoutModal({
  product,
  initialPhoneNumber,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [step, setStep] = useState<"SUMMARY" | "PAYMENT" | "SUCCESS">("SUMMARY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentOrder, setCurrentOrder] = useState<TransactionRecord | null>(null);
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(initialPhoneNumber);
      setStep("SUMMARY");
      setErrorMessage("");
      setCurrentOrder(null);
    }
  }, [isOpen, initialPhoneNumber]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !product) return null;

  const currentOp = detectOperator(phoneNumber) || product.operator;
  const opMeta = getOperatorMeta(currentOp);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2500);
    }
  };

  const handleProceedToPayment = async () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
    if (cleanPhone.length < 4) {
      setErrorMessage("Silakan masukkan nomor telepon tujuan minimal 4 digit.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productCode: product.code,
          phoneNumber: cleanPhone,
          // Kirim QRIS sebagai default karena pembayaran langsung (tidak ada pilihan)
          paymentMethod: "QRIS",
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setCurrentOrder(data.order);
        setStep("PAYMENT");
        if (onSuccess) onSuccess(data.order);
      } else {
        setErrorMessage(data.message || "Gagal membuat sesi pembayaran.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kendala koneksi.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-[#0b1528] border border-white/10 rounded-3xl w-full max-w-md max-h-[94vh] overflow-y-auto shadow-2xl text-white flex flex-col justify-between"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0b1528]/95 backdrop-blur-md px-5 py-4 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide">
                {step === "SUMMARY"
                  ? "Ringkasan Pembelian"
                  : step === "PAYMENT"
                  ? "Pembayaran & Konfirmasi WA"
                  : "Transaksi Selesai"}
              </h3>
              <p className="text-[10px] text-slate-400">
                {step === "SUMMARY"
                  ? "Periksa detail pesanan Anda"
                  : "Bayar via QRIS / GoPay & wajib konfirmasi ke WA"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup dialog"
            className="p-1.5 rounded-full text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {/* ================= STEP 1: SUMMARY ================= */}
          {step === "SUMMARY" && (
            <>
              {/* Phone Input Confirmation */}
              <div className="bg-[#101c38] p-3.5 rounded-2xl border border-white/10 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                    Nomor Tujuan Pengisian
                  </span>
                  {currentOp && (
                    <span className="text-emerald-400 font-extrabold">{currentOp}</span>
                  )}
                </label>
                <div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Masukkan nomor HP tujuan"
                    className="w-full bg-black/40 border border-white/10 focus:border-blue-500 px-3.5 py-2.5 rounded-xl text-white font-mono text-sm tracking-wider outline-none"
                  />
                </div>
              </div>

              {/* Product Information Card */}
              <div className="bg-[#101c38] p-4 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 relative flex-shrink-0">
                      <Image
                        src={opMeta.logo}
                        alt={product.operator}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${opMeta.badgeBg} ${opMeta.badgeText} ${opMeta.borderColor}`}
                    >
                      {product.operator}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Masa Aktif {product.validity}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{product.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {product.desc}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-[11px]">
                  <span className="text-slate-400">Total Kuota:</span>
                  <span className="font-black text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    {product.quota}
                  </span>
                </div>
              </div>

              {/* Info Pembayaran Langsung (QRIS + GoPay) */}
              <div className="bg-[#101c38] p-4 rounded-2xl border border-white/10 space-y-3">
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Metode Pembayaran Tersedia
                </p>
                {/* QRIS info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">QRIS (Scan QR)</p>
                    <p className="text-[10px] text-slate-400">
                      BCA, BRI, BNI, Mandiri, DANA, OVO, GoPay, ShopeePay & semua m-banking
                    </p>
                  </div>
                </div>
                {/* GoPay info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="w-9 h-9 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">GoPay Transfer</p>
                    <p className="text-[10px] text-slate-400">
                      Transfer ke nomor GoPay: <span className="font-mono font-bold text-amber-300">085967096912</span> a/n Ilham Arwani
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
                  <MessageCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-200 leading-relaxed">
                    Setelah transfer, <strong>wajib konfirmasi via WhatsApp</strong> dengan kirim bukti pembayaran agar pesanan segera diproses.
                  </p>
                </div>
              </div>

              {/* Rincian Harga */}
              <div className="bg-[#101c38] p-3.5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Harga Paket Kuota</span>
                  <span className="font-mono text-white">{formatRupiah(product.price)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Biaya Layanan Admin</span>
                  <span className="font-mono text-emerald-400 font-bold">Gratis (Rp 0)</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-2 border-t border-white/10">
                  <span className="text-white">Total Transfer</span>
                  <span className="font-mono text-emerald-400 text-base">
                    {formatRupiah(product.price)}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}

          {/* ================= STEP 2: PAYMENT & WA CONFIRMATION ================= */}
          {step === "PAYMENT" && currentOrder && (
            <div className="space-y-4">
              {/* WAJIB KONFIRMASI ALERT BANNER */}
              <div className="bg-amber-500/15 border-2 border-amber-500/40 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-200">
                <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-black text-amber-300 uppercase tracking-wide">
                    Wajib Konfirmasi ke WhatsApp
                  </p>
                  <p className="text-[11px] leading-relaxed text-amber-100">
                    Setelah transfer via QRIS atau GoPay, <strong>wajib klik tombol hijau di bawah</strong> untuk mengirim bukti ke WhatsApp admin agar pesanan segera diproses!
                  </p>
                </div>
              </div>

              {/* Total Nominal Transfer Box */}
              <div className="bg-[#101c38] p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                    Nominal Wajib Ditransfer
                  </span>
                  <span className="font-mono text-xl font-black text-emerald-400">
                    {formatRupiah(currentOrder.totalAmount)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentOrder.totalAmount.toString(), "amount")}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  {copiedText === "amount" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedText === "amount" ? "Tersalin" : "Salin Nominal"}</span>
                </button>
              </div>

              {/* OPSI 1: QRIS */}
              <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-slate-300 text-slate-900 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-black tracking-wider uppercase block text-slate-900">
                      ILHAM ARWANI, EDUKASI
                    </span>
                    <span className="text-[10px] font-mono text-slate-600 block">
                      NMID: ID1026484484955 • A01
                    </span>
                  </div>
                  <span className="px-2 py-0.5 bg-red-600 text-white text-[9px] font-black rounded uppercase">
                    QRIS GPN
                  </span>
                </div>

                <div className="w-full max-w-[280px] bg-white rounded-2xl p-1.5 border border-slate-200 shadow-inner flex items-center justify-center">
                  <Image
                    src="/qris.jpg"
                    alt="QRIS Pembayaran ILHAM ARWANI"
                    width={280}
                    height={380}
                    className="rounded-xl object-contain w-full h-auto"
                    priority
                  />
                </div>

                <div className="w-full mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <a
                    href="/qris.jpg"
                    download="QRIS-ILHAM-ARWANI.jpg"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Simpan QRIS ke Galeri</span>
                  </a>
                  <span className="text-[10px] font-bold text-slate-500">
                    Bisa di-scan dari Galeri
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  atau
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* OPSI 2: GOPAY */}
              <div className="bg-[#101c38] p-5 rounded-3xl border border-green-500/30 text-white space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">Transfer Saldo GoPay</h4>
                    <p className="text-[11px] text-slate-400">Atas Nama: Ilham Arwani</p>
                  </div>
                </div>

                <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">
                    Nomor Tujuan GoPay:
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-black text-amber-300 tracking-wider">
                      085967096912
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy("085967096912", "gopay")}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedText === "gopay" ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedText === "gopay" ? "Tersalin" : "Salin Nomor"}</span>
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Pastikan nama penerima di aplikasi GoPay muncul <strong>Ilham Arwani</strong>.
                  </p>
                </div>
              </div>

              {/* Detail Pesanan Ringkas */}
              <div className="bg-[#101c38] p-3.5 rounded-2xl border border-white/10 text-xs space-y-1.5 text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID Pesanan:</span>
                  <span className="font-mono font-bold text-white">{currentOrder.refid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Tujuan:</span>
                  <span className="font-mono font-bold text-white">{currentOrder.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Paket:</span>
                  <span className="font-bold text-white text-right max-w-[65%] truncate">
                    {currentOrder.productName}
                  </span>
                </div>
              </div>

              {/* TOMBOL UTAMA: KONFIRMASI WAJIB KE WHATSAPP */}
              <div className="pt-2">
                <a
                  href={getWaPaymentConfirmationLink({
                    productName: currentOrder.productName,
                    totalAmount: currentOrder.totalAmount,
                    phoneNumber: currentOrder.phoneNumber,
                    refid: currentOrder.refid,
                    paymentMethod: currentOrder.paymentMethod,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.99] text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-green-500/25 transition-all"
                >
                  <svg className="w-5 h-5 fill-white flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.115.548 4.184 1.59 6.002L.004 24l6.104-1.601A11.96 11.96 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM18.16 16.924c-.26.735-1.503 1.4-2.074 1.458-.528.054-1.203.11-3.486-.838-2.738-1.134-4.516-3.923-4.654-4.108-.138-.184-1.11-1.478-1.11-2.822s.7-1.996.953-2.285c.253-.29.548-.363.733-.363.184 0 .368.006.533.013.178.008.416-.073.654.492.247.585.83 2.03.904 2.179.073.15.123.324.03.508-.091.184-.138.301-.276.467-.138.167-.291.353-.414.491-.133.15-.276.315-.12.565.156.248.694 1.133 1.493 1.894 1.033.985 1.9 1.288 2.146 1.402.247.114.39.096.536-.07.146-.167.632-.735.802-.988.17-.253.34-.212.565-.125.225.086 1.428.673 1.674.795.247.123.411.184.473.288.062.103.062.605-.198 1.34z" />
                  </svg>
                  <span>Kirim Bukti Transfer ke WhatsApp (Wajib)</span>
                </a>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  Format pesan & detail pesanan otomatis terisi saat WhatsApp terbuka.
                </p>
              </div>
            </div>
          )}

          {/* ================= STEP 3: SUCCESS ================= */}
          {step === "SUCCESS" && currentOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/40 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">Pesanan Tercatat!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Admin sedang memverifikasi bukti transfer dan kuota akan segera terisi.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#101c38]/90 border-t border-white/10">
          {step === "SUMMARY" && (
            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              <span>Lanjut ke Pembayaran ({formatRupiah(product.price)})</span>
            </button>
          )}

          {step === "PAYMENT" && (
            <button
              type="button"
              onClick={() => setStep("SUMMARY")}
              className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              ← Kembali ke Ringkasan Pesanan
            </button>
          )}

          {step === "SUCCESS" && (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-colors"
            >
              Selesai & Tutup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
