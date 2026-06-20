"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Product, ActiveCategory } from "@/types/product";
import { getDbProvider } from "@/utils/db";
import { formatRupiah } from "@/utils/helpers";

const categories = ["Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren", "MasaAktif"] as const;

export default function AdminDashboard() {
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

  useEffect(() => {
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
  }, [db]);

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

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b0f19] pb-10 transition-colors duration-500">
      
      {/* Header Bar */}
      <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-white/10 relative z-20">
        <Link
          href="/"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-slate-300 hover:text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali
        </Link>
        <span className="text-xs font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
          Admin Panel
        </span>
      </div>

      <div className="px-5 mt-6 space-y-6">
        
        {/* Connection Status Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between transition-colors duration-500">
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
              Status Database
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-wider">
              Aktif: {dbProviderName}
            </p>
          </div>
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </div>

        {/* Add/Edit Product Form Panel */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-500">
          <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4">
            {isEditing ? `Edit Produk (ID: ${editingId})` : "Tambah Produk Baru"}
          </h3>

          <form onSubmit={handleSaveProduct} className="space-y-3.5">
            {formError && (
              <p className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-950/20 p-2.5 rounded-xl border border-red-200 dark:border-red-900/30">
                ⚠️ {formError}
              </p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {/* Category */}
              <div>
                <label className="text-[9px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Kategori
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl outline-none"
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
                <label className="text-[9px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider block mb-1">
                  Harga (Rupiah)
                </label>
                <input
                  type="text"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="Contoh: 55000"
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl outline-none"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-[9px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Nama Produk
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Contoh: Circel Reguler 10-14 GB"
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-[9px] font-black text-slate-450 dark:text-slate-500 uppercase tracking-wider block mb-1">
                Deskripsi / Masa Aktif
              </label>
              <input
                type="text"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Contoh: Masa Aktif 28 Hari (Full Utama)"
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-xl outline-none"
              />
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-orange-500 dark:bg-emerald-500 hover:bg-orange-600 dark:hover:bg-emerald-650 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition duration-300 shadow-sm active:scale-95"
              >
                {isEditing ? "Simpan Perubahan" : "Tambah Paket"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-xl transition duration-300 active:scale-95"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Products List Panel */}
        <div className="space-y-3.5">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Daftar Paket Aktif ({filteredProducts.length})
          </p>

          {/* Quick Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-3.5 h-3.5 text-slate-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, operator, atau deskripsi..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-750 dark:text-slate-205 placeholder-slate-400 outline-none focus:border-orange-500 dark:focus:border-emerald-500 transition shadow-sm"
            />
          </div>

          <div className="space-y-2 max-h-[30rem] overflow-y-auto pr-1 pb-4 scrollbar-hide">
            {isLoading ? (
              <div className="text-center py-6 text-xs text-slate-400 font-bold animate-pulse">
                Memuat database produk...
              </div>
            ) : filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between gap-3 transition-colors duration-500"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[7.5px] font-black px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase border border-slate-200/50 dark:border-slate-800/40 tracking-wider">
                      ID: {p.id}
                    </span>
                    <span className="text-[7.5px] font-black px-1.5 py-0.5 rounded bg-orange-50 dark:bg-orange-950/20 text-orange-655 dark:text-orange-400 uppercase tracking-wider">
                      {p.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 truncate">
                    {p.name}
                  </h4>
                  <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500">
                    {p.desc} — <span className="font-extrabold text-orange-500 dark:text-emerald-400">{formatRupiah(p.price)}</span>
                  </p>
                </div>

                {/* Edit & Delete Action Panel */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleOpenEditForm(p)}
                    className="p-2 bg-slate-50 hover:bg-orange-50 dark:bg-slate-950 dark:hover:bg-orange-950/20 border border-slate-100 dark:border-slate-850 text-slate-450 dark:text-slate-500 hover:text-orange-550 dark:hover:text-orange-455 rounded-xl transition duration-300 active:scale-90"
                    aria-label="Edit product"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 bg-slate-50 hover:bg-red-50 dark:bg-slate-950 dark:hover:bg-red-950/20 border border-slate-100 dark:border-slate-850 text-slate-450 dark:text-slate-500 hover:text-red-550 dark:hover:text-red-455 rounded-xl transition duration-300 active:scale-90"
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
              <div className="text-center py-6 text-xs text-slate-400 font-bold bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                Tidak ada produk yang cocok.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
