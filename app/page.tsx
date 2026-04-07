"use client";

import React, { useState } from 'react';

// 1. DAFTAR KATEGORI
const categories = ["Semua", "Telkomsel", "Indosat", "XL & Axis", "Tri", "Smartfren"];

// 2. DAFTAR PRODUK (Sudah Update Harga & Kuota AKRAB Terbaru)
const products = [
  { id: 1, category: "Telkomsel", name: "Data Flash 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 109.618", icon: "🔴" },
  { id: 2, category: "Telkomsel", name: "Data Flash 49 GB", desc: "Masa Aktif 30 Hari", price: "Rp 113.595", icon: "🔴" },
  { id: 3, category: "Telkomsel", name: "Data Flash 40 GB", desc: "Masa Aktif 30 Hari", price: "Rp 98.613", icon: "🔴" },
  { id: 4, category: "Telkomsel", name: "Data Flash 35 GB", desc: "Masa Aktif 30 Hari", price: "Rp 93.610", icon: "🔴" },
  { id: 5, category: "Telkomsel", name: "Data Flash 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 92.610", icon: "🔴" },
  { id: 6, category: "Telkomsel", name: "Data Flash 25 GB", desc: "Masa Aktif 30 Hari", price: "Rp 91.610", icon: "🔴" },
  { id: 7, category: "Telkomsel", name: "Data Flash 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.610", icon: "🔴" },
  { id: 8, category: "Telkomsel", name: "Data Flash 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 86.610", icon: "🔴" },
  { id: 9, category: "Telkomsel", name: "Data Flash 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 84.610", icon: "🔴" },
  { id: 10, category: "Telkomsel", name: "Data Flash 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 83.610", icon: "🔴" },
  { id: 11, category: "Telkomsel", name: "Data Flash 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 82.610", icon: "🔴" },
  { id: 12, category: "Telkomsel", name: "Data Flash 13 GB", desc: "Masa Aktif 30 Hari", price: "Rp 81.610", icon: "🔴" },
  { id: 13, category: "Telkomsel", name: "Data Flash 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 80.610", icon: "🔴" },
  { id: 14, category: "Telkomsel", name: "Data Flash 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 78.610", icon: "🔴" },
  { id: 15, category: "Telkomsel", name: "Data Flash 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 77.610", icon: "🔴" },
  { id: 16, category: "Telkomsel", name: "Data Flash 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 75.610", icon: "🔴" },
  { id: 17, category: "Telkomsel", name: "Data Flash 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 73.610", icon: "🔴" },
  { id: 18, category: "Telkomsel", name: "Data Flash 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 69.610", icon: "🔴" },
  { id: 19, category: "Telkomsel", name: "Data Flash 6.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 68.610", icon: "🔴" },
  { id: 20, category: "Telkomsel", name: "Data Flash 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 66.610", icon: "🔴" },
  { id: 21, category: "Telkomsel", name: "Data Flash 5.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 64.610", icon: "🔴" },
  { id: 22, category: "Telkomsel", name: "Data Flash 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.610", icon: "🔴" },
  { id: 23, category: "Telkomsel", name: "Data Flash 4.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 59.610", icon: "🔴" },
  { id: 24, category: "Telkomsel", name: "Data Flash 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 58.610", icon: "🔴" },
  { id: 25, category: "Telkomsel", name: "Data Flash 3.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 55.610", icon: "🔴" },
  { id: 26, category: "Telkomsel", name: "Data Flash 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 51.610", icon: "🔴" },
  { id: 27, category: "Telkomsel", name: "Data Flash 2.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 49.610", icon: "🔴" },
  { id: 28, category: "Telkomsel", name: "Data Flash 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 45.610", icon: "🔴" },
  { id: 29, category: "Telkomsel", name: "Data Flash 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 39.610", icon: "🔴" },
  { id: 30, category: "Telkomsel", name: "Data Flash 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 33.610", icon: "🔴" },
  { id: 31, category: "Telkomsel", name: "Paket Data 12.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 43.000", icon: "🔴" },
  { id: 32, category: "Telkomsel", name: "Paket Data 25 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.500", icon: "🔴" },
  { id: 33, category: "Telkomsel", name: "Paket Data 45 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.000", icon: "🔴" },
  { id: 34, category: "Tri", name: "AON 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 15.000", icon: "⚫" },
  { id: 35, category: "Tri", name: "AON 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 18.000", icon: "⚫" },
  { id: 36, category: "Tri", name: "AON 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 26.500", icon: "⚫" },
  { id: 37, category: "Tri", name: "AON 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 37.000", icon: "⚫" },
  { id: 38, category: "Tri", name: "BM 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 14.500", icon: "⚫" },
  { id: 39, category: "Tri", name: "BM 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 40, category: "Tri", name: "BM 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.500", icon: "⚫" },
  { id: 41, category: "Tri", name: "BM 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 34.000", icon: "⚫" },
  { id: 42, category: "Tri", name: "Bima 3GB", desc: "Masa Aktif 30 Hari", price: "Rp 35.000", icon: "⚫" },
  { id: 43, category: "Tri", name: "CINTA 6", desc: "Masa Aktif 30 Hari", price: "Rp 40.500", icon: "⚫" },
  { id: 44, category: "Tri", name: "Data 1 GB", desc: "Masa Aktif 1 Hari", price: "Rp 3.500", icon: "⚫" },
  { id: 45, category: "Tri", name: "Data 2 GB", desc: "Masa Aktif 1 Hari", price: "Rp 4.500", icon: "⚫" },
  { id: 46, category: "Tri", name: "Data 3 GB", desc: "Masa Aktif 1 Hari", price: "Rp 5.500", icon: "⚫" },
  { id: 47, category: "Tri", name: "Data 4 GB", desc: "Masa Aktif 1 Hari", price: "Rp 6.500", icon: "⚫" },
  { id: 48, category: "Tri", name: "Data 2.5 GB", desc: "Masa Aktif 1 Hari", price: "Rp 5.000", icon: "⚫" },
  { id: 49, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 1 Hari", price: "Rp 7.500", icon: "⚫" },
  { id: 50, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 1 Hari", price: "Rp 8.500", icon: "⚫" },
  { id: 51, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 1 Hari", price: "Rp 11.500", icon: "⚫" },
  { id: 52, category: "Tri", name: "Data 2 GB", desc: "Masa Aktif 3 Hari", price: "Rp 9.500", icon: "⚫" },
  { id: 53, category: "Tri", name: "Data 3 GB", desc: "Masa Aktif 3 Hari", price: "Rp 10.500", icon: "⚫" },
  { id: 54, category: "Tri", name: "Data 4 GB", desc: "Masa Aktif 3 Hari", price: "Rp 11.500", icon: "⚫" },
  { id: 55, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 3 Hari", price: "Rp 12.500", icon: "⚫" },
  { id: 56, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 3 Hari", price: "Rp 13.500", icon: "⚫" },
  { id: 57, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 3 Hari", price: "Rp 16.500", icon: "⚫" },
  { id: 58, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 5 Hari", price: "Rp 15.500", icon: "⚫" },
  { id: 59, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 5 Hari", price: "Rp 16.500", icon: "⚫" },
  { id: 60, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 5 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 61, category: "Tri", name: "Data 15 GB", desc: "Masa Aktif 5 Hari", price: "Rp 24.500", icon: "⚫" },
  { id: 62, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 7 Hari", price: "Rp 17.500", icon: "⚫" },
  { id: 63, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 7 Hari", price: "Rp 18.500", icon: "⚫" },
  { id: 64, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 7 Hari", price: "Rp 21.500", icon: "⚫" },
  { id: 65, category: "Tri", name: "Data 15 GB", desc: "Masa Aktif 7 Hari", price: "Rp 26.500", icon: "⚫" },
  { id: 66, category: "Tri", name: "Data 5 GB", desc: "Masa Aktif 10 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 67, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 10 Hari", price: "Rp 20.500", icon: "⚫" },
  { id: 68, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 10 Hari", price: "Rp 23.500", icon: "⚫" },
  { id: 69, category: "Tri", name: "Data 15 GB", desc: "Masa Aktif 10 Hari", price: "Rp 28.500", icon: "⚫" },
  { id: 70, category: "Tri", name: "Data 1.5 GB", desc: "Masa Aktif 14 Hari", price: "Rp 16.000", icon: "⚫" },
  { id: 71, category: "Tri", name: "Data 15 GB", desc: "Masa Aktif 14 Hari", price: "Rp 32.500", icon: "⚫" },
  { id: 72, category: "Tri", name: "Data 24 GB", desc: "Masa Aktif 14 Hari", price: "Rp 46.500", icon: "⚫" },
  { id: 73, category: "Tri", name: "Data 30 GB", desc: "Masa Aktif 14 Hari", price: "Rp 54.500", icon: "⚫" },
  { id: 74, category: "Tri", name: "Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 75, category: "Tri", name: "Data 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.500", icon: "⚫" },
  { id: 76, category: "Tri", name: "Data 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 28.500", icon: "⚫" },
  { id: 77, category: "Tri", name: "Data 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 33.500", icon: "⚫" },
  { id: 78, category: "Tri", name: "Data 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 40.500", icon: "⚫" },
  { id: 79, category: "Tri", name: "Data 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 45.000", icon: "⚫" },
  { id: 80, category: "Tri", name: "Data 24 GB", desc: "Masa Aktif 30 Hari", price: "Rp 56.500", icon: "⚫" },
  { id: 81, category: "Tri", name: "Data 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 63.500", icon: "⚫" },
  { id: 82, category: "Tri", name: "Data 32 GB", desc: "Masa Aktif 30 Hari", price: "Rp 68.500", icon: "⚫" },
  { id: 83, category: "Tri", name: "Data 45 GB", desc: "Masa Aktif 30 Hari", price: "Rp 83.500", icon: "⚫" },
  { id: 84, category: "Tri", name: "Data 65 GB", desc: "Masa Aktif 30 Hari", price: "Rp 103.000", icon: "⚫" },
  { id: 85, category: "Tri", name: "Data 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 132.500", icon: "⚫" },
  { id: 86, category: "Tri", name: "Data 150 GB", desc: "Masa Aktif 30 Hari", price: "Rp 161.000", icon: "⚫" },
  { id: 87, category: "Tri", name: "Getmore 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 25.500", icon: "⚫" },
  { id: 88, category: "Tri", name: "Getmore 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 35.500", icon: "⚫" },
  { id: 89, category: "Tri", name: "Getmore 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 45.500", icon: "⚫" },
  { id: 90, category: "Tri", name: "Happy 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 13.500", icon: "⚫" },
  { id: 91, category: "Tri", name: "Happy 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 17.500", icon: "⚫" },
  { id: 92, category: "Tri", name: "Happy 4.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 19.500", icon: "⚫" },
  { id: 93, category: "Tri", name: "Happy 5.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.500", icon: "⚫" },
  { id: 94, category: "Tri", name: "Happy 7 GB", desc: "Masa Aktif 30 Hari", price: "Rp 27.500", icon: "⚫" },
  { id: 95, category: "Tri", name: "Happy 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 29.500", icon: "⚫" },
  { id: 96, category: "Tri", name: "Happy 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 31.500", icon: "⚫" },
  { id: 97, category: "Tri", name: "Happy 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 38.500", icon: "⚫" },
  { id: 98, category: "Tri", name: "Happy 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 41.500", icon: "⚫" },
  { id: 99, category: "Tri", name: "Happy 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 50.500", icon: "⚫" },
  { id: 100, category: "Tri", name: "LTE 32 GB", desc: "Masa Aktif 30 Hari", price: "Rp 63.500", icon: "⚫" },
  { id: 101, category: "Tri", name: "LTE 33 GB", desc: "Masa Aktif 30 Hari", price: "Rp 79.500", icon: "⚫" },
  { id: 102, category: "Tri", name: "LTE 66 GB", desc: "Masa Aktif 30 Hari", price: "Rp 114.500", icon: "⚫" },
  { id: 103, category: "Tri", name: "Masa Aktif 120 Hari", desc: "Masa Aktif 120 Hari", price: "Rp 5.500", icon: "⚫" },
  { id: 104, category: "Tri", name: "Max 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 10.500", icon: "⚫" },
  { id: 105, category: "Tri", name: "Max 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 11.500", icon: "⚫" },
  { id: 106, category: "Tri", name: "Mini 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 10.500", icon: "⚫" },
  { id: 107, category: "Tri", name: "Mix 22 GB", desc: "Masa Aktif 30 Hari", price: "Rp 59.500", icon: "⚫" },
  { id: 108, category: "Tri", name: "Nonstop 4G 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.500", icon: "⚫" },
  { id: 109, category: "Indosat", name: "Data 1 GB", desc: "Masa Aktif 2 Hari", price: "Rp 5.500", icon: "🟡" },
  { id: 110, category: "Indosat", name: "Data 2 GB", desc: "Masa Aktif 3 Hari", price: "Rp 8.500", icon: "🟡" },
  { id: 111, category: "Indosat", name: "Data 3 GB", desc: "Masa Aktif 3 Hari", price: "Rp 10.500", icon: "🟡" },
  { id: 112, category: "Indosat", name: "Data 1 GB", desc: "Masa Aktif 3 Hari", price: "Rp 7.500", icon: "🟡" },
  { id: 113, category: "Indosat", name: "Data 2 GB", desc: "Masa Aktif 5 Hari", price: "Rp 10.500", icon: "🟡" },
  { id: 114, category: "Indosat", name: "Data 3 GB", desc: "Masa Aktif 5 Hari", price: "Rp 12.500", icon: "🟡" },
  { id: 115, category: "Indosat", name: "Data 3 GB", desc: "Masa Aktif 7 Hari", price: "Rp 14.500", icon: "🟡" },
  { id: 116, category: "Indosat", name: "Data 4 GB", desc: "Masa Aktif 7 Hari", price: "Rp 16.500", icon: "🟡" },
  { id: 117, category: "Indosat", name: "Data 6 GB", desc: "Masa Aktif 7 Hari", price: "Rp 21.500", icon: "🟡" },
  { id: 118, category: "Indosat", name: "Data 3 GB", desc: "Masa Aktif 14 Hari", price: "Rp 19.500", icon: "🟡" },
  { id: 119, category: "Indosat", name: "Data 4 GB", desc: "Masa Aktif 14 Hari", price: "Rp 21.500", icon: "🟡" },
  { id: 120, category: "Indosat", name: "Data 6 GB", desc: "Masa Aktif 14 Hari", price: "Rp 26.500", icon: "🟡" },
  { id: 121, category: "Indosat", name: "Data 9 GB", desc: "Masa Aktif 14 Hari", price: "Rp 34.500", icon: "🟡" },
  { id: 122, category: "Indosat", name: "Data 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 17.500", icon: "🟡" },
  { id: 123, category: "Indosat", name: "Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 22.500", icon: "🟡" },
  { id: 124, category: "Indosat", name: "Data 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.500", icon: "🟡" },
  { id: 125, category: "Indosat", name: "Data 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 29.500", icon: "🟡" },
  { id: 126, category: "Indosat", name: "Data 9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 37.500", icon: "🟡" },
  { id: 127, category: "Indosat", name: "Data 11 GB", desc: "Masa Aktif 30 Hari", price: "Rp 43.500", icon: "🟡" },
  { id: 128, category: "Indosat", name: "Data 15 GB", desc: "Masa Aktif 30 Hari", price: "Rp 53.500", icon: "🟡" },
  { id: 129, category: "Indosat", name: "Data 18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 63.500", icon: "🟡" },
  { id: 130, category: "Indosat", name: "Data 22 GB", desc: "Masa Aktif 30 Hari", price: "Rp 74.500", icon: "🟡" },
  { id: 131, category: "Indosat", name: "Data 28 GB", desc: "Masa Aktif 30 Hari", price: "Rp 91.500", icon: "🟡" },
  { id: 132, category: "Indosat", name: "Data 36 GB", desc: "Masa Aktif 30 Hari", price: "Rp 114.500", icon: "🟡" },
  { id: 133, category: "Indosat", name: "Data 42 GB", desc: "Masa Aktif 30 Hari", price: "Rp 127.500", icon: "🟡" },
  { id: 134, category: "Indosat", name: "Data 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 144.500", icon: "🟡" },
  { id: 135, category: "Indosat", name: "Data 100 GB", desc: "Masa Aktif 30 Hari", price: "Rp 210.500", icon: "🟡" },
  { id: 136, category: "Indosat", name: "Freedom Combo 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 38.000", icon: "🟡" },
  { id: 137, category: "Indosat", name: "Freedom Combo 4 GB", desc: "Masa Aktif 30 Hari", price: "Rp 58.000", icon: "🟡" },
  { id: 138, category: "Indosat", name: "Freedom Combo 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 78.000", icon: "🟡" },
  { id: 139, category: "Indosat", name: "Freedom Combo 14 GB", desc: "Masa Aktif 30 Hari", price: "Rp 103.000", icon: "🟡" },
  { id: 140, category: "Indosat", name: "Freedom Combo 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 153.000", icon: "🟡" },
  { id: 141, category: "Indosat", name: "Masa Aktif 1 Hari", desc: "Masa Aktif 1 Hari", price: "Rp 2.000", icon: "🟡" },
  { id: 142, category: "Indosat", name: "Masa Aktif 3 Hari", desc: "Masa Aktif 3 Hari", price: "Rp 5.500", icon: "🟡" },
  { id: 143, category: "Indosat", name: "Masa Aktif 7 Hari", desc: "Masa Aktif 7 Hari", price: "Rp 10.500", icon: "🟡" },
  { id: 144, category: "Indosat", name: "Masa Aktif 14 Hari", desc: "Masa Aktif 14 Hari", price: "Rp 15.500", icon: "🟡" },
  { id: 145, category: "Indosat", name: "Masa Aktif 30 Hari", desc: "Masa Aktif 30 Hari", price: "Rp 20.500", icon: "🟡" },
  { id: 146, category: "XL & Axis", name: "Aigo 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 14.500", icon: "🔵" },
  { id: 147, category: "XL & Axis", name: "Aigo 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 22.000", icon: "🔵" },
  { id: 148, category: "XL & Axis", name: "Aigo 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 28.500", icon: "🔵" },
  { id: 149, category: "XL & Axis", name: "Aigo 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 40.500", icon: "🔵" },
  { id: 150, category: "XL & Axis", name: "Aigo 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 53.000", icon: "🔵" },
  { id: 151, category: "XL & Axis", name: "Bronet 1 GB", desc: "Masa Aktif 30 Hari", price: "Rp 15.500", icon: "🔵" },
  { id: 152, category: "XL & Axis", name: "Bronet 2 GB", desc: "Masa Aktif 30 Hari", price: "Rp 24.500", icon: "🔵" },
  { id: 153, category: "XL & Axis", name: "Bronet 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 32.500", icon: "🔵" },
  { id: 154, category: "XL & Axis", name: "Bronet 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 45.000", icon: "🔵" },
  { id: 155, category: "XL & Axis", name: "Bronet 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 61.500", icon: "🔵" },
  { id: 156, category: "XL & Axis", name: "Data 1 GB", desc: "Masa Aktif 1 Hari", price: "Rp 3.500", icon: "🔵" },
  { id: 157, category: "XL & Axis", name: "Data 2 GB", desc: "Masa Aktif 1 Hari", price: "Rp 4.500", icon: "🔵" },
  { id: 158, category: "XL & Axis", name: "Data 3 GB", desc: "Masa Aktif 1 Hari", price: "Rp 5.500", icon: "🔵" },
  { id: 159, category: "XL & Axis", name: "Data 1 GB", desc: "Masa Aktif 3 Hari", price: "Rp 5.500", icon: "🔵" },
  { id: 160, category: "XL & Axis", name: "Data 2 GB", desc: "Masa Aktif 3 Hari", price: "Rp 7.500", icon: "🔵" },
  { id: 161, category: "XL & Axis", name: "Data 3 GB", desc: "Masa Aktif 3 Hari", price: "Rp 9.500", icon: "🔵" },
  { id: 162, category: "XL & Axis", name: "Data 1 GB", desc: "Masa Aktif 5 Hari", price: "Rp 7.500", icon: "🔵" },
  { id: 163, category: "XL & Axis", name: "Data 2 GB", desc: "Masa Aktif 5 Hari", price: "Rp 9.500", icon: "🔵" },
  { id: 164, category: "XL & Axis", name: "Data 3 GB", desc: "Masa Aktif 5 Hari", price: "Rp 11.500", icon: "🔵" },
  { id: 165, category: "XL & Axis", name: "Data 1 GB", desc: "Masa Aktif 7 Hari", price: "Rp 9.500", icon: "🔵" },
  { id: 166, category: "XL & Axis", name: "Data 2 GB", desc: "Masa Aktif 7 Hari", price: "Rp 11.500", icon: "🔵" },
  { id: 167, category: "XL & Axis", name: "Data 3 GB", desc: "Masa Aktif 7 Hari", price: "Rp 13.500", icon: "🔵" },
  { id: 168, category: "XL & Axis", name: "Data 1 GB", desc: "Masa Aktif 14 Hari", price: "Rp 11.500", icon: "🔵" },
  { id: 169, category: "XL & Axis", name: "Data 2 GB", desc: "Masa Aktif 14 Hari", price: "Rp 14.500", icon: "🔵" },
  { id: 170, category: "XL & Axis", name: "Data 3 GB", desc: "Masa Aktif 14 Hari", price: "Rp 17.500", icon: "🔵" },
  { id: 171, category: "XL & Axis", name: "Data 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 16.500", icon: "🔵" },
  { id: 172, category: "XL & Axis", name: "Data 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 23.500", icon: "🔵" },
  { id: 173, category: "XL & Axis", name: "Data 5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 34.500", icon: "🔵" },
  { id: 174, category: "XL & Axis", name: "Data 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 45.500", icon: "🔵" },
  { id: 175, category: "XL & Axis", name: "Data 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 59.500", icon: "🔵" },
  { id: 176, category: "XL & Axis", name: "Masa Aktif 1 Hari", desc: "Masa Aktif 1 Hari", price: "Rp 2.000", icon: "🔵" },
  { id: 177, category: "XL & Axis", name: "Masa Aktif 3 Hari", desc: "Masa Aktif 3 Hari", price: "Rp 5.500", icon: "🔵" },
  { id: 178, category: "XL & Axis", name: "Masa Aktif 7 Hari", desc: "Masa Aktif 7 Hari", price: "Rp 10.500", icon: "🔵" },
  { id: 179, category: "XL & Axis", name: "Masa Aktif 14 Hari", desc: "Masa Aktif 14 Hari", price: "Rp 15.500", icon: "🔵" },
  { id: 180, category: "XL & Axis", name: "Masa Aktif 30 Hari", desc: "Masa Aktif 30 Hari", price: "Rp 20.500", icon: "🔵" },
  { id: 181, category: "Smartfren", name: "10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 32.500", icon: "🟣" },
  { id: 182, category: "Smartfren", name: "16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 42.500", icon: "🟣" },
  { id: 183, category: "Smartfren", name: "30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 62.500", icon: "🟣" },
  { id: 184, category: "Smartfren", name: "60 GB", desc: "Masa Aktif 30 Hari", price: "Rp 102.500", icon: "🟣" },
  { id: 185, category: "Smartfren", name: "1.5 GB", desc: "Masa Aktif 1 Hari", price: "Rp 5.000", icon: "🟣" },
  { id: 186, category: "Smartfren", name: "3 GB", desc: "Masa Aktif 3 Hari", price: "Rp 10.000", icon: "🟣" },
  { id: 187, category: "Smartfren", name: "6 GB", desc: "Masa Aktif 5 Hari", price: "Rp 15.000", icon: "🟣" },
  { id: 188, category: "Smartfren", name: "10 GB", desc: "Masa Aktif 7 Hari", price: "Rp 20.000", icon: "🟣" },
  { id: 189, category: "Smartfren", name: "15 GB", desc: "Masa Aktif 14 Hari", price: "Rp 30.000", icon: "🟣" },
  { id: 190, category: "Smartfren", name: "2.5 GB", desc: "Masa Aktif 3 Hari", price: "Rp 9.000", icon: "🟣" },
  { id: 191, category: "Smartfren", name: "4 GB", desc: "Masa Aktif 7 Hari", price: "Rp 12.000", icon: "🟣" },
  { id: 192, category: "Smartfren", name: "6 GB", desc: "Masa Aktif 14 Hari", price: "Rp 18.000", icon: "🟣" },
  { id: 193, category: "Smartfren", name: "9 GB", desc: "Masa Aktif 30 Hari", price: "Rp 25.000", icon: "🟣" },
  { id: 194, category: "Smartfren", name: "12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 33.000", icon: "🟣" },
  { id: 195, category: "Smartfren", name: "18 GB", desc: "Masa Aktif 30 Hari", price: "Rp 48.000", icon: "🟣" },
  { id: 196, category: "Smartfren", name: "30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 78.000", icon: "🟣" },
  { id: 197, category: "Smartfren", name: "1 ON", desc: "Masa Aktif 30 Hari", price: "Rp 15.500", icon: "🟣" },
  { id: 198, category: "Smartfren", name: "3 ON", desc: "Masa Aktif 30 Hari", price: "Rp 20.500", icon: "🟣" },
  { id: 199, category: "Smartfren", name: "Unlimited 1 Hari", desc: "Masa Aktif 1 Hari", price: "Rp 9.500", icon: "🟣" },
  { id: 200, category: "Smartfren", name: "Unlimited 7 Hari", desc: "Masa Aktif 7 Hari", price: "Rp 21.000", icon: "🟣" },
  { id: 201, category: "Smartfren", name: "Unlimited 14 Hari", desc: "Masa Aktif 14 Hari", price: "Rp 41.000", icon: "🟣" },
  { id: 202, category: "Smartfren", name: "Unlimited 28 Hari", desc: "Masa Aktif 28 Hari", price: "Rp 81.000", icon: "🟣" },
  { id: 203, category: "Smartfren", name: "Unlimited Max", desc: "Masa Aktif 30 Hari", price: "Rp 102.500", icon: "🟣" },
  { id: 204, category: "XL & Axis", name: "Combo Flex S", desc: "Masa Aktif -", price: "Rp 14.500", icon: "🔵" },
  { id: 205, category: "XL & Axis", name: "Combo Flex S+", desc: "Masa Aktif -", price: "Rp 23.000", icon: "🔵" },
  { id: 206, category: "XL & Axis", name: "Combo Flex M", desc: "Masa Aktif -", price: "Rp 32.000", icon: "🔵" },
  { id: 207, category: "XL & Axis", name: "Combo Flex L", desc: "Masa Aktif -", price: "Rp 44.000", icon: "🔵" },
  { id: 208, category: "XL & Axis", name: "Combo Flex XL", desc: "Masa Aktif -", price: "Rp 61.000", icon: "🔵" },
  { id: 209, category: "XL & Axis", name: "Combo Flex XXL", desc: "Masa Aktif -", price: "Rp 80.000", icon: "🔵" },
  { id: 210, category: "XL & Axis", name: "Combo Flex XXXL", desc: "Masa Aktif -", price: "Rp 101.000", icon: "🔵" },
  { id: 211, category: "XL & Axis", name: "Xtra Combo Mini 1.5 GB", desc: "Masa Aktif 7 Hari", price: "Rp 9.500", icon: "🔵" },
  { id: 212, category: "XL & Axis", name: "Xtra Combo Mini 2.5 GB", desc: "Masa Aktif 7 Hari", price: "Rp 13.000", icon: "🔵" },
  { id: 213, category: "XL & Axis", name: "Xtra Combo Mini 4 GB", desc: "Masa Aktif 7 Hari", price: "Rp 16.500", icon: "🔵" },
  { id: 214, category: "XL & Axis", name: "Xtra Combo Mini 6 GB", desc: "Masa Aktif 7 Hari", price: "Rp 22.500", icon: "🔵" },
  { id: 215, category: "XL & Axis", name: "Xtra Combo Plus 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 58.000", icon: "🔵" },
  { id: 216, category: "XL & Axis", name: "Xtra Combo Plus 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 88.000", icon: "🔵" },
  { id: 217, category: "XL & Axis", name: "Xtra Combo Plus 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 128.000", icon: "🔵" },
  { id: 218, category: "XL & Axis", name: "Xtra Combo Plus 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 178.000", icon: "🔵" },
  { id: 219, category: "XL & Axis", name: "Xtra Combo Plus 70 GB", desc: "Masa Aktif 30 Hari", price: "Rp 238.000", icon: "🔵" },
  { id: 220, category: "XL & Axis", name: "Xtra On 1 GB", desc: "Masa Aktif -", price: "Rp 13.000", icon: "🔵" },
  { id: 221, category: "XL & Axis", name: "Xtra On 2 GB", desc: "Masa Aktif -", price: "Rp 22.000", icon: "🔵" },
  { id: 222, category: "XL & Axis", name: "HotRod 1.5 GB", desc: "Masa Aktif 30 Hari", price: "Rp 23.500", icon: "🔵" },
  { id: 223, category: "XL & Axis", name: "HotRod 3 GB", desc: "Masa Aktif 30 Hari", price: "Rp 32.500", icon: "🔵" },
  { id: 224, category: "XL & Axis", name: "HotRod 6 GB", desc: "Masa Aktif 30 Hari", price: "Rp 50.500", icon: "🔵" },
  { id: 225, category: "XL & Axis", name: "HotRod 8 GB", desc: "Masa Aktif 30 Hari", price: "Rp 63.500", icon: "🔵" },
  { id: 226, category: "XL & Axis", name: "HotRod 12 GB", desc: "Masa Aktif 30 Hari", price: "Rp 83.500", icon: "🔵" },
  { id: 227, category: "XL & Axis", name: "HotRod 16 GB", desc: "Masa Aktif 30 Hari", price: "Rp 103.500", icon: "🔵" },
  { id: 228, category: "XL & Axis", name: "Xtra Kuota 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 11.500", icon: "🔵" },
  { id: 229, category: "XL & Axis", name: "VIP Plus 10 GB", desc: "Masa Aktif 30 Hari", price: "Rp 69.000", icon: "🔵" },
  { id: 230, category: "XL & Axis", name: "VIP Plus 20 GB", desc: "Masa Aktif 30 Hari", price: "Rp 103.000", icon: "🔵" },
  { id: 231, category: "XL & Axis", name: "VIP Plus 30 GB", desc: "Masa Aktif 30 Hari", price: "Rp 144.000", icon: "🔵" },
  { id: 232, category: "XL & Axis", name: "VIP Plus 50 GB", desc: "Masa Aktif 30 Hari", price: "Rp 195.000", icon: "🔵" },
  { id: 233, category: "XL & Axis", name: "VIP Plus 70 GB", desc: "Masa Aktif 30 Hari", price: "Rp 256.000", icon: "🔵" },

  // INI ADALAH PAKET AKRAB YANG SUDAH DIPERBARUI
  { id: 234, category: "XL & Axis", name: "AKRAB Mini", desc: "Pembagian Kuota Cek Area", price: "Rp 65.000", icon: "🔵" },
  { id: 235, category: "XL & Axis", name: "AKRAB Big", desc: "38 - 57 GB (Tergantung Area)", price: "Rp 70.000", icon: "🔵" },
  { id: 236, category: "XL & Axis", name: "AKRAB Jumbo V2", desc: "50 - 69 GB (Tergantung Area)", price: "Rp 79.000", icon: "🔵" },
  { id: 237, category: "XL & Axis", name: "AKRAB Jumbo New", desc: "63 - 82 GB (Tergantung Area)", price: "Rp 88.000", icon: "🔵" },
  { id: 238, category: "XL & Axis", name: "AKRAB Jumbo M", desc: "69 - 88 GB (Tergantung Area)", price: "Rp 93.000", icon: "🔵" },
  { id: 239, category: "XL & Axis", name: "AKRAB Mega Big", desc: "88 - 107 GB (Tergantung Area)", price: "Rp 107.000", icon: "🔵" }
];


  const whatsappNumber = "6285967096912";
  export default function LandingPage() {
  const whatsappNumber = "6285967096912";
  
  // State untuk menyimpan pilihan pengguna
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeType, setActiveType] = useState("Semua Tipe");
  
  // State khusus untuk menyimpan pilihan varian dalam kartu produk (seperti AKRAB)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // FUNGSI CERDAS: Membaca nama produk dan memisahkannya ke sub-kategori
  const getPackageType = (name: string) => {
    const n = name.toLowerCase();
    
    // Khusus AKRAB kini disatukan menjadi satu sub-kategori "AKRAB" saja
    if (n.includes('akrab')) return 'AKRAB';
    
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

  const getWaLink = (productName: string, productPrice?: string) => {
    const priceText = productPrice ? ` dengan harga ${productPrice}` : "";
    const message = `Halo Arwani D'Gabriel Store, saya ingin memesan ${productName}${priceText}. Bagaimana prosedurnya?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  };

  // Saring berdasarkan Provider
  const providerProducts = activeCategory === "Semua" 
    ? products 
    : products.filter(item => item.category === activeCategory);

  // Cari tahu Jenis Paket apa saja yang ada
  const availableTypes = ["Semua Tipe", ...Array.from(new Set(providerProducts.map(p => getPackageType(p.name))))];

  // Saring berdasarkan Jenis Paket
  let rawFinalProducts = activeType === "Semua Tipe"
    ? providerProducts
    : providerProducts.filter(p => getPackageType(p.name) === activeType);

  // LOGIKA PENGGABUNGAN KARTU (GROUPING) KHUSUS AKRAB
  const finalProducts = [];
  const akrabGroup = [];

  rawFinalProducts.forEach(product => {
    if (product.name.toLowerCase().includes('akrab')) {
      akrabGroup.push(product);
    } else {
      finalProducts.push(product); // Masukkan produk biasa
    }
  });

  // Jika ada produk AKRAB, buat satu kartu master
  if (akrabGroup.length > 0) {
    finalProducts.unshift({
      id: "master-akrab",
      category: "XL & Axis",
      name: "Paket Keluarga AKRAB",
      desc: "Pembagian Kuota Lokal Berbeda Tiap Area",
      price: "Mulai Rp 65.000",
      icon: "👪",
      isGroup: true, // Penanda bahwa ini kartu grup
      variants: akrabGroup
    });
  }

  // Reset sub-kategori saat ganti provider
  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setActiveType("Semua Tipe");
  };

  // Fungsi mengubah varian dalam kartu grup
  const handleVariantChange = (groupId: string, variantName: string) => {
    setSelectedVariants(prev => ({...prev, [groupId]: variantName}));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-black tracking-tighter text-emerald-600">ARWANI D'GABRIEL <span className="text-slate-400">STORE</span></h1>
          <a 
            href={getWaLink("Informasi Umum")}
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 transition"
          >
            Hubungi Admin
          </a>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Solusi Kebutuhan Digital <br/> <span className="text-emerald-600">Cepat, Murah, Terpercaya.</span>
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
                  ? "bg-emerald-600 text-white" 
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700"
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

      {/* BANNER CEK KUOTA KHUSUS XL & AXIS */}
      {activeCategory === "XL & Axis" && (
        <div className="max-w-5xl mx-auto px-6 mb-10">
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between shadow-sm gap-4">
            <div>
              <h4 className="text-blue-800 font-bold text-lg">Cek Pembagian Kuota Lokal XL Anda 📍</h4>
              <p className="text-blue-600 text-sm mt-1">Beberapa paket seperti AKRAB dan Xtra Combo memiliki pembagian kuota yang berbeda di setiap area. Pastikan kuota lokal Anda sebelum memesan.</p>
            </div>
            <a 
              href="https://cekareaxl.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-700 transition whitespace-nowrap shadow-md flex-shrink-0"
            >
              Cek Area Sekarang
            </a>
          </div>
        </div>
      )}

      <section id="produk" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {finalProducts.map((item) => {
            
            // TAMPILAN KARTU GRUP (KHUSUS AKRAB)
            if (item.isGroup) {
              const selectedVarName = selectedVariants[item.id] || item.variants[0].name;
              const selectedVar = item.variants.find(v => v.name === selectedVarName);

              return (
                <div key={item.id} className="bg-emerald-50 p-6 rounded-3xl border-2 border-emerald-200 shadow-md hover:shadow-xl transition group flex flex-col justify-between">
                  <div>
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{item.category}</div>
                      <div className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">PILIHAN GANDA</div>
                    </div>
                    <h3 className="text-lg font-bold mb-1 leading-snug text-slate-900">{item.name}</h3>
                    <p className="text-emerald-700 text-sm mb-4 font-medium">{item.desc}</p>
                    
                    {/* DROPDOWN PILIHAN VARIAN */}
                    <div className="mb-4">
                      <label className="block text-xs text-slate-500 mb-1 font-semibold">Pilih Varian AKRAB:</label>
                      <select 
                        className="w-full p-2 border border-emerald-300 rounded-lg text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        value={selectedVarName}
                        onChange={(e) => handleVariantChange(item.id, e.target.value)}
                      >
                        {item.variants.map(v => (
                          <option key={v.id} value={v.name}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* INFO VARIAN TERPILIH */}
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 mb-4">
                     <p className="text-xs text-slate-500 mb-1">Detail Varian Terpilih:</p>
                     <p className="text-sm font-semibold text-slate-800 mb-1">{selectedVar.desc}</p>
                     <div className="text-xl font-black text-emerald-600">{selectedVar.price}</div>
                  </div>

                  <div>
                    <a 
                      href={getWaLink(selectedVar.name, selectedVar.price)}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-emerald-600 text-white text-center font-bold rounded-xl hover:bg-emerald-700 transition block"
                    >
                      Pesan {selectedVar.name.replace('AKRAB ', '')}
                    </a>
                  </div>
                </div>
              );
            }

            // TAMPILAN KARTU NORMAL (PRODUK LAINNYA)
            return (
              <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition group flex flex-col justify-between">
                <div>
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category}</div>
                    <div className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{getPackageType(item.name)}</div>
                  </div>
                  <h3 className="text-lg font-bold mb-1 leading-snug text-slate-800">{item.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{item.desc}</p>
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-600 mb-4">{item.price}</div>
                  <a 
                    href={getWaLink(item.name, item.price)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full py-3 bg-emerald-50 text-emerald-700 text-center font-bold rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition block"
                  >
                    Pesan Sekarang
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        
        {finalProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-400 text-lg">Maaf, tidak ada produk untuk tipe paket ini.</p>
          </div>
        )}
      </section>

      <footer className="py-10 text-center text-slate-400 text-sm bg-emerald-900 text-white mt-10">
        <p>© 2026 Arwani D'Gabriel Store. Pelayanan sepenuh hati.</p>
      </footer>
    </div>
  );
}