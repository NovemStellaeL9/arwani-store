import type { RuangKuotaProduct } from "@/lib/ruangkuota";

const DEFAULT_MARKUP = 5_000;
const AKRAB_MARKUP = 10_000;
const HIGH_VALUE_AKRAB_MARKUP = 12_000;
const HIGH_VALUE_AKRAB_THRESHOLD = 90_000;

export function calculateMarkup(product: Pick<RuangKuotaProduct, "category" | "name" | "price">): number {
  const isAkrab = /akrab/i.test(product.category) || /akrab/i.test(product.name);

  if (!isAkrab) return DEFAULT_MARKUP;
  return product.price > HIGH_VALUE_AKRAB_THRESHOLD
    ? HIGH_VALUE_AKRAB_MARKUP
    : AKRAB_MARKUP;
}

export function calculateSellingPrice(product: Pick<RuangKuotaProduct, "category" | "name" | "price">): number {
  return product.price + calculateMarkup(product);
}
