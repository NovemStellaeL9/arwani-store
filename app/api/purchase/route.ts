import { NextRequest, NextResponse } from "next/server";
import { executePurchase } from "@/lib/ruangkuota";
import { saveTransaction } from "@/lib/transactionStore";
import { TransactionRecord, TransactionStatus } from "@/types/product";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
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

    // Format nomor HP
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

    let status: TransactionStatus = "FAILED";
    let statusLabel = "Gagal";

    if (purchaseRes.status === "00") {
      status = "SUCCESS";
      statusLabel = "Sukses";
    } else if (purchaseRes.status === "02") {
      status = "PROCESSING";
      statusLabel = "Diproses";
    }

    const record: TransactionRecord = {
      refid: purchaseRes.refid || refid,
      trxuuid: purchaseRes.trxuuid,
      productCode: purchaseRes.productcode || productcode,
      productName: productName || productcode,
      operator: category || "Umum",
      packageCategory: "Bulanan",
      phoneNumber: cleanPhone,
      costPrice: purchaseRes.price,
      sellingPrice: purchaseRes.price,
      fee: 0,
      totalAmount: purchaseRes.price,
      paymentMethod: "QRIS",
      status,
      statusLabel,
      sn: purchaseRes.trxuuid,
      message: purchaseRes.message,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      expiredAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    };

    saveTransaction(record);

    return NextResponse.json({
      success: purchaseRes.status === "00",
      data: purchaseRes,
    });
  } catch (error: unknown) {
    console.error("API /api/purchase error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kendala saat memproses pembelian.";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
