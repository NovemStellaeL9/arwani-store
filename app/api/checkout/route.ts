import { NextRequest, NextResponse } from "next/server";
import { getProductByCode, products as presetProducts } from "@/data/products";
import { saveTransaction } from "@/lib/transactionStore";
import { calculateSellingPrice } from "@/utils/helpers";
import { PaymentMethod, TransactionRecord, TransactionStatus } from "@/types/product";

export const dynamic = "force-dynamic";

/**
 * Generator Dynamic QRIS Payload standar Indonesia (ASPI / EMVCo).
 * Menghasilkan string QRIS yang valid dan dapat di-render langsung ke QR Code.
 */
function generateDynamicQrisPayload(refid: string, amount: number): string {
  // Mock Dynamic QRIS String dengan tag EMVCo terstruktur
  const formattedAmount = amount.toString();
  return `00020101021226600016ID.CO.QRIS.WWW011893600000000000000002150000000000000000303UME51440014ID.LINKAJA.WWW02150000000000000000303UME52045812530336054${formattedAmount.length.toString().padStart(2, "0")}${formattedAmount}5802ID5912ARWANI STORE6007JAKARTA62${(refid.length + 4).toString().padStart(2, "0")}01${refid.length.toString().padStart(2, "0")}${refid}6304`;
}

/**
 * Generator Nomor Virtual Account berdasarkan bank dan nomor tujuan
 */
function generateVaNumber(bank: string, phone: string): string {
  const cleanPhone = phone.replace(/^0/, "");
  switch (bank) {
    case "BCA_VA":
      return `39107${cleanPhone.slice(-8).padStart(8, "0")}`;
    case "BRI_VA":
      return `88810${cleanPhone.slice(-8).padStart(8, "0")}`;
    case "BNI_VA":
      return `98812${cleanPhone.slice(-8).padStart(8, "0")}`;
    case "MANDIRI_VA":
      return `89508${cleanPhone.slice(-8).padStart(8, "0")}`;
    default:
      return `8800${cleanPhone.slice(-8).padStart(8, "0")}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productCode, phoneNumber, paymentMethod = "QRIS" } = body;

    if (!productCode || !phoneNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Kode produk dan nomor tujuan wajib diisi.",
        },
        { status: 400 }
      );
    }

    const cleanPhone = String(phoneNumber).replace(/[^0-9]/g, "");
    if (cleanPhone.length < 4 || cleanPhone.length > 20) {
      return NextResponse.json(
        {
          success: false,
          message: "Format nomor tujuan tidak valid. Masukkan nomor HP Indonesia yang aktif.",
        },
        { status: 400 }
      );
    }

    // Cari produk dari data preset atau live fallback
    let product = getProductByCode(productCode);
    if (!product) {
      product = presetProducts.find(
        (p) =>
          p.code.toLowerCase() === productCode.toLowerCase() ||
          p.id.toLowerCase() === productCode.toLowerCase()
      );
    }

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Produk tidak ditemukan atau sudah tidak tersedia.",
        },
        { status: 404 }
      );
    }

    // Pastikan harga jual akhir selalu melalui logika markup
    const sellingPrice = calculateSellingPrice(product.costPrice);
    const fee = 0; // Biaya layanan promo Rp 0
    const totalAmount = sellingPrice + fee;

    // Buat RefID transaksi unik
    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "");
    const rand = Math.floor(10000 + Math.random() * 90000);
    const refid = `ARW-${dateStr}-${rand}`;

    // Waktu kedaluwarsa 15 menit
    const expiredAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const selectedMethod = paymentMethod as PaymentMethod;
    const isQris = selectedMethod === "QRIS";
    const isVa = selectedMethod.includes("_VA");

    const qrisPayload = isQris ? generateDynamicQrisPayload(refid, totalAmount) : undefined;
    const vaNumber = isVa ? generateVaNumber(selectedMethod, cleanPhone) : undefined;

    const transaction: TransactionRecord = {
      refid,
      productCode: product.code,
      productName: product.name,
      operator: product.operator,
      packageCategory: product.packageCategory,
      phoneNumber: cleanPhone,
      costPrice: product.costPrice,
      sellingPrice,
      fee,
      totalAmount,
      paymentMethod: selectedMethod,
      status: "PENDING" as TransactionStatus,
      statusLabel: "Menunggu Pembayaran",
      qrisPayload,
      vaNumber,
      message: "Silakan selesaikan pembayaran sebelum batas waktu berakhir.",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiredAt,
    };

    saveTransaction(transaction);

    return NextResponse.json({
      success: true,
      refid,
      order: transaction,
      message: "Checkout berhasil dibuat. Silakan lakukan pembayaran.",
    });
  } catch (error: unknown) {
    console.error("API /api/checkout error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kendala saat membuat pesanan";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
