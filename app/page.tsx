"use client";

import React, { useState } from 'react';

// 1. DAFTAR KATEGORI (Sudah ada by.U)
const categories = ["Semua", "Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren"];

// 2. DAFTAR PRODUK LENGKAP (by.U + Telkomsel + Tri + Indosat + XL + Smartfren)
const products = [
  // === DATA BY.U BARU (31 PAKET) ===
  { id: 1, category: "by.U", name: "by.U Data 125 GB", desc: "Masa Aktif 30 Hari", price: "Rp 210.310", icon: "🔴" },
  { id: 2, category: "by.U", name: "by.U Data 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 165.698", icon: "🔴" },
  { id: 3, category: "by.U", name: "by.U Data 84 GB", desc: "Masa Aktif 180 Hari", price: "Rp 184.604", icon: "🔴" },
  { id: 4, category: "by.U", name: "by.U Data 75 GB", desc: "Masa Aktif 30 Hari", price: "Rp 149.790", icon: "🔴" },
  { id: 5, category: "by.U", name: "by.U Data 65 GB", desc: "Masa Aktif 30 Hari", price: "Rp 99.015", icon: "🔴" },
  { id: 6, category: "by.U", name: "by.U Data 65 GB (V2)", desc: "Masa Aktif 30 Hari", price: "Rp 98.590", icon: "🔴" },
  { id: 7, category: "by.U", name: "by.U Data 57 GB", desc: "Masa Aktif 30 Hari", price: "Rp 106.111", icon: "🔴" },
  { id: 8, category: "by.U", name: "by.U Data 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 119.620", icon: "🔴" },
  { id: 9, category: "by.U", name: "by.U Data 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 79.078", icon: "🔴" },
  { id: 10, category: "by.U", name: "by.U Data 33 GB", desc: "Masa Aktif 30 Hari", price: "Rp 76.882", icon: "🔴" },
  { id: 11, category: "by.U", name: "by.U Data 23 GB", desc: "Masa Aktif 30 Hari", price: "Rp 79.352", icon: "🔴" },
  { id: 12, category: "by.U", name: "by.U Data 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 56.593", icon: "🔴" },
  { id: 13, category: "by.U", name: "by.U Data 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 80.078", icon: "🔴" },
  { id: 14, category: "by.U", name: "by.U Data 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.589", icon: "🔴" },
  { id: 15, category: "by.U", name: "by.U Data 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.212", icon: "🔴" },
  { id: 16, category: "by.U", name: "by.U Data 12 GB", desc: "Masa Aktif 7 Hari", price: "Rp 24.693", icon: "🔴" },
  { id: 17, category: "by.U", name: "by.U Data 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.255", icon: "🔴" },
  { id: 18, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.335", icon: "🔴" },
  { id: 19, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 14 Hari", price: "Rp 39.753", icon: "🔴" },
  { id: 20, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 10 Hari", price: "Rp 39.233", icon: "🔴" },
  { id: 21, category: "by.U", name: "by.U Data 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.580", icon: "🔴" },
  { id: 22, category: "by.U", name: "by.U Data 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.754", icon: "🔴" },
  { id: 23, category: "by.U", name: "by.U Data 8 GB", desc: "Masa Aktif 14 Hari", price: "Rp 35.078", icon: "🔴" },
  { id: 24, category: "by.U", name: "by.U Data 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 28.262", icon: "🔴" },
  { id: 25, category: "by.U", name: "by.U Data 7 GB", desc: "Masa Aktif 20 Hari", price: "Rp 28.500", icon: "🔴" },
  { id: 26, category: "by.U", name: "by.U Data 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.580", icon: "🔴" },
  { id: 27, category: "by.U", name: "by.U Data 5 GB", desc: "Masa Aktif 14 Hari", price: "Rp 16.987", icon: "🔴" },
  { id: 28, category: "by.U", name: "by.U Data 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 39.103", icon: "🔴" },
  { id: 29, category: "by.U", name: "by.U Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 38.580", icon: "🔴" },
  { id: 30, category: "by.U", name: "by.U Data 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 16.757", icon: "🔴" },
  { id: 31, category: "by.U", name: "by.U Data 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 13.953", icon: "🔴" },

  // === DATA TELKOMSEL LAMA ===
  { id: 32, category: "Telkomsel", name: "Data Flash 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 109.618", icon: "🔴" },
  { id: 33, category: "Telkomsel", name: "Data Flash 49 GB", desc: "Masa Aktif 30 Hari", price: "Rp 113.595", icon: "🔴" },
  { id: 34, category: "Telkomsel", name: "Data Flash 40 GB", desc: "Masa Aktif 30 Hari", price: "Rp 98.613", icon: "🔴" },
  { id: 35, category: "Telkomsel", name: "Data Flash 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 93.610", icon: "🔴" },
  { id: 36, category: "Telkomsel", name: "Data Flash 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 92.610", icon: "🔴" },
  { id: 37, category: "Telkomsel", name: "Data Flash 25 GB", desc: "Masa Aktif 30 Hari", price: "Rp 91.610", icon: "🔴" },
  { id: 38, category: "Telkomsel", name: "Data Flash 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.610", icon: "🔴" },
  { id: 39, category: "Telkomsel", name: "Data Flash 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 86.610", icon: "🔴" },
  { id: 40, category: "Telkomsel", name: "Data Flash 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 84.610", icon: "🔴" },
  { id: 41, category: "Telkomsel", name: "Data Flash 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 83.610", icon: "🔴" },
  { id: 42, category: "Telkomsel", name: "Data Flash 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 82.610", icon: "🔴" },
  { id: 43, category: "Telkomsel", name: "Data Flash 13 GB", desc: "Masa Aktif 30 Hari", price: "Rp 81.610", icon: "🔴" },
  { id: 44, category: "Telkomsel", name: "Data Flash 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 80.610", icon: "🔴" },
  { id: 45, category: "Telkomsel", name: "Data Flash 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 78.610", icon: "🔴" },
  { id: 46, category: "Telkomsel", name: "Data Flash 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 77.610", icon: "🔴" },
  { id: 47, category: "Telkomsel", name: "Data Flash 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 75.610", icon: "🔴" },
  { id: 48, category: "Telkomsel", name: "Data Flash 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 73.610", icon: "🔴" },
  { id: 49, category: "Telkomsel", name: "Data Flash 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 69.610", icon: "🔴" },
  { id: 50, category: "Telkomsel", name: "Data Flash 6.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 68.610", icon: "🔴" },
  { id: 51, category: "Telkomsel", name: "Data Flash 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 66.610", icon: "🔴" },
  { id: 52, category: "Telkomsel", name: "Data Flash 5.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 64.610", icon: "🔴" },
  { id: 53, category: "Telkomsel", name: "Data Flash 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.610", icon: "🔴" },
  { id: 54, category: "Telkomsel", name: "Data Flash 4.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 59.610", icon: "🔴" },
  { id: 55, category: "Telkomsel", name: "Data Flash 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 58.610", icon: "🔴" },
  { id: 56, category: "Telkomsel", name: "Data Flash 3.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 55.610", icon: "🔴" },
  { id: 57, category: "Telkomsel", name: "Data Flash 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 51.610", icon: "🔴" },
  { id: 58, category: "Telkomsel", name: "Data Flash 2.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 49.610", icon: "🔴" },
  { id: 59, category: "Telkomsel", name: "Data Flash 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 45.610", icon: "🔴" },
  { id: 60, category: "Telkomsel", name: "Data Flash 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 39.610", icon: "🔴" },
  { id: 61, category: "Telkomsel", name: "Data Flash 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 33.610", icon: "🔴" },
  { id: 62, category: "Telkomsel", name: "Paket Data 12.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 43.000", icon: "🔴" },
  { id: 63, category: "Telkomsel", name: "Paket Data 25 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.500", icon: "🔴" },
  { id: 64, category: "Telkomsel", name: "Paket Data 45 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.000", icon: "🔴" },

  // === DATA TRI LAMA ===
  { id: 65, category: "Tri", name: "AON 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 15.000", icon: "⚫" },
  { id: 66, category: "Tri", name: "AON 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 18.000", icon: "⚫" },
  { id: 67, category: "Tri", name: "AON 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 26.500", icon: "⚫" },
  { id: 68, category: "Tri", name: "AON 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 37.000", icon: "⚫" },
  { id: 69, category: "Tri", name: "BM 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 14.500", icon: "⚫" },
  { id: 70, category: "Tri", name: "BM 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 71, category: "Tri", name: "BM 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.500", icon: "⚫" },
  { id: 72, category: "Tri", name: "BM 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 34.000", icon: "⚫" },
  { id: 73, category: "Tri", name: "Bima 3GB", desc: "Masa Aktif 30 Hari", price: "Rp 35.000", icon: "⚫" },
  { id: 74, category: "Tri", name: "CINTA 6", desc: "Masa Aktif 30 Hari", price: "Rp 40.500", icon: "⚫" },
  { id: 75, category: "Tri", name: "Data 1 GB", desc: "Masa Aktif 1 Hari", price: "Rp 3.500", icon: "⚫" },
  { id: 76, category: "Tri", name: "Data 2 GB", desc: "Masa Aktif 1 Hari", price: "Rp 4.500", icon: "⚫" },
  { id: 77, category: "Tri", name: "Data 3 GB", desc: "Masa Aktif 1 Hari", price: "Rp 5.500", icon: "⚫" },
  { id: 78, category: "Tri", name: "Data 4 GB", desc: "Masa Aktif 1 Hari", price: "Rp 6.500", icon: "⚫" },
  { id: 79, category: "Tri", name: "Data 2.5 GB", desc: "Masa Aktif 1 Hari", price: "Rp 5.000", icon: "⚫" },
  { id: 80, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 1 Hari", price: "Rp 7.500", icon: "⚫" },
  { id: 81, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 1 Hari", price: "Rp 8.500", icon: "⚫" },
  { id: 82, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 1 Hari", price: "Rp 11.500", icon: "⚫" },
  { id: 83, category: "Tri", name: "Data 2 GB", desc: "Masa Aktif 3 Hari", price: "Rp 9.500", icon: "⚫" },
  { id: 84, category: "Tri", name: "Data 3 GB", desc: "Masa Aktif 3 Hari", price: "Rp 10.500", icon: "⚫" },
  { id: 85, category: "Tri", name: "Data 4 GB", desc: "Masa Aktif 3 Hari", price: "Rp 11.500", icon: "⚫" },
  { id: 86, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 3 Hari", price: "Rp 12.500", icon: "⚫" },
  { id: 87, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 3 Hari", price: "Rp 13.500", icon: "⚫" },
  { id: 88, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 3 Hari", price: "Rp 16.500", icon: "⚫" },
  { id: 89, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 5 Hari", price: "Rp 15.500", icon: "⚫" },
  { id: 90, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 5 Hari", price: "Rp 16.500", icon: "⚫" },
  { id: 91, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 5 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 92, category: "Tri", name: "Data 15 GB", desc: "Masa Aktif 5 Hari", price: "Rp 24.500", icon: "⚫" },
  { id: 93, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 7 Hari", price: "Rp 17.500", icon: "⚫" },
  { id: 94, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 7 Hari", price: "Rp 18.500", icon: "⚫" },
  { id: 95, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 7 Hari", price: "Rp 21.500", icon: "⚫" },
  { id: 96, category: "Tri", name: "Data 15 GB", desc: "Masa Aktif 7 Hari", price: "Rp 26.500", icon: "⚫" },
  { id: 97, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 10 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 101, category: "Tri", name: "Data 1.5 GB", desc: "Masa Aktif 14 Hari", price: "Rp 16.000", icon: "⚫" },
  { id: 105, category: "Tri", name: "Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 106, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.500", icon: "⚫" },

  // === DATA INDOSAT LAMA ===
  { id: 140, category: "Indosat", name: "Data 1 GB", desc: "Masa Aktif 2 Hari", price: "Rp 5.500", icon: "🟡" },
  { id: 141, category: "Indosat", name: "Data 2 GB", desc: "Masa Aktif 3 Hari", price: "Rp 8.500", icon: "🟡" },
  { id: 167, category: "Indosat", name: "Freedom Combo 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 38.000", icon: "🟡" },

  // === DATA XL & AXIS LAMA ===
  { id: 177, category: "XL & Axis", name: "Aigo 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 14.500", icon: "🔵" },
  { id: 182, category: "XL & Axis", name: "Bronet 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 15.500", icon: "🔵" },
  { id: 212, category: "XL & Axis", name: "Combo Flex S", desc: "Masa Aktif -", price: "Rp 14.500", icon: "🔵" },
  { id: 233, category: "XL & Axis", name: "AKRAB Mini", desc: "Pembagian Kuota Cek Area", price: "Rp 65.000", icon: "🔵" },
  { id: 234, category: "XL & Axis", name: "AKRAB Big", desc: "38 - 57 GB (Tergantung Area)", price: "Rp 70.000", icon: "🔵" },
  { id: 235, category: "XL & Axis", name: "AKRAB Jumbo V2", desc: "50 - 69 GB (Tergantung Area)", price: "Rp 79.000", icon: "🔵" },
  { id: 236, category: "XL & Axis", name: "AKRAB Jumbo New", desc: "63 - 82 GB (Tergantung Area)", price: "Rp 88.000", icon: "🔵" },
  { id: 237, category: "XL & Axis", name: "AKRAB Jumbo M", desc: "69 - 88 GB (Tergantung Area)", price: "Rp 93.000", icon: "🔵" },
  { id: 238, category: "XL & Axis", name: "AKRAB Mega Big", desc: "88 - 107 GB (Tergantung Area)", price: "Rp 107.000", icon: "🔵" },

  // === DATA SMARTFREN LAMA ===
  { id: 239, category: "Smartfren", name: "10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 32.500", icon: "🟣" }
];

export default function LandingPage() {
  const whatsappNumber = "6285967096912";
  
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeType, setActiveType] = useState("Semua Tipe");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // FUNGSI CERDAS 1: Membaca nama produk ke sub-kategori
  const getPackageType = (name: string) => {
    const n = name.toLowerCase();
    
    if (n.includes('akrab')) return 'AKRAB';
    if (n.includes('by.u')) return 'Paket by.U';
    if (n.includes('flex')) return 'Combo Flex';
    if (n.includes('bronet')) return 'Bronet';
    if (n.includes('owsem')) return 'Owsem';
    if (n.includes('aigo')) return 'Aigo';
    if (n.includes('xtra') || n.includes('extra')) return 'Xtra Series';
    if (n.includes('hotrod')) return 'HotRod';
    if (n.includes('vip')) return 'VIP Plus';
    if (n.includes('freedom')) return 'Freedom';
    if (n.includes('flash')) return 'Data Flash';
    if (n.includes('happy')) return 'Happy';
    if (n.includes('aon')) return 'AON';
    if (n.includes('unlimited')) return 'Unlimited';
    if (n.includes('lte')) return 'LTE';
    if (n.includes('getmore')) return 'Getmore';
    if (n.includes('bima')) return 'Bima';
    if (n.includes('cinta')) return 'Cinta';
    if (n.includes('bm')) return 'BM';

    return 'Reguler / Kuota Utama';
  };

  // FUNGSI CERDAS 2: Menampilkan Logo Gambar Otomatis
  const getProviderLogo = (category: string) => {
    if (category === "Telkomsel") return "/telkomsel.png";
    if (category === "by.U") return "/telkomsel.png"; // by.U menggunakan logo telkomsel atau /byu.png jika ada
    if (category === "Indosat") return "/indosat.png";
    if (category === "XL & Axis") return "/xl.png";
    if (category === "Tri") return "/tri.png";
    if (category === "Smartfren") return "/smartfren.png";
    return ""; 
  };

  const getWaLink = (productName: string, productPrice?: string) => {
    const priceText = productPrice ? ` dengan harga ${productPrice}` : "";
    const message = `Halo Arwani D'Gabriel Store, saya ingin memesan ${productName}${priceText}. Bagaimana prosedurnya?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  const providerProducts = activeCategory === "Semua" 
    ? products 
    : products.filter(item => item.category === activeCategory);

  const availableTypes = ["Semua Tipe", ...Array.from(new Set(providerProducts.map(p => getPackageType(p.name))))];

  let rawFinalProducts = activeType === "Semua Tipe"
    ? providerProducts
    : providerProducts.filter(p => getPackageType(p.name) === activeType);

  const finalProducts: any[] = [];
  const akrabGroup: any[] = [];

  rawFinalProducts.forEach(product => {
    if (product.name.toLowerCase().includes('akrab')) {
      akrabGroup.push(product);
    } else {
      finalProducts.push(product); 
    }
  });

  if (akrabGroup.length > 0) {
    finalProducts.unshift({
      id: "master-akrab",
      category: "XL & Axis",
      name: "Paket Keluarga AKRAB",
      desc: "Pilih Ukuran Kuota Sesuai Kebutuhan Anda",
      price: "Mulai Rp 65.000",
      icon: "👪",
      isGroup: true, 
      variants: akrabGroup
    });
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveType("Semua Tipe");
  };

  const handleVariantChange = (groupId: string, variantName: string) => {
    setSelectedVariants(prev => ({...prev, [groupId]: variantName}));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-blue-600">ARWANI D'GABRIEL <span className="text-slate-400">STORE</span></h1>
          <a 
            href={getWaLink("Informasi Umum")}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition"
          >
            Hubungi Admin
          </a>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Solusi Kebutuhan Digital <br/> <span className="text-blue-600">Cepat, Murah, Terpercaya.</span>
        </h2>
        <p className="text-lg text-slate-600 mb-10">
          Tersedia ratusan pilihan paket data hemat. Transaksi cepat, layanan responsif, dan langsung terhubung via WhatsApp.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2 rounded-full font-bold transition shadow-sm ${
                activeCategory === category 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {availableTypes.length > 2 && (
          <div className="flex flex-wrap justify-center gap-2 pt-4 border-t border-slate-200/60 max-w-5xl mx-auto">
            {availableTypes.map(type => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeType === type
                    ? "bg-slate-800 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </section>

      <section id="produk" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {finalProducts.map((item) => {
            
            if (item.isGroup) {
              const selectedVarName = selectedVariants[item.id] || item.variants[0].name;
              const selectedVar = item.variants.find((v: any) => v.name === selectedVarName);

              return (
                <div key={item.id} className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
                  <div>
                    <div className="h-14 mb-4 flex items-center justify-start">
                      <img src={getProviderLogo(item.category)} alt={item.category} className="max-h-full max-w-[100px] object-contain drop-shadow-sm" />
                    </div>
                    
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">{item.category}</div>
                      <div className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">PILIHAN GANDA</div>
                    </div>
                    <h3 className="text-lg font-bold mb-1 leading-snug text-slate-900">{item.name}</h3>
                    <p className="text-blue-700 text-sm mb-4 font-medium">{item.desc}</p>
                    
                    <div className="mb-4">
                      <select 
                        className="w-full p-2 border border-blue-300 rounded-lg text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedVarName}
                        onChange={(e) => handleVariantChange(item.id, e.target.value)}
                      >
                        {item.variants.map((v: any) => (
                          <option key={v.id} value={v.name}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-blue-100 mb-4">
                     <p className="text-xs text-slate-500 mb-1">Detail Varian Terpilih:</p>
                     <p className="text-sm font-semibold text-slate-800 mb-1">{selectedVar.desc}</p>
                     <div className="text-xl font-black text-blue-600">{selectedVar.price}</div>
                  </div>

                  <div>
                    <a 
                      href={getWaLink(selectedVar.name, selectedVar.price)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 transition block"
                    >
                      Pesan Sekarang
                    </a>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition group flex flex-col justify-between">
                <div>
                  <div className="h-10 mb-5 flex items-center justify-start">
                     <img src={getProviderLogo(item.category)} alt={item.category} className="max-h-full max-w-[90px] object-contain drop-shadow-sm" />
                  </div>

                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category}</div>
                    <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{getPackageType(item.name)}</div>
                  </div>
                  <h3 className="text-lg font-bold mb-1 leading-snug text-slate-800">{item.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{item.desc}</p>
                </div>
                <div>
                  <div className="text-xl font-black text-blue-600 mb-4">{item.price}</div>
                  <a 
                    href={getWaLink(item.name, item.price)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-blue-50 text-blue-700 text-center font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition block"
                  >
                    Pesan Sekarang
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="py-10 text-center text-slate-400 text-sm bg-blue-900 text-white mt-10">
        <p>© 2026 Arwani D'Gabriel Store. Pelayanan sepenuh hati.</p>
      </footer>
    </div>
  );
}