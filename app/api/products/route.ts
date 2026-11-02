import { NextResponse } from "next/server";
import { fetchLiveStock, mapCategoryToDisplay, RuangKuotaProduct } from "@/lib/ruangkuota";
import { products as fallbackProducts } from "@/data/products";

export const dynamic = "force-dynamic";

export interface MappedStoreProduct {
  id: string;
  code: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  group: string;
  subgroup: string;
  operator: string;
  isAvailable: boolean;
  isLive: boolean;
}

export async function GET() {
  try {
    const liveProducts: RuangKuotaProduct[] = await fetchLiveStock();

    const mapped: MappedStoreProduct[] = liveProducts.map((p, index) => {
      const display = mapCategoryToDisplay(p.category, p.name);
      return {
        id: `${p.category}-${p.code}-${index}`,
        code: p.code,
        name: p.name,
        category: p.category,
        stock: p.stock,
        price: p.price,
        group: display.group,
        subgroup: display.subgroup,
        operator: display.operator,
        isAvailable: p.stock > 0 || p.stock === 999,
        isLive: true,
      };
    });

    return NextResponse.json({
      success: true,
      total: mapped.length,
      products: mapped,
      isLive: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("API /api/products error:", error);

    // Resilient fallback using data/products.ts if external API is unreachable
    const fallbackMapped: MappedStoreProduct[] = fallbackProducts.map((p) => {
      const display = mapCategoryToDisplay(p.category, p.name);
      return {
        id: `FB-${p.id}`,
        code: p.desc || `PROD-${p.id}`,
        name: p.name,
        category: p.category,
        stock: 999,
        price: p.price,
        group: display.group,
        subgroup: display.subgroup,
        operator: p.category === "MasaAktif" ? (p.desc || "Lainnya") : p.category,
        isAvailable: true,
        isLive: false,
      };
    });

    return NextResponse.json({
      success: true,
      total: fallbackMapped.length,
      products: fallbackMapped,
      isLive: false,
      warning: "Menggunakan data cadangan karena server penyedia sedang lambat merespon.",
      timestamp: new Date().toISOString(),
    });
  }
}

