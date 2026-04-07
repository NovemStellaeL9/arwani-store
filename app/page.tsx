"use client";

import React, { useState } from 'react';

// 1. DAFTAR KATEGORI
const categories = ["Semua", "Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren"];

// 2. DATABASE PRODUK (SEMUA DATA LAMA + BY.U TETAP ADA DI SINI)
const products = [
  // --- BY.U ---
  { id: 1, category: "by.U", name: "by.U Data 125 GB", desc: "Masa Aktif 30 Hari", price: "Rp 210.310" },
  { id: 2, category: "by.U", name: "by.U Data 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 165.698" },
  { id: 3, category: "by.U", name: "by.U Data 84 GB", desc: "Masa Aktif 180 Hari", price: "Rp 184.604" },
  { id: 4, category: "by.U", name: "by.U Data 75 GB", desc: "Masa Aktif 30 Hari", price: "Rp 149.790" },
  { id: 5, category: "by.U", name: "by.U Data 65 GB", desc: "Masa Aktif 30 Hari", price: "Rp 99.015" },
  { id: 6, category: "by.U", name: "by.U Data 65 GB (V2)", desc: "Masa Aktif 30 Hari", price: "Rp 98.590" },
  { id: 7, category: "by.U", name: "by.U Data 57 GB", desc: "Masa Aktif 30 Hari", price: "Rp 106.111" },
  { id: 8, category: "by.U", name: "by.U Data 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 119.620" },
  { id: 9, category: "by.U", name: "by.U Data 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 79.078" },
  { id: 10, category: "by.U", name: "by.U Data 33 GB", desc: "Masa Aktif 30 Hari", price: "Rp 76.882" },
  { id: 11, category: "by.U", name: "by.U Data 23 GB", desc: "Masa Aktif 30 Hari", price: "Rp 79.352" },
  { id: 12, category: "by.U", name: "by.U Data 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 56.593" },
  { id: 13, category: "by.U", name: "by.U Data 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 80.078" },
  { id: 14, category: "by.U", name: "by.U Data 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.589" },
  { id: 15, category: "by.U", name: "by.U Data 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.212" },
  { id: 16, category: "by.U", name: "by.U Data 12 GB", desc: "Masa Aktif 7 Hari", price: "Rp 24.693" },
  { id: 17, category: "by.U", name: "by.U Data 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.255" },
  { id: 18, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.335" },
  { id: 19, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 14 Hari", price: "Rp 39.753" },
  { id: 20, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 10 Hari", price: "Rp 39.233" },
  { id: 21, category: "by.U", name: "by.U Data 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.580" },
  { id: 22, category: "by.U", name: "by.U Data 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.754" },
  { id: 23, category: "by.U", name: "by.U Data 8 GB", desc: "Masa Aktif 14 Hari", price: "Rp 35.078" },
  { id: 24, category: "by.U", name: "by.U Data 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 28.262" },
  { id: 25, category: "by.U", name: "by.U Data 7 GB", desc: "Masa Aktif 20 Hari", price: "Rp 28.500" },
  { id: 26, category: "by.U", name: "by.U Data 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.580" },
  { id: 27, category: "by.U", name: "by.U Data 5 GB", desc: "Masa Aktif 14 Hari", price: "Rp 16.987" },
  { id: 28, category: "by.U", name: "by.U Data 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 39.103" },
  { id: 29, category: "by.U", name: "by.U Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 38.580" },
  { id: 30, category: "by.U", name: "by.U Data 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 16.757" },
  { id: 31, category: "by.U", name: "by.U Data 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 13.953" },

  // --- TELKOMSEL ---
  { id: 32, category: "Telkomsel", name: "Data Flash 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 109.618" },
  { id: 33, category: "Telkomsel", name: "Data Flash 49 GB", desc: "Masa Aktif 30 Hari", price: "Rp 113.595" },
  { id: 34, category: "Telkomsel", name: "Data Flash 40 GB", desc: "Masa Aktif 30 Hari", price: "Rp 98.613" },
  { id: 35, category: "Telkomsel", name: "Data Flash 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 93.610" },
  { id: 36, category: "Telkomsel", name: "Data Flash 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 92.610" },
  { id: 37, category: "Telkomsel", name: "Data Flash 25 GB", desc: "Masa Aktif 30 Hari", price: "Rp 91.610" },
  { id: 38, category: "Telkomsel", name: "Data Flash 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.610" },
  { id: 39, category: "Telkomsel", name: "Data Flash 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 86.610" },
  { id: 40, category: "Telkomsel", name: "Data Flash 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 84.610" },
  { id: 41, category: "Telkomsel", name: "Data Flash 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 83.610" },
  { id: 42, category: "Telkomsel", name: "Data Flash 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 82.610" },
  { id: 43, category: "Telkomsel", name: "Data Flash 13 GB", desc: "Masa Aktif 30 Hari", price: "Rp 81.610" },
  { id: 44, category: "Telkomsel", name: "Data Flash 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 80.610" },
  { id: 45, category: "Telkomsel", name: "Data Flash 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 78.610" },
  { id: 46, category: "Telkomsel", name: "Data Flash 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 77.610" },
  { id: 47, category: "Telkomsel", name: "Data Flash 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 75.610" },
  { id: 48, category: "Telkomsel", name: "Data Flash 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 73.610" },
  { id: 49, category: "Telkomsel", name: "Data Flash 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 69.610" },
  { id: 50, category: "Telkomsel", name: "Data Flash 6.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 68.610" },
  { id: 51, category: "Telkomsel", name: "Data Flash 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 66.610" },
  { id: 52, category: "Telkomsel", name: "Data Flash 5.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 64.610" },
  { id: 53, category: "Telkomsel", name: "Data Flash 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.610" },
  { id: 54, category: "Telkomsel", name: "Data Flash 4.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 59.610" },
  { id: 55, category: "Telkomsel", name: "Data Flash 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 58.610" },
  { id: 56, category: "Telkomsel", name: "Data Flash 3.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 55.610" },
  { id: 57, category: "Telkomsel", name: "Data Flash 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 51.610" },
  { id: 58, category: "Telkomsel", name: "Data Flash 2.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 49.610" },
  { id: 59, category: "Telkomsel", name: "Data Flash 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 45.610" },
  { id: 60, category: "Telkomsel", name: "Data Flash 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 39.610" },
  { id: 61, category: "Telkomsel", name: "Data Flash 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 33.610" },
  { id: 62, category: "Telkomsel", name: "Paket Data 12.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 43.000" },
  { id: 63, category: "Telkomsel", name: "Paket Data 25 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.500" },
  { id: 64, category: "Telkomsel", name: "Paket Data 45 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.000" },

  // --- TRI ---
  { id: 65, category: "Tri", name: "AON 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 15.000" },
  { id: 66, category: "Tri", name: "AON 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 18.000" },
  { id: 67, category: "Tri", name: "AON 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 26.500" },
  { id: 68, category: "Tri", name: "AON 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 37.000" },
  { id: 69, category: "Tri", name: "Happy 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 13.500" },

  // --- INDOSAT ---
  { id: 70, category: "Indosat", name: "Data 1 GB", desc: "Masa Aktif 2 Hari", price: "Rp 5.500" },
  { id: 71, category: "Indosat", name: "Data 2 GB", desc: "Masa Aktif 3 Hari", price: "Rp 8.500" },
  { id: 72, category: "Indosat", name: "Freedom Combo 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 38.000" },

  // --- XL & AXIS ---
  { id: 73, category: "XL & Axis", name: "Aigo 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 14.500" },
  { id: 74, category: "XL & Axis", name: "Combo Flex S", desc: "Masa Aktif -", price: "Rp 14.500" },
  { id: 75, category: "XL & Axis", name: "AKRAB Mini", desc: "Pembagian Kuota Cek Area", price: "Rp 65.000" },
  { id: 76, category: "XL & Axis", name: "AKRAB Big", desc: "38 - 57 GB", price: "Rp 70.000" },
  { id: 77, category: "XL & Axis", name: "AKRAB Jumbo V2", desc: "50 - 69 GB", price: "Rp 79.000" },
  { id: 78, category: "XL & Axis", name: "AKRAB Jumbo New", desc: "63 - 82 GB", price: "Rp 88.000" },
  { id: 79, category: "XL & Axis", name: "AKRAB Jumbo M", desc: "69 - 88 GB", price: "Rp 93.000" },
  { id: 80, category: "XL & Axis", name: "AKRAB Mega Big", desc: "88 - 107 GB", price: "Rp 107.000" },

  // --- SMARTFREN ---
  { id: 81, category: "Smartfren", name: "10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 32.500" }
];

export default function LandingPage() {
  const whatsappNumber = "6285967096912";
  
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeType, setActiveType] = useState("Semua Tipe");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("Default");

  // Fungsi mengubah teks Rp ke Angka
  const priceToNumber = (priceStr: string) => {
    return parseInt(priceStr.replace(/[^0-9]/g, "")) || 0;
  };

  const getPackageType = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('akrab')) return 'AKRAB';
    if (n.includes('by.u')) return 'Paket by.U';
    if (n.includes('flex')) return 'Combo Flex';
    if (n.includes('flash')) return 'Data Flash';
    if (n.includes('freedom')) return 'Freedom';
    if (n.includes('aon')) return 'AON';
    if (n.includes('happy')) return 'Happy';
    return 'Reguler / Lainnya';
  };

  const getProviderLogo = (category: string) => {
    if (category === "Telkomsel") return "/telkomsel.png";
    if (category === "by.U") return "/byu.png"; 
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

  // --- PROSES FILTER & SORTING ---
  let displayProducts = activeCategory === "Semua" 
    ? [...products] 
    : products.filter(item => item.category === activeCategory);

  if (activeType !== "Semua Tipe") {
    displayProducts = displayProducts.filter(p => getPackageType(p.name) === activeType);
  }

  // Fitur Sorting Termurah
  if (sortBy === "Termurah") {
    displayProducts.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
  }

  const availableTypes = ["Semua Tipe", ...Array.from(new Set(displayProducts.map(p => getPackageType(p.name))))];

  const finalProducts: any[] = [];
  const akrabGroup: any[] = [];

  displayProducts.forEach(product => {
    if (product.name.toLowerCase().includes('akrab')) {
      akrabGroup.push(product);
    } else {
      finalProducts.push(product); 
    }
  });

  if (akrabGroup.length > 0) {
    sortBy === "Termurah" 
      ? finalProducts.push({ id: "master-akrab", category: "XL & Axis", name: "Paket Keluarga AKRAB", desc: "Pilih Ukuran Kuota", price: "Mulai Rp 65.000", icon: "👪", isGroup: true, variants: akrabGroup })
      : finalProducts.unshift({ id: "master-akrab", category: "XL & Axis", name: "Paket Keluarga AKRAB", desc: "Pilih Ukuran Kuota", price: "Mulai Rp 65.000", icon: "👪", isGroup: true, variants: akrabGroup });
  }

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveType("Semua Tipe");
    setSortBy("Default");
  };

  const handleVariantChange = (groupId: string, variantName: string) => {
    setSelectedVariants(prev => ({...prev, [groupId]: variantName}));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-blue-600">ARWANI D'GABRIEL <span className="text-slate-400">STORE</span></h1>
          <a href={getWaLink("Informasi Umum")} target="_blank" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">Hubungi Admin</a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Solusi Kebutuhan Digital <br/> <span className="text-blue-600">Cepat, Murah, Terpercaya.</span>
        </h2>
      </section>

      {/* Filter System */}
      <section className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map(category => (
            <button key={category} onClick={() => handleCategoryClick(category)} className={`px-6 py-2 rounded-full font-bold transition shadow-sm ${activeCategory === category ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50"}`}>
              {category}
            </button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 border-t border-slate-200/60 max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {availableTypes.map(type => (
              <button key={type} onClick={() => setActiveType(type)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeType === type ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-widest">Urutkan:</span>
            <button onClick={() => setSortBy("Default")} className={`px-3 py-1 rounded-lg text-xs font-bold transition ${sortBy === "Default" ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:text-slate-600"}`}>Terbaru</button>
            <button onClick={() => setSortBy("Termurah")} className={`px-3 py-1 rounded-lg text-xs font-bold transition ${sortBy === "Termurah" ? "bg-blue-600 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>💸 Termurah</button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="produk" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {finalProducts.map((item) => {
            if (item.isGroup) {
              const selectedVarName = selectedVariants[item.id] || item.variants[0].name;
              const selectedVar = item.variants.find((v: any) => v.name === selectedVarName);
              return (
                <div key={item.id} className="bg-blue-50 p-6 rounded-3xl border-2 border-blue-200 shadow-md flex flex-col justify-between transition-all">
                  <div>
                    <div className="h-14 mb-4 flex items-center justify-start">
                      <img src={getProviderLogo(item.category)} alt={item.category} className="max-h-full max-w-[100px] object-contain" />
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-bold text-blue-600 uppercase">{item.category}</div>
                      <div className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-bold">PILIHAN GANDA</div>
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-slate-900">{item.name}</h3>
                    <select className="w-full p-2 mt-2 border border-blue-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={selectedVarName} onChange={(e) => handleVariantChange(item.id, e.target.value)}>
                      {item.variants.map((v: any) => <option key={v.id} value={v.name}>{v.name}</option>)}
                    </select>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-blue-100 my-4">
                     <p className="text-sm font-semibold text-slate-800">{selectedVar.desc}</p>
                     <div className="text-xl font-black text-blue-600">{selectedVar.price}</div>
                  </div>
                  <a href={getWaLink(selectedVar.name, selectedVar.price)} target="_blank" className="w-full py-3 bg-blue-600 text-white text-center font-bold rounded-xl hover:bg-blue-700 transition block shadow-sm">Pesan Sekarang</a>
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
                  <a href={getWaLink(item.name, item.price)} target="_blank" className="w-full py-3 bg-blue-50 text-blue-700 text-center font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white transition block">Pesan Sekarang</a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-slate-400 text-sm bg-blue-900 text-white">
        <p>© 2026 Arwani D'Gabriel Store. Pelayanan sepenuh hati.</p>
      </footer>
    </div>
  );
}