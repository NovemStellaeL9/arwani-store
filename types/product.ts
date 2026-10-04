export interface Product {
  id: number;
  code?: string;
  category: string;
  name: string;
  desc: string;
  price: number; // Numeric price
  originalPrice?: number;
  stock?: number;
  isAvailable?: boolean;
  provider?: string;
  isFavorite?: boolean;
  isNew?: boolean;
}

export interface GroupedProduct {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number; // Minimum price of variants
  icon: string;
  isGroup: true;
  variants: Product[];
}

export type DisplayItem = Product | GroupedProduct;

export type ActiveCategory =
  | "Home"
  | "Semua"
  | "MasaAktif"
  | "Telkomsel"
  | "by.U"
  | "Indosat"
  | "XL & Axis"
  | "Tri"
  | "Smartfren"
  | "PLN"
  | "DANA";

export interface PurchaseRequest {
  productcode: string;
  phonenumber: string;
  refid: string;
}

export interface PurchaseResponse {
  success: boolean;
  refid?: string;
  trxuuid?: string;
  status?: string; // "00" = Sukses, "01" = Gagal Saldo, "02" = Gagal Stok
  productcode?: string;
  phonenumber?: string;
  price?: number;
  message?: string;
  time?: string;
}
