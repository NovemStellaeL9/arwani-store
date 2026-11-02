import { NextResponse } from "next/server";
import { fetchLiveStock } from "@/lib/ruangkuota";
import { getWebhookLogs, getTransactions } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await fetchLiveStock();

    return NextResponse.json({
      success: true,
      totalProducts: products.length,
      webhookUrl: "https://arwani-store.vercel.app/",
      webhookEndpoint: "https://arwani-store.vercel.app/api/webhook",
      totalTransactions: getTransactions().length,
      totalWebhooksReceived: getWebhookLogs().length,
      serverTime: new Date().toISOString(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Gagal memuat informasi integrasi.",
      },
      { status: 500 }
    );
  }
}
