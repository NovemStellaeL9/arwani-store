export interface Product {
  id: number;
  category: string;
  name: string;
  desc: string;
  price: number; // Numeric price
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
  | "MasaAktif"
  | "Telkomsel"
  | "by.U"
  | "Indosat"
  | "XL & Axis"
  | "Tri"
  | "Smartfren";
