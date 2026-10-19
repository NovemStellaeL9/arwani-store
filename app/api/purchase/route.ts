import { NextResponse } from "next/server";
import { executePurchase } from "@/lib/ruangkuota";
import { saveTransaction } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productcode, phonenumber, productName, category } = body;
    let { refid } = body;

    if (!productcode || !phonenumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode produk dan nomor tujuan wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Clean phone number format
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

    if (!refid || String(refid).trim() === "") {
      const now = new Date();
      const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "");
      const rand = Math.floor(10000 + Math.random() * 90000);
      refid = `ARW-${dateStr}-${rand}`;
    }

    const purchaseRes = await executePurchase({
      productcode: String(productcode).trim(),
      phonenumber: cleanPhone,
      refid: String(refid).trim(),
    });

    let statusLabel: "Sukses" | "Diproses" | "Gagal" = "Gagal";
    if (purchaseRes.status === "00") {
      statusLabel = "Sukses";
    } else if (
      purchaseRes.status === "02" &&
      purchaseRes.message.toLowerCase().includes("sedang diproses")
    ) {
      statusLabel = "Diproses";
    }

    saveTransaction({
      refid: purchaseRes.refid || refid,
      trxuuid: purchaseRes.trxuuid,
      productcode: purchaseRes.productcode || productcode,
      productName: productName || productcode,
      category: category || "",
      phonenumber: cleanPhone,
      price: purchaseRes.price,
      status: purchaseRes.status,
      statusLabel,
      message: purchaseRes.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: "API_DIRECT",
    });

    return NextResponse.json({
      success: purchaseRes.status === "00",
      data: purchaseRes,
    });
  } catch (error: any) {
    console.error("API /api/purchase error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Terjadi kendala saat memproses pembelian.",
      },
      { status: 500 }
    );
  }
}

