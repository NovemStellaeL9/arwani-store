import { NextResponse } from "next/server";
import {
  executePurchase,
  fetchLiveStock,
  mapCategoryToDisplay,
  resolveStatusLabel,
  toPublicResult,
} from "@/lib/ruangkuota";
import { saveTransaction } from "@/lib/transactionStore";
import { calculateSellingPrice } from "@/lib/pricing";

export const dynamic = "force-dynamic";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    if (!isRecord(body)) {
      return NextResponse.json({ success: false, message: "Format permintaan tidak valid." }, { status: 400 });
    }

    const productcode = typeof body.productcode === "string" ? body.productcode.trim() : "";
    const phonenumber = typeof body.phonenumber === "string" || typeof body.phonenumber === "number"
      ? String(body.phonenumber)
      : "";
    let refid = typeof body.refid === "string" ? body.refid.trim() : "";

    if (!productcode || !phonenumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode produk dan nomor tujuan wajib diisi.",
        },
        { status: 400 }
      );
    }

    const cleanPhone = String(phonenumber).replace(/[^0-9]/g, "");
    if (cleanPhone.length < 4 || cleanPhone.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Format nomor tujuan tidak valid. Masukkan 4 sampai 50 digit angka.",
        },
        { status: 400 }
      );
    }

    if (!refid) {
      const now = new Date();
      const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "");
      const rand = Math.floor(10000 + Math.random() * 90000);
      refid = `ARW-${dateStr}-${rand}`;
    }

    const liveProducts = await fetchLiveStock();
    const product = liveProducts.find((item) => item.code === productcode);
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Produk tidak ditemukan atau sudah tidak tersedia." },
        { status: 404 }
      );
    }
    if (product.stock <= 0) {
      return NextResponse.json(
        { success: false, message: "Stok produk sedang habis." },
        { status: 409 }
      );
    }

    const sellingPrice = calculateSellingPrice(product);
    if (
      body.price !== undefined &&
      (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price !== sellingPrice)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Harga produk berubah. Muat ulang katalog sebelum memesan.",
          price: sellingPrice,
        },
        { status: 409 }
      );
    }

    const purchaseRes = await executePurchase({
      productcode: product.code,
      phonenumber: cleanPhone,
      refid,
    });

    const statusLabel = resolveStatusLabel(purchaseRes.status, purchaseRes.message);
    const publicResult = toPublicResult({
      ...purchaseRes,
      refid: purchaseRes.refid || refid,
      productcode: product.code,
      phonenumber: cleanPhone,
      price: sellingPrice,
    });
    const display = mapCategoryToDisplay(product.category, product.name);

    saveTransaction({
      refid: publicResult.refid,
      trxuuid: purchaseRes.trxuuid,
      productcode: product.code,
      productName: product.name,
      category: display.group,
      phonenumber: cleanPhone,
      price: sellingPrice,
      costPrice: purchaseRes.price || product.price,
      status: purchaseRes.status,
      statusLabel,
      message: purchaseRes.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: "API_DIRECT",
    });

    return NextResponse.json({
      success: statusLabel !== "Gagal",
      data: publicResult,
    });
  } catch (error: unknown) {
    console.error("API /api/purchase error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Terjadi kendala saat memproses pembelian.",
      },
      { status: 500 }
    );
  }
}
