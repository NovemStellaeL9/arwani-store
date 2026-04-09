"use client";

import React, { useState } from 'react';

// 1. DAFTAR KATEGORI
const categories = ["Semua", "Telkomsel", "by.U", "Indosat", "XL & Axis", "Tri", "Smartfren"];

// 2. DATABASE PRODUK (286 DATA FULL LENGKAP SESUAI KIRIMAN ANDA)
const products = [
  // --- TELKOMSEL ---
  { id: 1, category: "Telkomsel", name: "Data Flash 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 109.618" },
  { id: 2, category: "Telkomsel", name: "Data Flash 49 GB", desc: "Masa Aktif 30 Hari", price: "Rp 113.595" },
  { id: 3, category: "Telkomsel", name: "Data Flash 40 GB", desc: "Masa Aktif 30 Hari", price: "Rp 98.613" },
  { id: 4, category: "Telkomsel", name: "Data Flash 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 93.610" },
  { id: 5, category: "Telkomsel", name: "Data Flash 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 92.610" },
  { id: 6, category: "Telkomsel", name: "Data Flash 28 GB", desc: "Masa Aktif 30 Hari", price: "Rp 69.098" },
  { id: 7, category: "Telkomsel", name: "Data Flash 27 GB (Revamp)", desc: "Masa Aktif 30 Hari", price: "Rp 93.485" },
  { id: 8, category: "Telkomsel", name: "Data Flash 25 GB", desc: "Masa Aktif 30 Hari", price: "Rp 118.623" },
  { id: 9, category: "Telkomsel", name: "Data Flash 22 GB", desc: "Masa Aktif 30 Hari", price: "Rp 64.846" },
  { id: 10, category: "Telkomsel", name: "Data Flash 22 GB (Revamp)", desc: "Masa Aktif 30 Hari", price: "Rp 83.480" },
  { id: 11, category: "Telkomsel", name: "Data Flash 21 GB", desc: "Masa Aktif 30 Hari", price: "Rp 81.104" },
  { id: 12, category: "Telkomsel", name: "Data Flash 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 59.593" },
  { id: 13, category: "Telkomsel", name: "Data Flash 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 53.565" },
  { id: 14, category: "Telkomsel", name: "Data Flash 18 GB (Revamp)", desc: "Masa Aktif 30 Hari", price: "Rp 60.068" },
  { id: 15, category: "Telkomsel", name: "Data Flash 17 GB", desc: "Masa Aktif 30 Hari", price: "Rp 50.589" },
  { id: 16, category: "Telkomsel", name: "Data Flash 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 51.889" },
  { id: 17, category: "Telkomsel", name: "Data Flash 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 53.090" },
  { id: 18, category: "Telkomsel", name: "Data Flash 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 51.439" },
  { id: 19, category: "Telkomsel", name: "Data Flash 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 52.289" },
  { id: 20, category: "Telkomsel", name: "Data Flash 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.059" },
  { id: 21, category: "Telkomsel", name: "Data Flash 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 50.488" },
  { id: 22, category: "Telkomsel", name: "Data Flash 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 39.283" },

  // --- BY.U ---
  { id: 23, category: "by.U", name: "by.U Data 125 GB", desc: "Masa Aktif 30 Hari", price: "Rp 210.310" },
  { id: 24, category: "by.U", name: "by.U Data 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 165.698" },
  { id: 25, category: "by.U", name: "by.U Data 84 GB", desc: "Masa Aktif 180 Hari", price: "Rp 184.604" },
  { id: 26, category: "by.U", name: "by.U Data 75 GB", desc: "Masa Aktif 30 Hari", price: "Rp 149.790" },
  { id: 27, category: "by.U", name: "by.U Data 65 GB", desc: "Masa Aktif 30 Hari", price: "Rp 99.015" },
  { id: 28, category: "by.U", name: "by.U Data 65 GB (Varian Lain)", desc: "Masa Aktif 30 Hari", price: "Rp 98.590" },
  { id: 29, category: "by.U", name: "by.U Data 57 GB", desc: "Masa Aktif 30 Hari", price: "Rp 106.111" },
  { id: 30, category: "by.U", name: "by.U Data 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 119.620" },
  { id: 31, category: "by.U", name: "by.U Data 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 79.078" },
  { id: 32, category: "by.U", name: "by.U Data 33 GB", desc: "Masa Aktif 30 Hari", price: "Rp 76.882" },
  { id: 33, category: "by.U", name: "by.U Data 23 GB", desc: "Masa Aktif 30 Hari", price: "Rp 79.352" },
  { id: 34, category: "by.U", name: "by.U Data 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 56.593" },
  { id: 35, category: "by.U", name: "by.U Data 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 80.078" },
  { id: 36, category: "by.U", name: "by.U Data 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.589" },
  { id: 37, category: "by.U", name: "by.U Data 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.212" },
  { id: 38, category: "by.U", name: "by.U Data 12 GB", desc: "Masa Aktif 7 Hari", price: "Rp 24.693" },
  { id: 39, category: "by.U", name: "by.U Data 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.255" },
  { id: 40, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.335" },
  { id: 41, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 14 Hari", price: "Rp 39.753" },
  { id: 42, category: "by.U", name: "by.U Data 10 GB", desc: "Masa Aktif 10 Hari", price: "Rp 39.233" },
  { id: 43, category: "by.U", name: "by.U Data 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.580" },
  { id: 44, category: "by.U", name: "by.U Data 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.754" },
  { id: 45, category: "by.U", name: "by.U Data 8 GB", desc: "Masa Aktif 14 Hari", price: "Rp 35.078" },
  { id: 46, category: "by.U", name: "by.U Data 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 28.262" },
  { id: 47, category: "by.U", name: "by.U Data 7 GB", desc: "Masa Aktif 20 Hari", price: "Rp 28.500" },
  { id: 48, category: "by.U", name: "by.U Data 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 46.580" },
  { id: 49, category: "by.U", name: "by.U Data 5 GB", desc: "Masa Aktif 14 Hari", price: "Rp 16.987" },
  { id: 50, category: "by.U", name: "by.U Data 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 39.103" },
  { id: 51, category: "by.U", name: "by.U Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 38.580" },
  { id: 52, category: "by.U", name: "by.U Data 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 16.757" },
  { id: 53, category: "by.U", name: "by.U Data 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 13.953" },

  // --- TRI ---
  { id: 54, category: "Tri", name: "Data AlwaysOn 1.5 GB", desc: "Masa Aktif -", price: "Rp 27.000" },
  { id: 55, category: "Tri", name: "Data AlwaysOn 2 GB", desc: "Masa Aktif -", price: "Rp 21.000" },
  { id: 56, category: "Tri", name: "Data AlwaysOn 2.5 GB", desc: "Masa Aktif -", price: "Rp 27.000" },
  { id: 57, category: "Tri", name: "Data AlwaysOn 3 GB", desc: "Masa Aktif -", price: "Rp 27.000" },
  { id: 58, category: "Tri", name: "Data AlwaysOn 3.5 GB", desc: "Masa Aktif -", price: "Rp 28.000" },
  { id: 59, category: "Tri", name: "Data AlwaysOn 4 GB", desc: "Masa Aktif -", price: "Rp 29.000" },
  { id: 60, category: "Tri", name: "Data AlwaysOn 5 GB", desc: "Masa Aktif -", price: "Rp 32.000" },
  { id: 61, category: "Tri", name: "Data AlwaysOn 6 GB", desc: "Masa Aktif -", price: "Rp 35.000" },
  { id: 62, category: "Tri", name: "Data AlwaysOn 7 GB", desc: "Masa Aktif -", price: "Rp 48.000" },
  { id: 63, category: "Tri", name: "Data AlwaysOn 8 GB", desc: "Masa Aktif -", price: "Rp 48.000" },
  { id: 64, category: "Tri", name: "Data AlwaysOn 9 GB", desc: "Masa Aktif -", price: "Rp 50.000" },
  { id: 65, category: "Tri", name: "Data AlwaysOn 10 GB", desc: "Masa Aktif -", price: "Rp 60.000" },
  { id: 66, category: "Tri", name: "Data AlwaysOn 12 GB", desc: "Masa Aktif -", price: "Rp 62.000" },
  { id: 67, category: "Tri", name: "Data AlwaysOn 14 GB", desc: "Masa Aktif -", price: "Rp 68.000" },
  { id: 68, category: "Tri", name: "Data AlwaysOn 16 GB", desc: "Masa Aktif -", price: "Rp 109.000" },
  { id: 69, category: "Tri", name: "Data AlwaysOn 16 GB + Unlimited", desc: "Masa Aktif -", price: "Rp 109.000" },
  { id: 70, category: "Tri", name: "Data AlwaysOn 26 GB", desc: "Masa Aktif -", price: "Rp 84.000" },
  { id: 71, category: "Tri", name: "Data AlwaysOn 40 GB", desc: "Masa Aktif -", price: "Rp 113.000" },
  { id: 72, category: "Tri", name: "Data AlwaysOn Unlimited 26 GB", desc: "Masa Aktif -", price: "Rp 76.000" },
  { id: 73, category: "Tri", name: "Data AlwaysOn 10 GB + Unlimited", desc: "Masa Aktif -", price: "Rp 83.000" },
  { id: 74, category: "Tri", name: "Data Happy 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.000" },
  { id: 75, category: "Tri", name: "Data Happy 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 29.000" },
  { id: 76, category: "Tri", name: "Data Happy 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 44.000" },
  { id: 77, category: "Tri", name: "Data Happy 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 54.000" },
  { id: 78, category: "Tri", name: "Data Happy 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 66.000" },
  { id: 79, category: "Tri", name: "Data Happy 45 GB", desc: "Masa Aktif 30 Hari", price: "Rp 92.000" },
  { id: 80, category: "Tri", name: "Data Happy 75 GB", desc: "Masa Aktif 30 Hari", price: "Rp 118.000" },
  { id: 81, category: "Tri", name: "Data Happy 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 144.000" },

  // --- INDOSAT ---
  { id: 82, category: "Indosat", name: "Freedom Internet 9 GB", desc: "Masa Aktif 28 Hari", price: "Rp 51.000" },
  { id: 83, category: "Indosat", name: "Freedom Internet 10 GB", desc: "Masa Aktif 28 Hari", price: "Rp 44.000" },
  { id: 84, category: "Indosat", name: "Freedom Internet 11 GB", desc: "Masa Aktif 28 Hari", price: "Rp 50.000" },
  { id: 85, category: "Indosat", name: "Freedom Internet 12 GB", desc: "Masa Aktif 28 Hari", price: "Rp 47.000" },
  { id: 86, category: "Indosat", name: "Freedom Internet 13 GB", desc: "Masa Aktif 28 Hari", price: "Rp 48.000" },
  { id: 87, category: "Indosat", name: "Freedom Internet 14 GB", desc: "Masa Aktif 28 Hari", price: "Rp 48.000" },
  { id: 88, category: "Indosat", name: "Freedom Internet 15 GB", desc: "Masa Aktif 28 Hari", price: "Rp 48.000" },
  { id: 89, category: "Indosat", name: "Freedom Internet 16 GB", desc: "Masa Aktif 28 Hari", price: "Rp 48.000" },
  { id: 90, category: "Indosat", name: "Freedom Internet 18 GB", desc: "Masa Aktif 28 Hari", price: "Rp 52.000" },
  { id: 91, category: "Indosat", name: "Freedom Internet 20 GB", desc: "Masa Aktif 28 Hari", price: "Rp 57.000" },
  { id: 92, category: "Indosat", name: "Freedom Internet 21 GB", desc: "Masa Aktif 28 Hari", price: "Rp 76.000" },
  { id: 93, category: "Indosat", name: "Freedom Internet 22 GB", desc: "Masa Aktif 28 Hari", price: "Rp 57.000" },
  { id: 94, category: "Indosat", name: "Freedom Internet 23 GB", desc: "Masa Aktif 30 Hari", price: "Rp 77.000" },
  { id: 95, category: "Indosat", name: "Freedom Internet 24 GB", desc: "Masa Aktif 28 Hari", price: "Rp 64.000" },
  { id: 96, category: "Indosat", name: "Freedom Internet 25 GB", desc: "Masa Aktif 28 Hari", price: "Rp 74.000" },
  { id: 97, category: "Indosat", name: "Freedom Internet 28 GB", desc: "Masa Aktif 28 Hari", price: "Rp 67.000" },
  { id: 98, category: "Indosat", name: "Freedom Internet 30 GB", desc: "Masa Aktif 28 Hari", price: "Rp 63.000" },
  { id: 99, category: "Indosat", name: "Freedom Internet 32 GB", desc: "Masa Aktif 30 Hari", price: "Rp 93.000" },
  { id: 100, category: "Indosat", name: "Freedom Internet 33 GB", desc: "Masa Aktif 30 Hari", price: "Rp 93.000" },
  { id: 101, category: "Indosat", name: "Freedom Internet 35 GB", desc: "Masa Aktif 28 Hari", price: "Rp 74.000" },
  { id: 102, category: "Indosat", name: "Freedom Internet 40 GB", desc: "Masa Aktif 28 Hari", price: "Rp 74.000" },
  { id: 103, category: "Indosat", name: "Freedom Internet 42 GB", desc: "Masa Aktif 28 Hari", price: "Rp 90.000" },
  { id: 104, category: "Indosat", name: "Freedom Internet 43 GB", desc: "Masa Aktif 30 Hari", price: "Rp 92.000" },
  { id: 105, category: "Indosat", name: "Freedom Internet 44 GB", desc: "Masa Aktif 28 Hari", price: "Rp 91.000" },
  { id: 106, category: "Indosat", name: "Freedom Internet 45 GB", desc: "Masa Aktif 28 Hari", price: "Rp 92.000" },
  { id: 107, category: "Indosat", name: "Freedom Internet Sensasi 50 GB", desc: "Masa Aktif 28 Hari", price: "Rp 91.000" },
  { id: 108, category: "Indosat", name: "Freedom Internet 52 GB", desc: "Masa Aktif 28 Hari", price: "Rp 97.000" },
  { id: 109, category: "Indosat", name: "Freedom Internet 55 GB", desc: "Masa Aktif 28 Hari", price: "Rp 92.000" },
  { id: 110, category: "Indosat", name: "Freedom Internet 60 GB", desc: "Masa Aktif 28 Hari", price: "Rp 94.000" },
  { id: 111, category: "Indosat", name: "Freedom Internet 62 GB", desc: "Masa Aktif 28 Hari", price: "Rp 95.000" },
  { id: 112, category: "Indosat", name: "Freedom Internet 65 GB", desc: "Masa Aktif 28 Hari", price: "Rp 92.000" },
  { id: 113, category: "Indosat", name: "Freedom Internet 70 GB", desc: "Masa Aktif 28 Hari", price: "Rp 116.000" },
  { id: 114, category: "Indosat", name: "Freedom Internet 80 GB", desc: "Masa Aktif 28 Hari", price: "Rp 121.000" },
  { id: 115, category: "Indosat", name: "Freedom Internet 90 GB", desc: "Masa Aktif 28 Hari", price: "Rp 141.000" },
  { id: 116, category: "Indosat", name: "Freedom Internet Sensasi 100 GB", desc: "Masa Aktif 28 Hari", price: "Rp 110.000" },
  { id: 117, category: "Indosat", name: "Freedom Internet 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 121.000" },
  { id: 118, category: "Indosat", name: "Freedom Internet 100 GB", desc: "Masa Aktif 90 Hari", price: "Rp 247.000" },
  { id: 119, category: "Indosat", name: "Freedom Internet 120 GB", desc: "Masa Aktif 28 Hari", price: "Rp 143.000" },
  { id: 120, category: "Indosat", name: "Freedom Internet 125 GB", desc: "Masa Aktif 28 Hari", price: "Rp 130.000" },
  { id: 121, category: "Indosat", name: "Freedom Internet Sensasi 150 GB", desc: "Masa Aktif 28 Hari", price: "Rp 128.000" },
  { id: 122, category: "Indosat", name: "Freedom Internet 150 GB", desc: "Masa Aktif 28 Hari", price: "Rp 134.000" },
  { id: 123, category: "Indosat", name: "Freedom Internet 160 GB", desc: "Masa Aktif 28 Hari", price: "Rp 177.000" },
  { id: 124, category: "Indosat", name: "Freedom Internet 165 GB", desc: "Masa Aktif 28 Hari", price: "Rp 198.000" },
  { id: 125, category: "Indosat", name: "Freedom Internet Sensasi 200 GB", desc: "Masa Aktif 28 Hari", price: "Rp 174.000" },
  { id: 126, category: "Indosat", name: "Freedom Internet 250 GB", desc: "Masa Aktif 28 Hari", price: "Rp 176.000" },
  { id: 127, category: "Indosat", name: "Freedom Internet 300 GB", desc: "Masa Aktif 30 Hari", price: "Rp 154.000" },
  { id: 128, category: "Indosat", name: "Freedom Internet 350 GB", desc: "Masa Aktif 28 Hari", price: "Rp 204.000" },
  { id: 129, category: "Indosat", name: "Freedom Internet 365 GB", desc: "Masa Aktif 360 Hari", price: "Rp 622.000" },
  { id: 130, category: "Indosat", name: "Freedom Internet 1024 GB", desc: "Masa Aktif 360 Hari", price: "Rp 896.000" },
  { id: 131, category: "Indosat", name: "Freedom Combo 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 33.000" },
  { id: 132, category: "Indosat", name: "Freedom Combo 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 52.000" },
  { id: 133, category: "Indosat", name: "Freedom Combo 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 57.000" },
  { id: 134, category: "Indosat", name: "Freedom Combo 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 76.000" },
  { id: 135, category: "Indosat", name: "Freedom Combo 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 91.000" },

  // --- XL & AXIS ---
  { id: 136, category: "XL & Axis", name: "Data 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 10.000" },
  { id: 137, category: "XL & Axis", name: "Data 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 18.000" },
  { id: 138, category: "XL & Axis", name: "Data 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 18.000" },
  { id: 139, category: "XL & Axis", name: "Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.000" },
  { id: 140, category: "XL & Axis", name: "Data 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 40.000" },
  { id: 141, category: "XL & Axis", name: "Data 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 55.000" },
  { id: 142, category: "XL & Axis", name: "Data 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.000" },
  { id: 143, category: "XL & Axis", name: "Data 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 70.000" },
  { id: 144, category: "XL & Axis", name: "Data 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 77.000" },
  { id: 145, category: "XL & Axis", name: "Data 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 55.000" },
  { id: 146, category: "XL & Axis", name: "Data 140 GB", desc: "Masa Aktif 28 Hari", price: "Rp 145.000" },
  { id: 147, category: "XL & Axis", name: "OWSEM 1 GB + 1 GB 4G", desc: "Masa Aktif 30 Hari", price: "Rp 21.000" },
  { id: 148, category: "XL & Axis", name: "OWSEM 1 GB + 3 GB 4G", desc: "Masa Aktif 30 Hari", price: "Rp 33.000" },
  { id: 149, category: "XL & Axis", name: "OWSEM 2 GB + 6 GB 4G", desc: "Masa Aktif 30 Hari", price: "Rp 50.000" },
  { id: 150, category: "XL & Axis", name: "OWSEM 3 GB + 9 GB 4G", desc: "Masa Aktif 30 Hari", price: "Rp 66.000" },
  { id: 151, category: "XL & Axis", name: "OWSEM 16 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 44.000" },
  { id: 152, category: "XL & Axis", name: "OWSEM 24 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 45.000" },
  { id: 153, category: "XL & Axis", name: "OWSEM 32 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 52.000" },
  { id: 154, category: "XL & Axis", name: "OWSEM 40 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 64.000" },
  { id: 155, category: "XL & Axis", name: "OWSEM 48 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 65.000" },
  { id: 156, category: "XL & Axis", name: "OWSEM 64 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 79.000" },
  { id: 157, category: "XL & Axis", name: "OWSEM 80 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 100.000" },
  { id: 158, category: "XL & Axis", name: "OWSEM 120 GB + Unlimited Game", desc: "Masa Aktif 30 Hari", price: "Rp 97.000" },
  { id: 159, category: "XL & Axis", name: "Data BRONET 10 GB", desc: "Masa Aktif 60 Hari", price: "Rp 88.000" },
  { id: 160, category: "XL & Axis", name: "Data BRONET 12 GB", desc: "Masa Aktif 60 Hari", price: "Rp 97.000" },
  { id: 161, category: "XL & Axis", name: "Data BRONET 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 64.000" },
  { id: 162, category: "XL & Axis", name: "Data BRONET 18 GB", desc: "Masa Aktif 28 Hari", price: "Rp 66.000" },
  { id: 163, category: "XL & Axis", name: "Data BRONET 20 GB", desc: "Masa Aktif 28 Hari", price: "Rp 62.000" },
  { id: 164, category: "XL & Axis", name: "Data BRONET 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.000" },
  { id: 165, category: "XL & Axis", name: "Data BRONET 21 GB", desc: "Masa Aktif 28 Hari", price: "Rp 61.000" },
  { id: 166, category: "XL & Axis", name: "Data BRONET 22 GB", desc: "Masa Aktif 28 Hari", price: "Rp 62.000" },
  { id: 167, category: "XL & Axis", name: "Data BRONET 24 GB", desc: "Masa Aktif 28 Hari", price: "Rp 67.000" },
  { id: 168, category: "XL & Axis", name: "Data BRONET 26 GB", desc: "Masa Aktif 28 Hari", price: "Rp 62.000" },
  { id: 169, category: "XL & Axis", name: "Data BRONET 30 GB", desc: "Masa Aktif 14 Hari", price: "Rp 65.000" },
  { id: 170, category: "XL & Axis", name: "Data BRONET 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 76.000" },
  { id: 171, category: "XL & Axis", name: "Data BRONET 30 GB", desc: "Masa Aktif 28 Hari", price: "Rp 81.000" },
  { id: 172, category: "XL & Axis", name: "Data BRONET 32 GB", desc: "Masa Aktif 28 Hari", price: "Rp 75.000" },
  { id: 173, category: "XL & Axis", name: "Data BRONET 35 GB", desc: "Masa Aktif 28 Hari", price: "Rp 76.000" },
  { id: 174, category: "XL & Axis", name: "Data BRONET 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 101.000" },
  { id: 175, category: "XL & Axis", name: "Data BRONET 36 GB", desc: "Masa Aktif 14 Hari", price: "Rp 60.000" },
  { id: 176, category: "XL & Axis", name: "Data BRONET 40 GB", desc: "Masa Aktif 28 Hari", price: "Rp 94.000" },
  { id: 177, category: "XL & Axis", name: "Data BRONET 5G 40 GB", desc: "Masa Aktif 28 Hari", price: "Rp 104.000" },
  { id: 178, category: "XL & Axis", name: "Data BRONET 48 GB", desc: "Masa Aktif 14 Hari", price: "Rp 70.000" },
  { id: 179, category: "XL & Axis", name: "Data BRONET 60 GB", desc: "Masa Aktif 28 Hari", price: "Rp 98.000" },
  { id: 180, category: "XL & Axis", name: "Data BRONET 65 GB", desc: "Masa Aktif 28 Hari", price: "Rp 98.000" },
  { id: 181, category: "XL & Axis", name: "Xtra Combo 2+4 GB (6 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 33.000" },
  { id: 182, category: "XL & Axis", name: "Xtra Combo Special 14 GB (14 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 50.000" },
  { id: 183, category: "XL & Axis", name: "Xtra Combo 5+10 GB (15 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 61.000" },
  { id: 184, category: "XL & Axis", name: "Xtra Combo VIP 5+10 GB (15 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 70.000" },
  { id: 185, category: "XL & Axis", name: "Xtra Combo 10+20 GB (30 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 90.000" },
  { id: 186, category: "XL & Axis", name: "Xtra Combo VIP 10+20 GB (30 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 99.000" },
  { id: 187, category: "XL & Axis", name: "Xtra Combo 15+30 GB (45 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 126.000" },
  { id: 188, category: "XL & Axis", name: "Xtra Combo VIP 15+30 GB (45 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 131.000" },
  { id: 189, category: "XL & Axis", name: "Xtra Combo 20+40 GB (60 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 175.000" },
  { id: 190, category: "XL & Axis", name: "Xtra Combo VIP 20+40 GB (60 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 176.000" },
  { id: 191, category: "XL & Axis", name: "Xtra Combo 35+70 GB (105 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 232.000" },
  { id: 192, category: "XL & Axis", name: "Data FLEX 7 GB (7 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 34.000" },
  { id: 193, category: "XL & Axis", name: "Data FLEX 13 GB (13 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 48.000" },
  { id: 194, category: "XL & Axis", name: "Data FLEX 19 GB (19 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 57.000" },
  { id: 195, category: "XL & Axis", name: "Data FLEX 26 GB (26 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 65.000" },
  { id: 196, category: "XL & Axis", name: "Data FLEX 34 GB (34 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 76.000" },
  { id: 197, category: "XL & Axis", name: "FLEX S 4GB NAS + Local + 5Mnt Nelp All (4 GB)", desc: "Masa Aktif 14 Hari", price: "Rp 27.000" },
  { id: 198, category: "XL & Axis", name: "FLEX S 3.5GB NAS + Local + 5Mnt Nelp All (3.5 GB)", desc: "Masa Aktif 21 Hari", price: "Rp 31.000" },
  { id: 199, category: "XL & Axis", name: "FLEX S 3.5GB NAS + Local + 5Mnt Nelp All (3.5 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 36.000" },
  { id: 200, category: "XL & Axis", name: "FLEX S 7GB NAS (7 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 36.000" },
  { id: 201, category: "XL & Axis", name: "Promo FlexMax Spesial 10GB P1 (10 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 36.000" },
  { id: 202, category: "XL & Axis", name: "FLEX S 7GB NAS + Local + 5Mnt Nelp All (7 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 37.000" },
  { id: 203, category: "XL & Axis", name: "Promo FlexMax Spesial 15GB P1 (15 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 46.000" },
  { id: 204, category: "XL & Axis", name: "Promo FlexMax Spesial 20GB P1 (20 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 50.000" },
  { id: 205, category: "XL & Axis", name: "FLEX M 10GB NAS + Local + 5Mnt Nelp All (10 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 53.000" },
  { id: 206, category: "XL & Axis", name: "Promo FlexMax Spesial 25GB P1 (25 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 59.000" },
  { id: 207, category: "XL & Axis", name: "FLEX M+ 14GB NAS + Local + 5Mnt Nelp All (14 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 63.000" },
  { id: 208, category: "XL & Axis", name: "FLEX L 18GB NAS + Local + 5Mnt Nelp All (18 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 71.000" },
  { id: 209, category: "XL & Axis", name: "Promo FlexMax Spesial 37GB P1 (37 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 74.000" },
  { id: 210, category: "XL & Axis", name: "FLEX L+ 26GB NAS + Local + 5Mnt Nelp All (26 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 87.000" },
  { id: 211, category: "XL & Axis", name: "FLEX XL 32GB NAS + Local + 5Mnt Nelp All (32 GB)", desc: "Masa Aktif 21 Hari", price: "Rp 108.000" },
  { id: 212, category: "XL & Axis", name: "FLEX XL 32GB NAS + Local + 5Mnt Nelp All (32 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 108.000" },
  { id: 213, category: "XL & Axis", name: "FLEX XXL 55GB NAS + Local + 5Mnt Nelp All (55 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 145.000" },
  { id: 214, category: "XL & Axis", name: "FLEX XXXL 120GB NAS + Local + 5Mnt Nelp All (120 GB)", desc: "Masa Aktif 28 Hari", price: "Rp 167.000" },
  { id: 215, category: "XL & Axis", name: "AKRAB Super Mini Area 1 (13 - 15 GB)", desc: "Masa Aktif -", price: "Rp 51.000" },
  { id: 216, category: "XL & Axis", name: "AKRAB Super Mini Area 2 (15 - 17 GB)", desc: "Masa Aktif -", price: "Rp 51.000" },
  { id: 217, category: "XL & Axis", name: "AKRAB Super Mini Area 3 (20 - 22 GB)", desc: "Masa Aktif -", price: "Rp 51.000" },
  { id: 218, category: "XL & Axis", name: "AKRAB Super Mini Area 4 (30 - 32 GB)", desc: "Masa Aktif -", price: "Rp 51.000" },
  { id: 219, category: "XL & Axis", name: "AKRAB Mini Area 1 (32 - 35 GB)", desc: "Masa Aktif -", price: "Rp 65.000" },
  { id: 220, category: "XL & Axis", name: "AKRAB Mini Area 2 (35 - 37 GB)", desc: "Masa Aktif -", price: "Rp 65.000" },
  { id: 221, category: "XL & Axis", name: "AKRAB Mini Area 3 (39 - 41 GB)", desc: "Masa Aktif -", price: "Rp 65.000" },
  { id: 222, category: "XL & Axis", name: "AKRAB Mini Area 4 (49 - 51 GB)", desc: "Masa Aktif -", price: "Rp 65.000" },
  { id: 223, category: "XL & Axis", name: "AKRAB Big Area 1 (38 - 40 GB)", desc: "Masa Aktif -", price: "Rp 70.000" },
  { id: 224, category: "XL & Axis", name: "AKRAB Big Area 2 (40 - 42 GB)", desc: "Masa Aktif -", price: "Rp 70.000" },
  { id: 225, category: "XL & Axis", name: "AKRAB Big Area 3 (45 - 47 GB)", desc: "Masa Aktif -", price: "Rp 70.000" },
  { id: 226, category: "XL & Axis", name: "AKRAB Big Area 4 (55 - 57 GB)", desc: "Masa Aktif -", price: "Rp 70.000" },
  { id: 227, category: "XL & Axis", name: "AKRAB Jumbo V2 Area 1 (50 - 52 GB)", desc: "Masa Aktif -", price: "Rp 79.000" },
  { id: 228, category: "XL & Axis", name: "AKRAB Jumbo V2 Area 2 (52 - 54 GB)", desc: "Masa Aktif -", price: "Rp 79.000" },
  { id: 229, category: "XL & Axis", name: "AKRAB Jumbo V2 Area 3 (57 - 59 GB)", desc: "Masa Aktif -", price: "Rp 79.000" },
  { id: 230, category: "XL & Axis", name: "AKRAB Jumbo V2 Area 4 (67 - 69 GB)", desc: "Masa Aktif -", price: "Rp 79.000" },
  { id: 231, category: "XL & Axis", name: "AKRAB Jumbo New Area 1 (63 - 65 GB)", desc: "Masa Aktif -", price: "Rp 88.000" },
  { id: 232, category: "XL & Axis", name: "AKRAB Jumbo New Area 2 (65 - 67 GB)", desc: "Masa Aktif -", price: "Rp 88.000" },
  { id: 233, category: "XL & Axis", name: "AKRAB Jumbo New Area 3 (70 - 72 GB)", desc: "Masa Aktif -", price: "Rp 88.000" },
  { id: 234, category: "XL & Axis", name: "AKRAB Jumbo New Area 4 (80 - 82 GB)", desc: "Masa Aktif -", price: "Rp 88.000" },
  { id: 235, category: "XL & Axis", name: "AKRAB Jumbo M Area 1 (69 - 71 GB)", desc: "Masa Aktif -", price: "Rp 93.000" },
  { id: 236, category: "XL & Axis", name: "AKRAB Jumbo M Area 2 (71 - 73 GB)", desc: "Masa Aktif -", price: "Rp 93.000" },
  { id: 237, category: "XL & Axis", name: "AKRAB Jumbo M Area 3 (76 - 78 GB)", desc: "Masa Aktif -", price: "Rp 93.000" },
  { id: 238, category: "XL & Axis", name: "AKRAB Jumbo M Area 4 (86 - 88 GB)", desc: "Masa Aktif -", price: "Rp 93.000" },
  { id: 239, category: "XL & Axis", name: "AKRAB Megabig Area 1 (88 - 90 GB)", desc: "Masa Aktif -", price: "Rp 107.000" },
  { id: 240, category: "XL & Axis", name: "AKRAB Megabig Area 2 (90 - 92 GB)", desc: "Masa Aktif -", price: "Rp 107.000" },
  { id: 241, category: "XL & Axis", name: "AKRAB Megabig Area 3 (95 - 97 GB)", desc: "Masa Aktif -", price: "Rp 107.000" },
  { id: 242, category: "XL & Axis", name: "AKRAB Megabig Area 4 (105 - 107 GB)", desc: "Masa Aktif -", price: "Rp 107.000" },

  // --- SMARTFREN ---
  { id: 243, category: "Smartfren", name: "Data 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 44.000" },
  { id: 244, category: "Smartfren", name: "Data 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 44.000" },
  { id: 245, category: "Smartfren", name: "Data 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.000" },
  { id: 246, category: "Smartfren", name: "Data 19 GB", desc: "Masa Aktif 30 Hari", price: "Rp 96.000" },
  { id: 247, category: "Smartfren", name: "Data 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 76.000" },
  { id: 248, category: "Smartfren", name: "Data 32 GB", desc: "Masa Aktif 30 Hari", price: "Rp 77.000" },
  { id: 249, category: "Smartfren", name: "Data 40 GB", desc: "Masa Aktif 14 Hari", price: "Rp 66.000" },
  { id: 250, category: "Smartfren", name: "Data 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 102.000" },
  { id: 251, category: "Smartfren", name: "Data 66 GB", desc: "Masa Aktif 28 Hari", price: "Rp 104.000" },
  { id: 252, category: "Smartfren", name: "Data 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 124.000" },
  { id: 253, category: "Smartfren", name: "Data Unlimited Harian 500 MB", desc: "Masa Aktif 28 Hari", price: "Rp 82.000" },
  { id: 254, category: "Smartfren", name: "Data Unlimited Harian 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 83.000" },
  { id: 255, category: "Smartfren", name: "Data Unlimited Harian 2 GB", desc: "Masa Aktif 28 Hari", price: "Rp 94.000" },
  { id: 256, category: "Smartfren", name: "Data Unlimited Harian 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 94.000" },
  { id: 257, category: "Smartfren", name: "Data Unlimited Harian 3 GB", desc: "Masa Aktif 28 Hari", price: "Rp 120.000" },
  { id: 258, category: "Smartfren", name: "Data Unlimited Harian 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 125.000" },
  { id: 259, category: "Smartfren", name: "Data Unlimited Harian 4 GB", desc: "Masa Aktif 28 Hari", price: "Rp 145.000" },
  { id: 260, category: "Smartfren", name: "Data Unlimited Harian 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 174.000" },
  { id: 261, category: "Smartfren", name: "Data Unlimited Harian 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 198.000" },
  { id: 262, category: "Smartfren", name: "Data Nonton 4 GB + Utama 6 GB + Viu Premium", desc: "Masa Aktif 30 Hari", price: "Rp 51.000" },
  { id: 263, category: "Smartfren", name: "Data Kuota 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 35.000" },
  { id: 264, category: "Smartfren", name: "Data Kuota 17 GB", desc: "Masa Aktif 14 Hari", price: "Rp 40.000" },
  { id: 265, category: "Smartfren", name: "Data Kuota 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.000" },
  { id: 266, category: "Smartfren", name: "Data Kuota 25 GB", desc: "Masa Aktif 7 Hari", price: "Rp 42.000" },
  { id: 267, category: "Smartfren", name: "Data Kuota 40 GB", desc: "Masa Aktif 14 Hari", price: "Rp 66.000" },
  { id: 268, category: "Smartfren", name: "Data Kuota 50 GB", desc: "Masa Aktif 14 Hari", price: "Rp 66.000" },
  { id: 269, category: "Smartfren", name: "Data Kuota 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 100.000" },
  { id: 270, category: "Smartfren", name: "Data Kuota 57 GB", desc: "Masa Aktif 30 Hari", price: "Rp 104.000" },
  { id: 271, category: "Smartfren", name: "Data Kuota 66 GB", desc: "Masa Aktif 28 Hari", price: "Rp 102.000" },
  { id: 272, category: "Smartfren", name: "Data Kuota 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 110.000" },
  { id: 273, category: "Smartfren", name: "Data Kuota 150 GB", desc: "Masa Aktif 28 Hari", price: "Rp 143.000" },
  { id: 274, category: "Smartfren", name: "Data Kuota 5G 175 GB", desc: "Masa Aktif 28 Hari", price: "Rp 177.000" },
  { id: 275, category: "Smartfren", name: "Data Kuota 200 GB", desc: "Masa Aktif 28 Hari", price: "Rp 201.000" },
  { id: 276, category: "Smartfren", name: "Data Kuota 200 GB", desc: "Masa Aktif 30 Hari", price: "Rp 196.000" },
  { id: 277, category: "Smartfren", name: "Data Kuota 250 GB", desc: "Masa Aktif 28 Hari", price: "Rp 194.000" },
  { id: 278, category: "Smartfren", name: "Data Kuota 5G 250 GB", desc: "Masa Aktif 28 Hari", price: "Rp 252.000" },
  { id: 279, category: "Smartfren", name: "Data Kuota 300 GB", desc: "Masa Aktif 28 Hari", price: "Rp 261.000" },
  { id: 280, category: "Smartfren", name: "Data Kuota 5G 350 GB", desc: "Masa Aktif 28 Hari", price: "Rp 351.000" },
  { id: 281, category: "Smartfren", name: "Data Kuota 500 GB", desc: "Masa Aktif 28 Hari", price: "Rp 400.000" },
  { id: 282, category: "Smartfren", name: "Data Kuota M (14 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 46.000" },
  { id: 283, category: "Smartfren", name: "Data Kuota L (24 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 65.000" },
  { id: 284, category: "Smartfren", name: "Data Kuota 2L (45 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 86.000" },
  { id: 285, category: "Smartfren", name: "Data Kuota 3L (85 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 132.000" },
  { id: 286, category: "Smartfren", name: "Data Kuota 4L (125 GB)", desc: "Masa Aktif 30 Hari", price: "Rp 141.000" }
];

export default function LandingPage() {
  const whatsappNumber = "6285967096912";
  
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeType, setActiveType] = useState("Semua Tipe");
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState("Default");

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
    if (n.includes('aon') || n.includes('alwayson')) return 'AlwaysOn';
    if (n.includes('happy')) return 'Happy';
    if (n.includes('bronet')) return 'BRONET';
    if (n.includes('owsem')) return 'OWSEM';
    if (n.includes('combo')) return 'Combo';
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

  let displayProducts = activeCategory === "Semua" 
    ? [...products] 
    : products.filter(item => item.category === activeCategory);

  if (activeType !== "Semua Tipe") {
    displayProducts = displayProducts.filter(p => getPackageType(p.name) === activeType);
  }

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
      ? finalProducts.push({ id: "master-akrab", category: "XL & Axis", name: "Paket Keluarga AKRAB", desc: "Pilih Ukuran Kuota", price: "Mulai Rp 51.000", icon: "👪", isGroup: true, variants: akrabGroup })
      : finalProducts.unshift({ id: "master-akrab", category: "XL & Axis", name: "Paket Keluarga AKRAB", desc: "Pilih Ukuran Kuota", price: "Mulai Rp 51.000", icon: "👪", isGroup: true, variants: akrabGroup });
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-blue-600">ARWANI D'GABRIEL <span className="text-slate-400">STORE</span></h1>
          <a href={getWaLink("Informasi Umum")} target="_blank" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-blue-700 transition">Hubungi Admin</a>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Solusi Kebutuhan Digital <br/> <span className="text-blue-600">Cepat, Murah, Terpercaya.</span>
        </h2>
      </section>

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

      <footer className="py-10 text-center text-slate-400 text-sm bg-blue-900 text-white">
        <p>© 2026 Arwani D'Gabriel Store. Pelayanan sepenuh hati.</p>
      </footer>
    </div>
  );
}