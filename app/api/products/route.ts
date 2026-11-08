import { NextRequest, NextResponse } from "next/server";
import { fetchLiveStock, mapLiveProductToApp } from "@/lib/ruangkuota";
import { products as presetProducts } from "@/data/products";
import { Product } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const operatorParam = searchParams.get("operator") || "";
    const categoryParam = searchParams.get("category") || "";
    const queryParam = searchParams.get("query")?.toLowerCase() || "";

    let allProducts: Product[] = [];
    let isLive = false;

    try {
      const liveList = await fetchLiveStock();
      if (Array.isArray(liveList) && liveList.length > 0) {
        // Hanya produk dengan stok > 0 dan bukan Cek PLN
        const validInStock = liveList.filter(
          (p) => p.stock > 0 && p.name && !p.name.toLowerCase().includes("cek pln")
        );

        // Deduplikasi item ganda lintas kategori internal provider
        const seen = new Set<string>();
        const uniqueProducts: Product[] = [];

        validInStock.forEach((p, idx) => {
          const nameTrim = (p.name || "").trim().toLowerCase();
          const dedupeKey = `${nameTrim}::${p.price}`;
          if (!seen.has(dedupeKey)) {
            seen.add(dedupeKey);
            uniqueProducts.push(mapLiveProductToApp(p, idx));
          }
        });

        allProducts = uniqueProducts;
        isLive = true;
      } else {
        allProducts = presetProducts;
      }
    } catch {
      allProducts = presetProducts;
    }

    // Filter berdasarkan Operator
    let filtered = allProducts;
    if (operatorParam && operatorParam !== "Semua") {
      filtered = filtered.filter(
        (p) =>
          p.operator.toLowerCase() === operatorParam.toLowerCase() ||
          p.name.toLowerCase().includes(operatorParam.toLowerCase())
      );
    }

    // Filter berdasarkan Kategori Paket
    if (categoryParam && categoryParam !== "Semua") {
      filtered = filtered.filter(
        (p) =>
          p.packageCategory.toLowerCase() === categoryParam.toLowerCase() ||
          p.category.toLowerCase().includes(categoryParam.toLowerCase())
      );
    }

    // Filter berdasarkan kata kunci pencarian
    if (queryParam) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(queryParam) ||
          p.desc.toLowerCase().includes(queryParam) ||
          p.quota.toLowerCase().includes(queryParam) ||
          p.code.toLowerCase().includes(queryParam)
      );
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      products: filtered,
      isLive,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kendala saat memuat produk";
    return NextResponse.json(
      {
        success: false,
        message,
        products: presetProducts,
        isLive: false,
      },
      { status: 500 }
    );
  }
}
