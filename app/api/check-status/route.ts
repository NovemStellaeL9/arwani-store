import { NextRequest, NextResponse } from "next/server";
import { findTransaction } from "@/lib/transactionStore";
import { checkPurchaseStatus } from "@/lib/ruangkuota";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const refid = searchParams.get("refid");

    if (!refid) {
      return NextResponse.json(
        { success: false, message: "Parameter refid wajib disertakan." },
        { status: 400 }
      );
    }

    const tx = findTransaction(refid);

    if (!tx) {
      return NextResponse.json(
        { success: false, message: `Transaksi ${refid} tidak ditemukan.` },
        { status: 404 }
      );
    }

    // Jika transaksi sudah PAID atau PROCESSING, coba periksa live status ke provider
    if (tx.status === "PAID" || tx.status === "PROCESSING") {
      try {
        const liveStatus = await checkPurchaseStatus({
          refid: tx.refid,
          productcode: tx.productCode,
          phonenumber: tx.phoneNumber,
        });

        if (liveStatus.status === "00") {
          tx.status = "SUCCESS";
          tx.statusLabel = "Kuota Berhasil Dikirim";
          tx.sn = liveStatus.trxuuid || liveStatus.refid;
          tx.message = liveStatus.message || "Paket data berhasil masuk.";
        } else if (liveStatus.status === "01") {
          tx.status = "FAILED";
          tx.statusLabel = "Gagal";
          tx.message = liveStatus.message || "Gagal diproses provider.";
        }
      } catch {
        // Abaikan jika server provider lambat merespon
      }
    }

    return NextResponse.json({
      success: true,
      transaction: tx,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kendala saat memeriksa status";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
