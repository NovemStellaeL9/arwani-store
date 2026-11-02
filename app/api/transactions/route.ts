import { NextResponse } from "next/server";
import { getTransactions, findTransaction } from "@/lib/transactionStore";
import type { StoredTransaction } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

function toPublicTransaction(transaction: StoredTransaction) {
  return {
    refid: transaction.refid,
    trxuuid: transaction.trxuuid,
    productcode: transaction.productcode,
    productName: transaction.productName,
    category: transaction.category,
    phonenumber: transaction.phonenumber,
    price: transaction.price,
    status: transaction.status,
    statusLabel: transaction.statusLabel,
    message: transaction.message,
    createdAt: transaction.createdAt,
    updatedAt: transaction.updatedAt,
    source: transaction.source,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const refid = searchParams.get("refid");

  if (refid) {
    const tx = findTransaction(refid);
    if (!tx) {
      return NextResponse.json({ success: false, message: "Transaksi tidak ditemukan." }, { status: 404 });
    }
    return NextResponse.json({ success: true, transaction: toPublicTransaction(tx) });
  }

  const list = getTransactions().map(toPublicTransaction);
  return NextResponse.json({ success: true, total: list.length, transactions: list });
}
