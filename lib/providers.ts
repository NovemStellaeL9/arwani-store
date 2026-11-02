export interface ProviderProduct {
  operator?: string;
  stock?: number;
  isAvailable?: boolean;
}

const PROVIDER_ORDER = ["XL & Axis", "Telkomsel", "by.U", "Smartfren", "Indosat", "Tri"];

function canonicalProvider(operator: string | undefined): string | undefined {
  switch (operator?.trim().toLowerCase()) {
    case "xl":
    case "axis":
    case "xl & axis":
      return "XL & Axis";
    case "telkomsel":
      return "Telkomsel";
    case "by.u":
    case "byu":
      return "by.U";
    case "smartfren":
      return "Smartfren";
    case "indosat":
      return "Indosat";
    case "tri":
      return "Tri";
    default:
      return undefined;
  }
}

export function getActiveProviders(products: ProviderProduct[]): string[] {
  const active = new Set<string>();

  for (const product of products) {
    const available = product.isAvailable ?? (product.stock !== undefined && product.stock > 0);
    if (!available) continue;

    const provider = canonicalProvider(product.operator);
    if (provider) active.add(provider);
  }

  return PROVIDER_ORDER.filter((provider) => active.has(provider));
}
