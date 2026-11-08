"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatRupiah, calculateSellingPrice, getMarkupAmount } from "@/utils/helpers";
import { TransactionRecord } from "@/types/product";
import { WebhookLog } from "@/lib/transactionStore";
import {
  ArrowLeft,
  Key,
  TrendingUp,
  CreditCard,
  Send,
  RefreshCw,
  CheckCircle2,
  Copy,
  Check,
  Lock,
  Calculator,
} from "lucide-react";

interface MemberInfo {
  apiKeyMasked: string;
  userId: string;
  username: string;
  saldo: number;
  totalProducts: number;
  webhookUrl: string;
  webhookEndpoint: string;
  totalTransactions: number;
  totalWebhooksReceived: number;
  serverTime: string;
}


export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Member & API stats
  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);

  // Active Tab: "markup" | "api" | "webhook" | "transactions"
  const [activeTab, setActiveTab] = useState<"markup" | "api" | "webhook" | "transactions">("markup");

  // Markup Simulation State
  const [simCost, setSimCost] = useState("50000");

  // Transactions & Webhook Logs
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [simStatus, setSimStatus] = useState<"00" | "01" | "02">("00");
  const [copiedText, setCopiedText] = useState("");

  // Provider configuration state
  const [providerType, setProviderType] = useState("Ruang Kuota");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [configSaved, setConfigSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("admin_logged_in") === "true";
      setIsLoggedIn(auth);
      const savedKey = localStorage.getItem("custom_provider_key");
      if (savedKey) setApiKeyInput(savedKey);
    }
  }, []);

  const loadMemberInfo = async () => {
    try {
      const res = await fetch("/api/member-info");
      const json = await res.json();
      if (json.success) {
        setMemberInfo(json);
      }
    } catch (err) {
      console.error("Gagal memuat info member:", err);
    }
  };

  const loadTransactions = async () => {
    try {
      const res = await fetch("/api/transactions");
      const json = await res.json();
      if (json.success && Array.isArray(json.transactions)) {
        setTransactions(json.transactions);
      }
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    }
  };

  const loadWebhookLogs = async () => {
    try {
      const res = await fetch("/api/webhook");
      const json = await res.json();
      if (json.success && Array.isArray(json.recentLogs)) {
        setWebhookLogs(json.recentLogs);
      }
    } catch (err) {
      console.error("Gagal memuat log webhook:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadMemberInfo();
      loadTransactions();
      loadWebhookLogs();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && (password === "admin123" || password === "admin")) {
      setIsLoggedIn(true);
      localStorage.setItem("admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("Kredensial salah. Gunakan username: admin dan password: admin");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("admin_logged_in");
  };

  const handleCopy = (text: string, label: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(""), 2000);
    }
  };

  const handleSaveConfig = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("custom_provider_key", apiKeyInput);
      localStorage.setItem("custom_provider_type", providerType);
      setConfigSaved(true);
      setTimeout(() => setConfigSaved(false), 2500);
    }
  };

  const handleSimulateWebhook = async () => {
    setIsSimulatingWebhook(true);
    try {
      const testRefid = transactions.length > 0 ? transactions[0].refid : `TEST-${Date.now().toString().slice(-6)}`;
      const payload = {
        refid: testRefid,
        order_id: testRefid,
        status: simStatus === "00" ? "PAID" : "FAILED",
        amount: 50000,
        simulatedAt: new Date().toISOString(),
      };

      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      await loadWebhookLogs();
      await loadTransactions();
      alert(`Uji coba webhook selesai. Respon server: ${json.message}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirim webhook.";
      alert(`Gagal: ${msg}`);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  // Login Gate
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#081225] flex items-center justify-center p-5 text-white">
        <div className="w-full max-w-sm bg-[#0e1a34] rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center mb-2 border border-blue-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-black text-white">Panel Konfigurasi Admin</h1>
            <p className="text-xs text-slate-400">Arwani D&apos;Gabriel Store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-medium focus:ring-2 focus:ring-blue-400 outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-xs font-medium focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs text-red-400 font-bold bg-red-500/10 p-2.5 rounded-lg border border-red-500/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 active:scale-95"
            >
              Masuk Dashboard
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white">
              &larr; Kembali ke Beranda Toko
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const costNum = Number(simCost) || 0;
  const sellingNum = calculateSellingPrice(costNum);
  const profitNum = getMarkupAmount(costNum);

  return (
    <div className="min-h-screen bg-[#081225] pb-24 text-white">
      {/* Top Navbar */}
      <div className="bg-[#0e1a34] px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-black tracking-wide">Panel Kontrol Admin</h1>
            <p className="text-[10px] text-slate-400">Pengaturan Margin &amp; Integrasi Provider</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-bold transition-colors"
        >
          Keluar
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Navigation Tabs */}
        <div className="flex gap-1.5 bg-[#0e1a34] p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          <button
            onClick={() => setActiveTab("markup")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === "markup"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Margin &amp; Markup</span>
          </button>

          <button
            onClick={() => setActiveTab("api")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === "api"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Provider</span>
          </button>

          <button
            onClick={() => setActiveTab("webhook")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === "webhook"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Webhook Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
              activeTab === "transactions"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Transaksi ({transactions.length})</span>
          </button>
        </div>

        {/* TAB 1: MARKUP & PRICING RULES */}
        {activeTab === "markup" && (
          <div className="space-y-4">
            <div className="bg-[#0e1a34] p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Aturan Logika Markup Harga</h3>
                  <p className="text-[11px] text-slate-400">
                    Fungsi pembantu calculateSellingPrice(costPrice) otomatis diterapkan ke seluruh produk
                  </p>
                </div>
              </div>

              {/* Formula Rules Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                    Tier 1: Modal &gt; Rp 85.000
                  </span>
                  <p className="text-sm font-black text-white">Markup Tetap: +Rp 10.000</p>
                  <p className="text-[11px] text-slate-400">
                    Formula: Harga Jual = costPrice + 10.000. Contoh: Modal Rp 90.000 &rarr; Jual Rp 100.000.
                  </p>
                </div>

                <div className="bg-black/30 p-4 rounded-2xl border border-white/10 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Tier 2: Modal &le; Rp 85.000
                  </span>
                  <p className="text-sm font-black text-white">Markup Dinamis: +Rp 5.000</p>
                  <p className="text-[11px] text-slate-400">
                    Formula: Harga Jual = costPrice + 5.000 (dibulatkan ke kelipatan Rp 500 terdekat).
                  </p>
                </div>
              </div>

              {/* Interactive Simulator */}
              <div className="bg-[#122244] p-4 rounded-2xl border border-blue-500/30 space-y-3">
                <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Kalkulator Simulasi Keuntungan
                </h4>
                <div>
                  <label className="text-[10px] text-slate-300 block mb-1">
                    Masukkan Contoh Harga Modal/Kulakan (costPrice):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={simCost}
                      onChange={(e) => setSimCost(e.target.value)}
                      placeholder="50000"
                      className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/15 rounded-xl font-mono text-sm text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-white/10">
                  <div className="bg-black/30 p-2.5 rounded-xl">
                    <span className="text-[9px] text-slate-400 uppercase block">Harga Modal</span>
                    <span className="font-mono text-xs font-bold text-slate-200">
                      {formatRupiah(costNum)}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-xl">
                    <span className="text-[9px] text-emerald-400 uppercase block">Margin Untung</span>
                    <span className="font-mono text-xs font-black text-emerald-400">
                      +{formatRupiah(profitNum)}
                    </span>
                  </div>
                  <div className="bg-blue-600/20 border border-blue-500/40 p-2.5 rounded-xl">
                    <span className="text-[9px] text-blue-300 uppercase block">Harga Jual Akhir</span>
                    <span className="font-mono text-xs font-black text-white">
                      {formatRupiah(sellingNum)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: API PROVIDER CONFIG */}
        {activeTab === "api" && (
          <div className="space-y-4">
            <div className="bg-[#0e1a34] p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Konfigurasi API Provider Kuota</h3>
                  <p className="text-[11px] text-slate-400">
                    Hubungkan ke Ruang Kuota, Digiflazz, atau Atlantic Pedia
                  </p>
                </div>
              </div>

              {/* Provider Selection */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Pilihan Supplier / Provider
                </label>
                <select
                  value={providerType}
                  onChange={(e) => setProviderType(e.target.value)}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white outline-none focus:border-blue-500"
                >
                  <option value="Ruang Kuota">Ruang Kuota (service.ruang-kuota.my.id)</option>
                  <option value="Digiflazz">Digiflazz API (Production Ready)</option>
                  <option value="Atlantic Pedia">Atlantic Pedia H2H</option>
                </select>
              </div>

              {/* API Key */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  API Key / Secret Token Provider
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Masukkan API Key supplier Anda..."
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono text-white outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveConfig}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/30"
                >
                  Simpan Konfigurasi
                </button>
                {configSaved && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Tersimpan!
                  </span>
                )}
              </div>

              {/* Status Saldo Server */}
              {memberInfo && (
                <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Status Server Aktif
                  </span>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Akun Member:</span>
                    <span className="font-bold text-white">{memberInfo.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sisa Saldo Deposit:</span>
                    <span className="font-mono font-black text-emerald-400">
                      {formatRupiah(memberInfo.saldo)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kunci API Terpasang:</span>
                    <span className="font-mono text-slate-300">{memberInfo.apiKeyMasked}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WEBHOOK & GATEWAY */}
        {activeTab === "webhook" && (
          <div className="space-y-4">
            <div className="bg-[#0e1a34] p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">URL Endpoint Webhook Pembayaran</h3>
                  <p className="text-[11px] text-slate-400">
                    Masukkan URL ini ke dashboard Midtrans, Tripay, atau Provider Anda
                  </p>
                </div>
              </div>

              {/* Webhook Endpoint Box */}
              <div className="bg-black/40 p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                <span className="font-mono text-xs text-blue-300 break-all">
                  {typeof window !== "undefined"
                    ? `${window.location.origin}/api/webhook`
                    : "https://your-domain.vercel.app/api/webhook"}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      typeof window !== "undefined"
                        ? `${window.location.origin}/api/webhook`
                        : "https://your-domain.vercel.app/api/webhook",
                      "webhook"
                    )
                  }
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 flex-shrink-0 ml-2"
                >
                  {copiedText === "webhook" ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedText === "webhook" ? "Tersalin" : "Salin"}</span>
                </button>
              </div>

              {/* Simulation Webhook Trigger */}
              <div className="bg-[#122244] p-4 rounded-2xl border border-purple-500/30 space-y-3">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  Simulator Callback Pembayaran (Test Mode)
                </h4>
                <div className="flex items-center gap-2">
                  <select
                    value={simStatus}
                    onChange={(e) => setSimStatus(e.target.value as "00" | "01" | "02")}
                    className="p-2 bg-black/40 border border-white/15 rounded-xl text-xs text-white outline-none"
                  >
                    <option value="00">Status 00 (Lunas &amp; Auto Injeksi)</option>
                    <option value="01">Status 01 (Pembayaran Ditolak/Gagal)</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleSimulateWebhook}
                    disabled={isSimulatingWebhook}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    {isSimulatingWebhook ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Kirim Test Webhook</span>
                  </button>
                </div>
              </div>

              {/* Webhook History */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Log Permintaan Webhook Masuk ({webhookLogs.length})
                </h4>
                {webhookLogs.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Belum ada webhook yang diterima.</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {webhookLogs.slice(0, 10).map((log) => (
                      <div
                        key={log.id}
                        className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-[11px] font-mono space-y-1"
                      >
                        <div className="flex justify-between text-slate-400">
                          <span>{log.id}</span>
                          <span>{new Date(log.receivedAt).toLocaleTimeString("id-ID")}</span>
                        </div>
                        <div className="text-emerald-400 break-all">
                          {typeof log.body === "string" ? log.body : JSON.stringify(log.body)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTIONS LIST */}
        {activeTab === "transactions" && (
          <div className="bg-[#0e1a34] p-5 rounded-3xl border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black">Daftar Transaksi Real-Time</h3>
              <button
                type="button"
                onClick={loadTransactions}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Segarkan</span>
              </button>
            </div>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                Belum ada transaksi yang dilakukan pelanggan.
              </p>
            ) : (
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {transactions.map((tx) => (
                  <div
                    key={tx.refid}
                    className="bg-black/30 p-3.5 rounded-2xl border border-white/5 text-xs space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-white">{tx.refid}</span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          tx.status === "SUCCESS"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : tx.status === "PENDING"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {tx.statusLabel || tx.status}
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>{tx.phoneNumber} ({tx.operator})</span>
                      <span className="font-mono font-bold text-white">
                        {formatRupiah(tx.totalAmount)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 font-medium">{tx.productName}</p>

                    {tx.sn && (
                      <p className="text-[10px] font-mono text-amber-300">SN: {tx.sn}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
