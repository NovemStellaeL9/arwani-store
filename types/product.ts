export interface Product {
  id: string | number;
  code?: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  stock?: number;
  isAvailable?: boolean;
  isLive?: boolean;
  group?: string;
  subgroup?: string;
  operator?: string;
  isFavorite?: boolean;
  isNew?: boolean;
}

export interface GroupedProduct {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  icon?: string;
  isGroup: true;
  variants: Product[];
}

export type DisplayItem = Product | GroupedProduct;

export type ActiveCategory =
  | "Home"
  | "Semua"
  | "MasaAktif"
  | "Masa Aktif"
  | "Telkomsel"
  | "by.U"
  | "Indosat"
  | "XL & Axis"
  | "Tri"
  | "Smartfren"
  | "PLN"
  | "E-Wallet"
  | "Pulsa"
  | "Lainnya";
