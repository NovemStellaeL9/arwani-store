"use client";

import React from "react";
import Image from "next/image";
import { Phone, CheckCircle2, X, Smartphone, AlertCircle } from "lucide-react";
import { detectOperator, getOperatorMeta } from "@/utils/helpers";
import { OperatorName } from "@/types/product";

interface PhoneOperatorInputProps {
  phoneNumber: string;
  onPhoneChange: (num: string) => void;
  detectedOperator: OperatorName | "";
  onClear: () => void;
  onOperatorSelectManual?: (op: OperatorName) => void;
}

// Hanya operator yang benar-benar TERSEDIA di server pusat
const AVAILABLE_OPERATORS: OperatorName[] = [
  "XL",
  "Indosat",
  "Tri",
  "Axis",
  "Telkomsel",
];

export default function PhoneOperatorInput({
  phoneNumber,
  onPhoneChange,
  detectedOperator,
  onClear,
  onOperatorSelectManual,
}: PhoneOperatorInputProps) {
  const rawOp = detectOperator(phoneNumber);
  const isSmartfren = rawOp === "Smartfren";
  const currentOp = detectedOperator || (rawOp !== "Smartfren" ? (rawOp as OperatorName) : "") || "";
  const meta = currentOp ? getOperatorMeta(currentOp) : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    onPhoneChange(val);
  };

  return (
    <div className="bg-[#0e1a34] border border-white/10 rounded-3xl p-4 shadow-xl transition-all">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor="phone-input"
          className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
        >
          <Smartphone className="w-3.5 h-3.5 text-blue-400" />
          Nomor Telepon Pelanggan
        </label>
        {currentOp && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            {currentOp}
          </span>
        )}
      </div>

      {/* Main Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
          <Phone className="w-4 h-4" />
        </div>

        <input
          id="phone-input"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phoneNumber}
          onChange={handleChange}
          placeholder="Contoh: 081812345678"
          className="w-full pl-10 pr-24 py-3.5 bg-black/30 border border-white/10 focus:border-blue-500 rounded-2xl text-white placeholder-slate-500 font-mono text-sm tracking-wide outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        />

        {/* Right side: Detected Operator Logo / Clear Button */}
        <div className="absolute right-3 flex items-center gap-1.5">
          {phoneNumber && (
            <button
              type="button"
              onClick={onClear}
              aria-label="Hapus nomor"
              className="p-1 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {meta ? (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border ${meta.badgeBg} ${meta.borderColor}`}
            >
              <div className="w-5 h-5 relative flex-shrink-0">
                <Image
                  src={meta.logo}
                  alt={meta.name}
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider ${meta.badgeText}`}>
                {currentOp}
              </span>
            </div>
          ) : isSmartfren ? (
            <span className="text-[10px] font-bold text-rose-400 uppercase px-2 py-1 bg-rose-500/10 rounded-lg border border-rose-500/20">
              Smartfren
            </span>
          ) : (
            <span className="text-[10px] font-bold text-slate-500 uppercase px-2 py-1 bg-white/5 rounded-lg">
              Prefix 4 Digit
            </span>
          )}
        </div>
      </div>

      {/* Helper text / Status */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        {isSmartfren ? (
          <span className="text-amber-400 flex items-center gap-1 text-[11px] font-medium">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            Layanan Smartfren sedang tidak tersedia dari server pusat.
          </span>
        ) : (
          <span>
            {currentOp
              ? `Paket ${currentOp} langsung difilter otomatis.`
              : "Ketik 4 digit nomor untuk filter otomatis operator."}
          </span>
        )}
        {phoneNumber.length > 0 && (
          <span className="font-mono text-[10px] text-slate-400">
            {phoneNumber.length} digit
          </span>
        )}
      </div>

      {/* Operator Selector Pills (Hanya yang Ada di Server Pusat) */}
      <div className="mt-3 pt-3 border-t border-white/5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Pilih Operator Tersedia di Server:
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {AVAILABLE_OPERATORS.map((op) => {
            const isSelected = currentOp === op;
            const opMeta = getOperatorMeta(op);
            return (
              <button
                key={op}
                type="button"
                onClick={() => onOperatorSelectManual?.(op)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center ${
                  isSelected
                    ? "bg-blue-600/30 border-blue-500 text-white shadow-md shadow-blue-600/20"
                    : "bg-white/[0.03] border-white/5 hover:border-white/20 text-slate-300"
                }`}
              >
                <div className="w-5 h-5 relative mb-1 flex items-center justify-center">
                  <Image
                    src={opMeta.logo}
                    alt={op}
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </div>
                <span className="text-[10px] font-bold leading-none truncate w-full">
                  {op}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
