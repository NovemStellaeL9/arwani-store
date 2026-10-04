import { NextResponse } from "next/server";
import { Product } from "@/types/product";
import { detectProvider } from "@/utils/helpers";

const RUANG_KUOTA_KEY = process.env.RUANG_KUOTA_API_KEY || "78e19cdde458c8ace3ac0baaefea005f8ff5a5d579488ea582c2ef9cd8e903173d4ef3c0ddd58996654e65aa6cb9b8729562c52be518877d92cff80ce1671b2651b56a07b3d21f1a922371";
const BASE_URL = process.env.RUANG_KUOTA_BASE_URL || "https://service.ruang-kuota.my.id";
const MARKUP = Number(process.env.DEFAULT_MARKUP_RUPIAH) || 1500;

export async function GET() {
  try {
    const res = await fetch(`${BASE_URL}/user/products/stock`, {
      method: "GET",
      headers: {
        "x-api-key": RUANG_KUOTA_KEY,
        "Accept": "application/json",
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const json = await res.json();
    const rawProducts: any[] = json.data?.products || [];

    const products: Product[] = rawProducts.map((p, index) => {
      const isMasaAktif =
        p.category.includes("MASA_AKTIF") ||
        p.name.toLowerCase().includes("masa aktif") ||
        ["LAINNYA_CAT_10", "LAINNYA_CAT_11", "LAINNYA_CAT_12", "LAINNYA_CAT_13", "LAINNYA_CAT_23"].includes(p.category);

      let mappedCategory = detectProvider(p.name, p.category);
      let desc = "⚡ Proses Instan Langsung Aktif";

      if (isMasaAktif) {
        mappedCategory = "MasaAktif";
        const n = p.name.toLowerCase();
        if (n.includes("xl")) desc = "XL";
        else if (n.includes("indosat") || n.includes("im3")) desc = "Indosat";
        else if (n.includes("telkomsel") || n.includes("tsel")) desc = "Telkomsel";
        else if (n.includes("tri") || n.includes("three")) desc = "Tri";
        else if (n.includes("axis")) desc = "Axis";
        else desc = "Semua Operator";
      }

      const originalPrice = Number(p.price) || 0;
      const finalPrice = originalPrice + MARKUP;
      const isAvailable = p.stock > 0;

      return {
        id: index + 1000,
        code: p.code,
        name: p.name,
        category: mappedCategory,
        desc: desc,
        price: finalPrice,
        originalPrice: originalPrice,
        stock: p.stock,
        isAvailable: isAvailable,
        provider: mappedCategory,
      };
    });

    return NextResponse.json({
      success: true,
      total: products.length,
      products: products,
    });
  } catch (error: any) {
    console.error("Gagal memuat produk dari Ruang Kuota:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal memuat produk",
        products: [],
      },
      { status: 500 }
    );
  }
}
