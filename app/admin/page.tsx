"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatRupiah } from "@/utils/helpers";
import { StoredTransaction, WebhookLog } from "@/lib/transactionStore";

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Member & API stats
  const [memberInfo, setMemberInfo] = useState<any>(null);
  const [isLoadingMember, setIsLoadingMember] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"api" | "webhook" | "products" | "transactions">("api");

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Transactions
  const [transactions, setTransactions] = useState<StoredTransaction[]>([]);
  const [isLoadingTx, setIsLoadingTx] = useState(false);

  // Webhook Logs
  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([]);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState(false);
  const [simStatus, setSimStatus] = useState<"00" | "01" | "02">("00");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("admin_logged_in") === "true";
      setIsLoggedIn(auth);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      loadMemberInfo();
      loadProducts();
      loadTransactions();
      loadWebhookLogs();
    }
  }, [isLoggedIn]);

  const loadMemberInfo = async () => {
    setIsLoadingMember(true);
    try {
      const res = await fetch("/api/member-info");
      const json = await res.json();
      if (json.success) {
        setMemberInfo(json);
      }
    } catch (err) {
      console.error("Gagal memuat info member:", err);
    } finally {
      setIsLoadingMember(false);
    }
  };

  const loadProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success && Array.isArray(json.products)) {
        setProducts(json.products);
      }
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const loadTransactions = async () => {
    setIsLoadingTx(true);
    try {
      const res = await fetch("/api/transactions");
      const json = await res.json();
      if (json.success && Array.isArray(json.transactions)) {
        setTransactions(json.transactions);
      }
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setIsLoadingTx(false);
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
      console.error("Gagal memuat webhook logs:", err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (username.trim() === "admin" && password === "admin123") {
      localStorage.setItem("admin_logged_in", "true");
      setIsLoggedIn(true);
      window.dispatchEvent(new Event("admin_login_change"));
    } else {
      setLoginError("Nama pengguna atau kata sandi tidak cocok.");
    }
  };

  const handleLogout = () => {
    if (confirm("Keluar dari Panel Admin?")) {
      localStorage.removeItem("admin_logged_in");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("admin_login_change"));
    }
  };

  const handleSimulateWebhook = async () => {
    setIsSimulatingWebhook(true);
    try {
      const payload = {
        status: simStatus,
        refid: `TEST-${Date.now()}`,
        trxuuid: `sim-uuid-${Math.random().toString(36).slice(2, 9)}`,
        message:
          simStatus === "00"
            ? "Uji coba webhook transaksi sukses"
            : simStatus === "01"
            ? "Uji coba webhook gagal saldo"
            : "Uji coba webhook gagal stok",
        time: new Date().toISOString(),
      };

      const res = await fetch("/api/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        await loadWebhookLogs();
        alert(`Uji coba webhook berhasil dikirim. Respon server: ${json.message}`);
      }
    } catch (err: any) {
      alert(`Gagal mengirim simulasi: ${err?.message}`);
    } finally {
      setIsSimulatingWebhook(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const q = productSearch.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.code && p.code.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
    );
  });

  // Login Gate
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#081225] flex items-center justify-center p-5 text-white">
        <div className="w-full max-w-sm bg-[#0e1a34] rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 mx-auto flex items-center justify-center text-xl font-black mb-2 border border-blue-500/30">
              🔒
            </div>
            <h1 className="text-lg font-black text-white">Masuk Panel Admin</h1>
            <p className="text-xs text-slate-400">Arwani D'Gabriel Store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white text-xs font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className="w-full px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-white text-xs font-medium focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            {loginError && <p className="text-xs text-rose-400 font-semibold">{loginError}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30"
            >
              Masuk
            </button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#081225] text-white p-5 pb-28 space-y-5 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
            Pusat Kontrol Sistem
          </span>
          <h1 className="text-xl font-black text-white">Panel Integrasi & Admin</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola integrasi Ruang Kuota, webhook, produk, dan transaksi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white text-xs font-bold transition-colors"
          >
            Lihat Toko
          </Link>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600 hover:text-white text-xs font-bold transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab("api")}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === "api" ? "bg-blue-600 text-white" : "bg-[#0e1a34] text-slate-300 hover:text-white"
          }`}
        >
          Status API & Saldo
        </button>
        <button
          onClick={() => setActiveTab("webhook")}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === "webhook" ? "bg-blue-600 text-white" : "bg-[#0e1a34] text-slate-300 hover:text-white"
          }`}
        >
          Webhook Notifikasi ({webhookLogs.length})
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === "products" ? "bg-blue-600 text-white" : "bg-[#0e1a34] text-slate-300 hover:text-white"
          }`}
        >
          Daftar Produk Mirrored ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`px-4 py-2 rounded-xl font-bold transition-colors ${
            activeTab === "transactions" ? "bg-blue-600 text-white" : "bg-[#0e1a34] text-slate-300 hover:text-white"
          }`}
        >
          Log Transaksi ({transactions.length})
        </button>
      </div>

      {/* TAB 1: API & Saldo */}
      {activeTab === "api" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#0e1a34] p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Saldo Member</span>
              <p className="text-xl font-black text-emerald-400">
                {isLoadingMember ? "Memuat..." : formatRupiah(memberInfo?.saldo ?? 462)}
              </p>
              <span className="text-[10px] text-slate-400">Penyedia: Ruang Kuota</span>
            </div>
            <div className="bg-[#0e1a34] p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">User ID Member</span>
              <p className="text-xl font-mono font-bold text-white">
                {isLoadingMember ? "Memuat..." : memberInfo?.userId || "4293"}
              </p>
              <span className="text-[10px] text-slate-400">Akun terverifikasi aktif</span>
            </div>
            <div className="bg-[#0e1a34] p-4 rounded-2xl border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Produk Live</span>
              <p className="text-xl font-bold text-blue-400">
                {isLoadingProducts ? "Memuat..." : `${products.length} Produk`}
              </p>
              <span className="text-[10px] text-slate-400">Tersinkronisasi otomatis</span>
            </div>
          </div>

          <div className="bg-[#0e1a34] p-5 rounded-2xl border border-white/10 space-y-3">
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Kunci API Integrasi</h2>
            <div className="p-3 bg-black/40 rounded-xl border border-white/10 font-mono text-xs text-slate-300 break-all">
              6a18c64bd19cdb594459bce29fc3fc0410a1a69b0948a77cb5e4feaf82f0b3e7164a58c4cdf17b823c8f38acb1e7b460650476cea2c65378355049e82dfa0741f3fb5dcb68c0010140f02b
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Kunci API ini digunakan secara aman oleh sistem backend Arwani Store untuk memuat stok dan memproses pembelian langsung ke endpoint Ruang Kuota.
            </p>
            <button
              onClick={loadMemberInfo}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Perbarui Data Saldo
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: Webhook Notifikasi */}
      {activeTab === "webhook" && (
        <div className="space-y-4">
          <div className="bg-[#0e1a34] p-5 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Konfigurasi Webhook URL</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Siap Menerima Notifikasi
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block mb-1">URL Webhook Utama (Sesuai Dashboard Penyedia):</span>
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 font-mono font-bold text-blue-300">
                  https://arwani-store.vercel.app/
                </div>
              </div>
              <div>
                <span className="text-slate-400 block mb-1">URL Endpoint Alternatif:</span>
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/10 font-mono text-slate-300">
                  https://arwani-store.vercel.app/api/webhook
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs leading-relaxed">
              Setiap kali transaksi diselesaikan oleh server pusat, server akan mengirimkan permintaan POST ke URL di atas. Sistem Arwani Store secara otomatis mencatat dan memperbarui status pesanan terkait.
            </div>

            {/* Test Simulation Controls */}
            <div className="border-t border-white/10 pt-3 flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-300 font-bold">Uji Coba Pengiriman:</span>
              <select
                value={simStatus}
                onChange={(e) => setSimStatus(e.target.value as any)}
                className="px-3 py-1.5 bg-white/10 border border-white/15 rounded-lg text-xs font-bold text-white outline-none cursor-pointer"
              >
                <option value="00" className="bg-[#081225]">Status: 00 (Sukses)</option>
                <option value="01" className="bg-[#081225]">Status: 01 (Gagal Saldo)</option>
                <option value="02" className="bg-[#081225]">Status: 02 (Gagal Stok)</option>
              </select>

              <button
                onClick={handleSimulateWebhook}
                disabled={isSimulatingWebhook}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {isSimulatingWebhook ? "Mengirim..." : "Kirim Uji Coba Webhook"}
              </button>
            </div>
          </div>

          {/* Webhook Log History */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Riwayat Permintaan Webhook Diterima ({webhookLogs.length})
              </h3>
              <button onClick={loadWebhookLogs} className="text-xs text-blue-400 hover:text-blue-300">
                Segarkan
              </button>
            </div>

            {webhookLogs.length === 0 ? (
              <div className="bg-[#0e1a34] p-6 rounded-2xl border border-white/10 text-center text-xs text-slate-400">
                Belum ada permintaan webhook yang tercatat dalam sesi ini.
              </div>
            ) : (
              <div className="space-y-2">
                {webhookLogs.map((log) => (
                  <div key={log.id} className="bg-[#0e1a34] p-3.5 rounded-xl border border-white/10 text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-300 font-bold">{log.id}</span>
                      <span className="text-[10px] text-slate-400">{new Date(log.receivedAt).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="text-slate-300 text-[11px] bg-black/30 p-2 rounded-lg">
                      <pre className="whitespace-pre-wrap">{JSON.stringify(log.body, null, 2)}</pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Mirrored Products */}
      {activeTab === "products" && (
        <div className="space-y-3">
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Cari kode atau nama produk di katalog mirrored..."
            className="w-full px-4 py-2.5 bg-[#0e1a34] border border-white/15 rounded-xl text-white text-xs font-medium focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#0e1a34]">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-white/5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="p-3">Kode</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Nama Produk</th>
                  <th className="p-3">Stok</th>
                  <th className="p-3 text-right">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {filteredProducts.slice(0, 50).map((p, idx) => (
                  <tr key={`${p.id}-${idx}`} className="hover:bg-white/5">
                    <td className="p-3 font-bold text-blue-300">{p.code || p.name}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{p.category}</td>
                    <td className="p-3 font-sans font-medium text-white">{p.name}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.stock === 999 || p.stock === 9999
                            ? "bg-emerald-500/20 text-emerald-300"
                            : p.stock > 0
                            ? "bg-blue-500/20 text-blue-300"
                            : "bg-rose-500/20 text-rose-300"
                        }`}
                      >
                        {p.stock === 999 || p.stock === 9999 ? "Tersedia" : p.stock}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400">{formatRupiah(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length > 50 && (
            <p className="text-center text-xs text-slate-400">
              Menampilkan 50 dari {filteredProducts.length} produk. Gunakan pencarian untuk menemukan item spesifik.
            </p>
          )}
        </div>
      )}

      {/* TAB 4: Transactions Log */}
      {activeTab === "transactions" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Log Transaksi ({transactions.length})
            </h3>
            <button onClick={loadTransactions} className="text-xs text-blue-400 hover:text-blue-300">
              Segarkan
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="bg-[#0e1a34] p-6 rounded-2xl border border-white/10 text-center text-xs text-slate-400">
              Belum ada transaksi yang tercatat dalam log server.
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <div key={tx.refid} className="bg-[#0e1a34] p-4 rounded-xl border border-white/10 text-xs space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono font-bold text-blue-300 block">{tx.refid}</span>
                      <p className="font-bold text-white mt-0.5">{tx.productName || tx.productcode}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === "00"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {tx.statusLabel || (tx.status === "00" ? "Sukses" : "Gagal")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px] pt-1">
                    <span>Tujuan: {tx.phonenumber}</span>
                    <span className="font-bold text-white">{formatRupiah(tx.price)}</span>
                  </div>
                  {tx.message && <p className="text-[11px] text-slate-400 pt-1">{tx.message}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
