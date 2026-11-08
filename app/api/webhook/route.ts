import { NextRequest, NextResponse } from "next/server";
import {
  findTransaction,
  updateTransactionStatus,
  logWebhook,
  getWebhookLogs,
} from "@/lib/transactionStore";
import { executePurchase } from "@/lib/ruangkuota";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    let body: Record<string, unknown> = {};

    try {
      body = JSON.parse(rawBody);
    } catch {
      body = { raw: rawBody };
    }

    const headersRecord: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headersRecord[key] = value;
    });

    logWebhook({
      headers: headersRecord,
      body,
      status: "RECEIVED",
      message: "Webhook pembayaran diterima",
    });

    // Ekstrak referensi transaksi dari payload pembayaran (mendukung format Midtrans, Tripay, atau Direct)
    const refid =
      (body.refid as string) ||
      (body.order_id as string) ||
      (body.merchant_ref as string) ||
      (body.reference as string);

    if (!refid) {
      return NextResponse.json(
        {
          success: false,
          message: "Parameter refid / order_id tidak ditemukan dalam payload webhook.",
        },
        { status: 400 }
      );
    }

    const transaction = findTransaction(refid);
    if (!transaction) {
      return NextResponse.json(
        {
          success: false,
          message: `Transaksi dengan RefID ${refid} tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    // 1. Update status transaksi menjadi PAID / Menunggu Injeksi
    updateTransactionStatus(refid, "PAID", "Pembayaran Terverifikasi");

    // 2. Eksekusi Injeksi Kuota ke Provider Serverless
    try {
      const purchaseResult = await executePurchase({
        productcode: transaction.productCode,
        phonenumber: transaction.phoneNumber,
        refid: transaction.refid,
      });

      if (purchaseResult.status === "00") {
        updateTransactionStatus(
          refid,
          "SUCCESS",
          "Kuota Berhasil Dikirim",
          purchaseResult.trxuuid || purchaseResult.refid,
          purchaseResult.message || "Paket data berhasil masuk ke nomor tujuan."
        );
      } else if (purchaseResult.status === "02") {
        updateTransactionStatus(
          refid,
          "PROCESSING",
          "Sedang Diproses Provider",
          purchaseResult.trxuuid,
          purchaseResult.message || "Permintaan sedang diproses dalam antrean server provider."
        );
      } else {
        updateTransactionStatus(
          refid,
          "FAILED",
          "Gagal dari Provider",
          undefined,
          purchaseResult.message || "Provider menolak transaksi. Saldo Anda aman."
        );
      }

      return NextResponse.json({
        success: true,
        message: "Webhook berhasil diproses dan kuota telah diinjeksi ke provider.",
        providerResult: purchaseResult,
      });
    } catch (providerError: unknown) {
      console.error("Provider injection error:", providerError);
      // Jika server provider down, update status menjadi PROCESSING agar admin bisa re-inject
      updateTransactionStatus(
        refid,
        "PROCESSING",
        "Menunggu Retry Provider",
        undefined,
        "Pembayaran lunas, sistem sedang mengantre pengiriman kuota."
      );

      return NextResponse.json({
        success: true,
        message: "Pembayaran terverifikasi, namun provider sedang delay.",
      });
    }
  } catch (error: unknown) {
    console.error("API /api/webhook error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan internal webhook";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET() {
  const recentLogs = getWebhookLogs();
  return NextResponse.json({
    success: true,
    totalLogs: recentLogs.length,
    recentLogs,
  });
}
