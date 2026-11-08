"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Product, PaymentMethod, TransactionRecord } from "@/types/product";
import {
  formatRupiah,
  detectOperator,
  getOperatorMeta,
  getWaLink,
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
  CreditCard,
  Wallet,
  ArrowRight,
  Loader2,
  ExternalLink,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface CheckoutModalProps {
  product: Product | null;
  initialPhoneNumber: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (order: TransactionRecord) => void;
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  name: string;
  category: "QRIS" | "VA" | "EWALLET";
  icon: React.ElementType;
  desc: string;
}[] = [
  {
    id: "QRIS",
    name: "QRIS Real-Time",
    category: "QRIS",
    icon: QrCode,
    desc: "BCA, GoPay, OVO, DANA, ShopeePay & Semua M-Banking",
  },
  {
    id: "BCA_VA",
    name: "BCA Virtual Account",
    category: "VA",
    icon: CreditCard,
    desc: "Verifikasi instan otomatis 24 Jam",
  },
  {
    id: "BRI_VA",
    name: "BRI Virtual Account (BRIVA)",
    category: "VA",
    icon: CreditCard,
    desc: "Bayar via BRImo atau ATM BRI",
  },
  {
    id: "MANDIRI_VA",
    name: "Mandiri Virtual Account",
    category: "VA",
    icon: CreditCard,
    desc: "Bayar via Livin by Mandiri",
  },
  {
    id: "DANA",
    name: "Saldo DANA",
    category: "EWALLET",
    icon: Wallet,
    desc: "Transfer langsung atau QRIS DANA",
  },
];

export default function CheckoutModal({
  product,
  initialPhoneNumber,
  isOpen,
  onClose,
  onSuccess,
}: CheckoutModalProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialPhoneNumber);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("QRIS");
  const [step, setStep] = useState<"SUMMARY" | "PAYMENT" | "SUCCESS">("SUMMARY");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentOrder, setCurrentOrder] = useState<TransactionRecord | null>(null);
  const [copiedText, setCopiedText] = useState("");
  const [timeLeft, setTimeLeft] = useState(900); // 15 Menit

  // Sinkronisasi nomor awal saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(initialPhoneNumber);
      setStep("SUMMARY");
      setErrorMessage("");
      setCurrentOrder(null);
      setTimeLeft(900);
    }
  }, [isOpen, initialPhoneNumber]);

  // Keyboard shortcut ESC untuk tutup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  // Polling status transaksi saat menunggu pembayaran
  const pollStatus = useCallback(async (refid: string) => {
    try {
      const res = await fetch(`/api/check-status?refid=${encodeURIComponent(refid)}`);
      const data = await res.json();
      if (data.success && data.transaction) {
        const tx: TransactionRecord = data.transaction;
        if (tx.status === "SUCCESS") {
          setCurrentOrder(tx);
          setStep("SUCCESS");
          if (onSuccess) onSuccess(tx);
        } else if (tx.status === "PAID" || tx.status === "PROCESSING") {
          setCurrentOrder(tx);
        }
      }
    } catch (err) {
      console.warn("Polling error:", err);
    }
  }, [onSuccess]);

  useEffect(() => {
    if (step !== "PAYMENT" || !currentOrder) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const pollInterval = setInterval(() => {
      pollStatus(currentOrder.refid);
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(pollInterval);
    };
  }, [step, currentOrder, pollStatus]);

  if (!isOpen || !product) return null;

  const currentOp = detectOperator(phoneNumber) || product.operator;
  const opMeta = getOperatorMeta(currentOp);

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    }
  };

  // Submit Checkout -> Buat Pesanan
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
          paymentMethod: selectedMethod,
        }),
      });

      const data = await res.json();

      if (data.success && data.order) {
        setCurrentOrder(data.order);
        setStep("PAYMENT");
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

  // Simulasi Pembayaran Langsung (Test Gateway / Demo Mode)
  const handleSimulatePayment = async () => {
    if (!currentOrder) return;
    setIsSimulatingPayment(true);

    try {
      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refid: currentOrder.refid,
          status: "PAID",
          amount: currentOrder.totalAmount,
        }),
      });

      const json = await res.json();
      if (json.success) {
        // Ambil status terbaru
        await pollStatus(currentOrder.refid);
        setStep("SUCCESS");
      }
    } catch (err: unknown) {
      console.error("Simulation error:", err);
    } finally {
      setIsSimulatingPayment(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-[#0b1528] border border-white/10 rounded-3xl w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl text-white flex flex-col justify-between"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-[#0b1528]/95 backdrop-blur-md px-5 py-4 border-b border-white/10 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide">
                {step === "SUMMARY"
                  ? "Ringkasan Checkout"
                  : step === "PAYMENT"
                  ? "Menunggu Pembayaran"
                  : "Transaksi Berhasil"}
              </h3>
              <p className="text-[10px] text-slate-400">
                {step === "SUMMARY"
                  ? "Konfirmasi pesanan kuota Anda"
                  : step === "PAYMENT"
                  ? "Selesaikan pembayaran via QRIS/VA"
                  : "Kuota segera terisi ke nomor tujuan"}
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
        <div className="p-5 space-y-4">
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
                <div className="relative">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
                    placeholder="Masukkan nomor HP"
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

              {/* Payment Methods Selector */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Pilih Metode Pembayaran
                </label>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethod(method.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? "bg-blue-600/25 border-blue-500 text-white shadow-md shadow-blue-500/15"
                            : "bg-[#101c38] border-white/5 hover:border-white/20 text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                              isSelected ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold block">{method.name}</span>
                            <span className="text-[10px] text-slate-400 line-clamp-1">
                              {method.desc}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? "border-blue-400 bg-blue-500 text-white"
                              : "border-slate-600 bg-black/20"
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#101c38] p-3.5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Harga Paket Kuota</span>
                  <span className="font-mono text-white">{formatRupiah(product.price)}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Biaya Layanan</span>
                  <span className="font-mono text-emerald-400 font-bold">Gratis (Rp 0)</span>
                </div>
                <div className="flex justify-between text-sm font-black pt-2 border-t border-white/10">
                  <span className="text-white">Total Pembayaran</span>
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

          {/* ================= STEP 2: PAYMENT WAITING ================= */}
          {step === "PAYMENT" && currentOrder && (
            <div className="space-y-4 text-center">
              {/* Countdown Timer */}
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 flex items-center justify-between text-amber-300">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  Selesaikan dalam:
                </span>
                <span className="font-mono text-base font-black tracking-widest">
                  {timeFormatted}
                </span>
              </div>

              {/* QRIS Display */}
              {currentOrder.paymentMethod === "QRIS" && (
                <div className="bg-white p-5 rounded-3xl shadow-xl flex flex-col items-center justify-center border-4 border-slate-200">
                  <div className="flex items-center justify-between w-full mb-3 px-2">
                    <span className="text-xs font-black tracking-widest text-slate-900 uppercase">
                      QRIS NASIONAL
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      GPN / ASPI
                    </span>
                  </div>

                  {/* QR Code Frame */}
                  <div className="w-56 h-56 bg-slate-100 rounded-2xl p-2 border border-slate-300 flex items-center justify-center relative">
                    <Image
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                        currentOrder.qrisPayload || currentOrder.refid
                      )}`}
                      alt="QRIS Code"
                      width={220}
                      height={220}
                      className="rounded-xl object-contain"
                      unoptimized
                    />
                  </div>

                  <p className="text-[11px] font-extrabold text-slate-700 mt-3">
                    Scan dengan GoPay, OVO, DANA, ShopeePay, atau Mobile Banking
                  </p>
                </div>
              )}

              {/* Virtual Account Display */}
              {currentOrder.vaNumber && (
                <div className="bg-[#101c38] p-4 rounded-2xl border border-white/10 text-left space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Nomor Virtual Account ({currentOrder.paymentMethod.replace("_VA", "")})
                  </span>
                  <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/10">
                    <span className="font-mono text-lg font-black text-amber-300 tracking-wider">
                      {currentOrder.vaNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(currentOrder.vaNumber!, "va")}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedText === "va" ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedText === "va" ? "Tersalin" : "Salin"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Total Amount & RefID */}
              <div className="bg-[#101c38] p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-left">
                <div>
                  <span className="text-[10px] text-slate-400 block">ID Referensi</span>
                  <span className="font-mono text-xs text-slate-200 font-bold">
                    {currentOrder.refid}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Transfer</span>
                  <span className="font-mono text-base font-black text-emerald-400">
                    {formatRupiah(currentOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Live Polling Status Indicator */}
              <div className="flex items-center justify-center gap-2 text-xs text-blue-300 py-1">
                <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                <span>Menunggu konfirmasi pembayaran otomatis...</span>
              </div>

              {/* Test Mode Simulation Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSimulatePayment}
                  disabled={isSimulatingPayment}
                  className="w-full py-2.5 px-4 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  {isSimulatingPayment ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>Simulasi Bayar Sekarang (Uji Gateway / Webhook)</span>
                </button>
                <p className="text-[10px] text-slate-500 mt-1">
                  Tombol ini mensimulasikan callback webhook pelunasan dan langsung menginjeksi paket.
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
                <h4 className="text-lg font-black text-white">Pembelian Berhasil!</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Paket data sedang/telah aktif di nomor tujuan.
                </p>
              </div>

              {/* Transaction details card */}
              <div className="bg-[#101c38] p-4 rounded-2xl border border-white/10 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">ID Transaksi:</span>
                  <span className="font-mono font-bold text-white">{currentOrder.refid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Nomor Tujuan:</span>
                  <span className="font-mono font-bold text-white">{currentOrder.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Paket Kuota:</span>
                  <span className="font-bold text-white">{currentOrder.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Harga:</span>
                  <span className="font-mono font-black text-emerald-400">
                    {formatRupiah(currentOrder.totalAmount)}
                  </span>
                </div>
                {currentOrder.sn && (
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-slate-400">Serial Number (SN):</span>
                    <span className="font-mono text-amber-300 font-bold">{currentOrder.sn}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <a
                  href={getWaLink(
                    currentOrder.productName,
                    currentOrder.totalAmount,
                    currentOrder.phoneNumber,
                    currentOrder.refid
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Konfirmasi Bukti ke WhatsApp Admin</span>
                </a>
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
              Ubah Metode Pembayaran
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
