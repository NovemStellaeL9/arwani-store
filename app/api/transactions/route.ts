import { NextResponse } from "next/server";
import { getTransactions, findTransaction } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const refid = searchParams.get("refid");

  if (refid) {
    const tx = findTransaction(refid);
    if (!tx) {
      return NextResponse.json({ success: false, message: "Transaksi tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, transaction: tx });
  }

  const list = getTransactions();
  return NextResponse.json({ success: true, total: list.length, transactions: list });
}

