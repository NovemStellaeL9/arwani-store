import { NextResponse } from "next/server";
import { fetchLiveStock, mapCategoryToDisplay } from "@/lib/ruangkuota";
import type { RuangKuotaProduct } from "@/lib/ruangkuota";
import { calculateSellingPrice } from "@/lib/pricing";
import { getActiveProviders } from "@/lib/providers";

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

    const mapped: MappedStoreProduct[] = liveProducts.map((p) => {
      const display = mapCategoryToDisplay(p.category, p.name);
      return {
        id: `${p.category}:${p.code}`,
        code: p.code,
        name: p.name,
        category: p.category,
        stock: p.stock,
        price: calculateSellingPrice(p),
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
      activeProviders: getActiveProviders(mapped),
      isLive: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("API /api/products error:", error);
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : "Gagal memuat produk dari server penyedia.",
    }, { status: 503 });
  }
}
