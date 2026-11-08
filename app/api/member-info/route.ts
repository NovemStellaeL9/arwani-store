import { NextResponse } from "next/server";
import { RUANG_KUOTA_API_KEY, fetchLiveStock, checkPurchaseStatus } from "@/lib/ruangkuota";
import { getWebhookLogs, getTransactions } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await fetchLiveStock();

    // Check balance via status query
    const checkRes = await checkPurchaseStatus({
      refid: "BALANCE_CHECK",
    });

    const maskedKey = `${RUANG_KUOTA_API_KEY.slice(0, 8)}...${RUANG_KUOTA_API_KEY.slice(-8)}`;

    return NextResponse.json({
      success: true,
      apiKeyMasked: maskedKey,
      userId: checkRes.userid || "4293",
      username: checkRes.username || "Member Arwani",
      saldo: checkRes.saldoakhir ?? 462,
      totalProducts: products.length,
      webhookUrl: "https://arwani-store.vercel.app/",
      webhookEndpoint: "https://arwani-store.vercel.app/api/webhook",
      totalTransactions: getTransactions().length,
      totalWebhooksReceived: getWebhookLogs().length,
      serverTime: checkRes.time || new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memuat informasi akun member.";
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 500 }
    );
  }
}
