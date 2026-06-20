"use client";
 
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { getDbProvider } from "@/utils/db";
import { formatRupiah } from "@/utils/helpers";
 
const categories = ["Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren", "MasaAktif"] as const;
 
export default function AdminDashboard() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Catalog State
  const [products, setProducts] = useState<Product[]>([]);
  const [dbProviderName, setDbProviderName] = useState("LocalStorage Fallback");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
 
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCategory, setFormCategory] = useState<string>("Telkomsel");
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formError, setFormError] = useState("");
 
  const db = useMemo(() => getDbProvider(), []);
 
  // Check Login State on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("admin_logged_in") === "true";
      setIsLoggedIn(auth);
    }
  }, []);

  // Load products and provider information if logged in
  useEffect(() => {
    if (!isLoggedIn) return;

    // Detect provider
    const providerEnv = process.env.NEXT_PUBLIC_DATABASE_PROVIDER;
    if (providerEnv === "supabase") {
      setDbProviderName("Supabase Engine");
    } else if (providerEnv === "firebase") {
      setDbProviderName("Firebase Firestore");
    } else {
      setDbProviderName("LocalStorage Offline");
    }
 
    loadProducts();
  }, [db, isLoggedIn]);
 
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const list = await db.getProducts();
      setProducts(list);
    } catch (err) {
      console.error("Admin: failed to fetch products:", err);
    } finally {
      setIsLoading(false);
    }
  };
 
  // Handle Admin Login Action
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (loginUsername.trim() === "admin" && loginPassword === "admin123") {
      localStorage.setItem("admin_logged_in", "true");
      setIsLoggedIn(true);
      // Dispatch event to update the footer navigation bar instantly
      window.dispatchEvent(new Event("admin_login_change"));
    } else {
      setLoginError("Username atau password salah.");
    }
  };

  // Handle Admin Logout Action
  const handleLogout = () => {
    if (!confirm("Apakah Anda yakin ingin logout dari Panel Admin?")) return;
    localStorage.removeItem("admin_logged_in");
    setIsLoggedIn(false);
    // Dispatch event to update the footer navigation bar instantly
    window.dispatchEvent(new Event("admin_login_change"));
  };

  const handleOpenAddForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormCategory("Telkomsel");
    setFormName("");
    setFormDesc("");
    setFormPrice("");
    setFormError("");
  };
 
  const handleOpenEditForm = (p: Product) => {
    setIsEditing(true);
    setEditingId(p.id);
    setFormCategory(p.category);
    setFormName(p.name);
    setFormDesc(p.desc);
    setFormPrice(String(p.price));
    setFormError("");
  };
 
  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return;
    try {
      await db.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Gagal menghapus produk: " + err);
    }
  };
 
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
 
    if (!formName.trim() || !formDesc.trim() || !formPrice.trim()) {
      setFormError("Semua field wajib diisi.");
      return;
    }
 
    const parsedPrice = parseInt(formPrice.replace(/[^0-9]/g, ""), 10);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Harga harus berupa angka yang valid.");
      return;
    }
 
    try {
      if (isEditing && editingId !== null) {
        // Edit existing product
        const updatedFields = {
          category: formCategory,
          name: formName,
          desc: formDesc,
          price: parsedPrice,
        };
        await db.updateProduct(editingId, updatedFields);
        
        setProducts((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...updatedFields } : p))
        );
        alert("Produk berhasil diubah.");
      } else {
        // Create new product
        // Auto-generate ID: Find max ID in active database + 1
        const maxId = products.reduce((max, p) => (p.id > max ? p.id : max), 0);
        const newId = maxId + 1;
 
        const newProd: Product = {
          id: newId,
          category: formCategory,
          name: formName,
          desc: formDesc,
          price: parsedPrice,
        };
 
        await db.saveProduct(newProd);
        setProducts((prev) => [...prev, newProd]);
        alert(`Produk berhasil ditambahkan dengan ID: ${newId}`);
      }
 
      // Reset form fields
      handleOpenAddForm();
    } catch (err) {
      setFormError("Gagal menyimpan produk: " + err);
    }
  };
 
  // Search filtered products
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);
 
  // ── RENDER SECURITY LOGIN PANEL IF NOT AUTHENTICATED ──
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-app-bg justify-center items-center px-6 transition-colors duration-500 pb-20">
        
        {/* Logo and Greeting */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg mx-auto mb-3.5">
            🔑
          </div>
          <h2 className="text-lg font-black text-app-text uppercase tracking-wider leading-none">
            Login Admin
          </h2>
          <p className="text-[10px] text-app-text-secondary uppercase tracking-widest mt-1.5 font-bold">
            Masukkan kredensial untuk mengelola produk
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-app-card rounded-3xl p-6 border border-app-border shadow-xl w-full max-w-sm transition-colors duration-500">
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <p className="text-[10.5px] font-black text-app-danger bg-app-danger-light p-3 rounded-xl border border-app-danger/25">
                ⚠️ {loginError}
              </p>
            )}

            {/* Username Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-app-text-secondary uppercase tracking-wider block">
                Username
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full p-3 rounded-xl bg-app-bg border border-app-border text-xs font-bold text-app-text outline-none focus:border-app-primary transition-colors"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-black text-app-text-secondary uppercase tracking-wider block">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full p-3 rounded-xl bg-app-bg border border-app-border text-xs font-bold text-app-text outline-none focus:border-app-primary transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-2.5 bg-app-primary hover:bg-app-primary-hover text-app-header-text font-black text-[10px] uppercase tracking-widest rounded-xl transition duration-300 shadow-md active:scale-95 cursor-pointer"
            >
              Masuk Sekarang
            </button>
          </form>
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="mt-6 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-app-text-secondary hover:text-app-text transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke Dashboard Toko
        </Link>

      </div>
    );
  }
 
  // ── RENDER DASHBOARD PANEL IF AUTHENTICATED ──
  return (
    <div className="flex flex-col min-h-screen bg-app-bg pb-10 transition-colors duration-500">
      
      {/* Header Bar */}
      <div className="bg-app-header-bg text-app-header-text px-5 py-4 flex items-center justify-between border-b border-app-border/10 relative z-20">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-app-header-text/80 hover:text-app-header-text transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
            Admin Panel
          </span>
          <button
            onClick={handleLogout}
            className="px-2.5 py-1 bg-app-danger hover:bg-app-danger/90 text-app-header-text rounded-lg text-[9px] font-black uppercase tracking-wider active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </div>
 
      <div className="px-5 mt-6 space-y-6">
        
        {/* Connection Status Panel */}
        <div className="bg-app-card rounded-3xl p-5 border border-app-border shadow-sm flex items-center justify-between transition-colors duration-500">
          <div>
            <h3 className="text-xs font-black text-app-text uppercase tracking-wider">
              Status Database
            </h3>
            <p className="text-[10px] text-app-text-secondary mt-0.5 font-bold uppercase tracking-wider">
              Aktif: {dbProviderName}
            </p>
          </div>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>
 
        {/* Add/Edit Product Form Panel */}
        <div className="bg-app-card rounded-3xl p-5 border border-app-border shadow-sm transition-colors duration-500">
          <h3 className="text-xs font-black text-app-text uppercase tracking-wider mb-4">
            {isEditing ? `Edit Produk (ID: ${editingId})` : "Tambah Produk Baru"}
          </h3>
 
          <form onSubmit={handleSaveProduct} className="space-y-3.5">
            {formError && (
              <p className="text-[10px] font-bold text-app-danger bg-app-danger-light p-2.5 rounded-xl border border-app-danger/25">
                ⚠️ {formError}
              </p>
            )}
 
            <div className="grid grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="text-[9px] font-black text-app-text-secondary uppercase tracking-wider block mb-1">
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-2.5 border border-app-border bg-app-bg text-xs font-bold text-app-text rounded-xl outline-none"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c === "MasaAktif" ? "Masa Aktif" : c}
                    </option>
                  ))}
                </select>
              </div>
 
              {/* Price */}
              <div>
                <label className="text-[9px] font-black text-app-text-secondary uppercase tracking-wider block mb-1">
                  Harga (Rupiah)
                </label>
                <input
                  type="text"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Contoh: 55000"
                  className="w-full p-2.5 border border-app-border bg-app-bg text-xs font-bold text-app-text rounded-xl outline-none"
                />
              </div>
            </div>
 
            {/* Name */}
            <div>
              <label className="text-[9px] font-black text-app-text-secondary uppercase tracking-wider block mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Circel Reguler 10-14 GB"
                className="w-full p-2.5 border border-app-border bg-app-bg text-xs font-bold text-app-text rounded-xl outline-none"
              />
            </div>
 
            {/* Description */}
            <div>
              <label className="text-[9px] font-black text-app-text-secondary uppercase tracking-wider block mb-1">
                Deskripsi / Masa Aktif
              </label>
              <input
                type="text"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Contoh: Masa Aktif 28 Hari (Full Utama)"
                className="w-full p-2.5 border border-app-border bg-app-bg text-xs font-bold text-app-text rounded-xl outline-none"
              />
            </div>
 
            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-app-primary hover:bg-app-primary-hover text-app-header-text font-black text-[10px] uppercase tracking-widest rounded-xl transition duration-300 shadow-sm active:scale-95"
              >
                {isEditing ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="px-4 py-2.5 bg-app-bg hover:bg-app-bg/80 border border-app-border text-app-text font-black text-[10px] uppercase tracking-widest rounded-xl transition duration-300 active:scale-95"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>
 
        {/* Existing Products List Panel */}
        <div className="space-y-3.5">
          <p className="text-[11px] font-bold text-app-text-secondary uppercase tracking-widest">
            Daftar Paket Aktif ({filteredProducts.length})
          </p>
 
          {/* Quick Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-app-text-secondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, operator, atau deskripsi..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-app-card border border-app-border text-xs font-semibold text-app-text placeholder-app-text-secondary/50 outline-none focus:border-app-primary transition shadow-sm"
            />
          </div>
 
          <div className="space-y-2 max-h-[30rem] overflow-y-auto pr-1 pb-4 scrollbar-hide">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-app-text-secondary font-bold animate-pulse">
                Memuat database produk...
              </div>
            ) : filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-app-card p-3 rounded-2xl border border-app-border shadow-sm flex items-center justify-between gap-3 transition-colors duration-500"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[7.5px] font-black px-1.5 py-0.5 rounded bg-app-bg text-app-text-secondary uppercase border border-app-border tracking-wider">
                      ID: {p.id}
                    </span>
                    <span className="text-[7.5px] font-black px-1.5 py-0.5 rounded bg-app-primary-light text-app-primary-dark uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-app-text truncate">
                    {p.name}
                  </h4>
                  <p className="text-[9px] font-medium text-app-text-secondary">
                    {p.desc} — <span className="font-extrabold text-app-primary">{formatRupiah(p.price)}</span>
                  </p>
                </div>
 
                {/* Edit & Delete Action Panel */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditForm(p)}
                    className="p-2 bg-app-bg hover:bg-app-primary-light border border-app-border text-app-text-secondary hover:text-app-primary rounded-xl transition duration-300 active:scale-90"
                    aria-label="Edit product"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 bg-app-bg hover:bg-app-danger-light border border-app-border text-app-text-secondary hover:text-app-danger rounded-xl transition duration-300 active:scale-90"
                    aria-label="Delete product"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
 
            {filteredProducts.length === 0 && !isLoading && (
              <div className="text-center py-6 text-xs text-app-text-secondary font-bold bg-app-card border border-app-border rounded-2xl">
                Tidak ada produk yang cocok.
              </div>
            )}
          </div>
        </div>
 
      </div>
    </div>
  );
}
