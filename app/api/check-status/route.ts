import { NextResponse } from "next/server";
import { checkPurchaseStatus } from "@/lib/ruangkuota";
import { findTransaction, saveTransaction } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const refid = searchParams.get("refid");

    if (!refid || refid.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Parameter refid wajib disertakan." },
        { status: 400 }
      );
    }

    const existing = findTransaction(refid);
    const res = await checkPurchaseStatus({
      refid,
      productcode: existing?.productcode,
      phonenumber: existing?.phonenumber,
    });

    let statusLabel = "Diproses";
    if (res.status === "00") {
      statusLabel = "Sukses";
    } else if (res.status === "02" && !res.message.toLowerCase().includes("sedang diproses")) {
      statusLabel = "Gagal";
    }

    if (existing) {
      saveTransaction({
        ...existing,
        status: res.status,
        statusLabel,
        message: res.message || existing.message,
        trxuuid: res.trxuuid || existing.trxuuid,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...res,
        statusLabel,
      },
    });
  } catch (error: any) {
    console.error("API /api/check-status error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal memeriksa status pesanan." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const refid = body.refid;

    if (!refid || String(refid).trim() === "") {
      return NextResponse.json(
        { success: false, message: "Parameter refid wajib disertakan." },
        { status: 400 }
      );
    }

    const existing = findTransaction(refid);
    const res = await checkPurchaseStatus({
      refid,
      productcode: existing?.productcode,
      phonenumber: existing?.phonenumber,
    });

    let statusLabel = "Diproses";
    if (res.status === "00") {
      statusLabel = "Sukses";
    } else if (res.status === "02" && !res.message.toLowerCase().includes("sedang diproses")) {
      statusLabel = "Gagal";
    }

    if (existing) {
      saveTransaction({
        ...existing,
        status: res.status,
        statusLabel,
        message: res.message || existing.message,
        trxuuid: res.trxuuid || existing.trxuuid,
        updatedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...res,
        statusLabel,
      },
    });
  } catch (error: any) {
    console.error("API /api/check-status POST error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Gagal memeriksa status pesanan." },
      { status: 500 }
    );
  }
}

