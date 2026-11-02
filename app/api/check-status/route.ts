import { NextResponse } from "next/server";
import { checkPurchaseStatus, resolveStatusLabel, toPublicResult } from "@/lib/ruangkuota";
import { findTransaction, saveTransaction } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

async function handleCheckStatus(refid: string) {
  if (!refid.trim()) {
    return NextResponse.json(
      { success: false, message: "Parameter refid wajib disertakan." },
      { status: 400 }
    );
  }

  try {
    const existing = findTransaction(refid);
    const res = await checkPurchaseStatus({
      refid,
      productcode: existing?.productcode,
      phonenumber: existing?.phonenumber,
    });

    const statusLabel = resolveStatusLabel(res.status, res.message);

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
      data: toPublicResult(res, existing?.price ?? 0),
    });
  } catch (error: unknown) {
    console.error("API /api/check-status error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Gagal memeriksa status pesanan." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  return handleCheckStatus(searchParams.get("refid") || "");
}

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const refid =
      body &&
      typeof body === "object" &&
      !Array.isArray(body) &&
      "refid" in body &&
      typeof body.refid === "string"
        ? body.refid.trim()
        : "";
    return handleCheckStatus(refid);
  } catch (error: unknown) {
    console.error("API /api/check-status POST error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Permintaan pemeriksaan status tidak valid." },
      { status: 400 }
    );
  }
}
