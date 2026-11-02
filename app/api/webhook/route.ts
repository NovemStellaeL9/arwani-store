import { NextResponse } from "next/server";
import { logWebhook, getWebhookLogs, findTransaction, saveTransaction } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let bodyData: any = {};

    if (contentType.includes("application/json")) {
      try {
        bodyData = await req.json();
      } catch {
        bodyData = {};
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      bodyData = Object.fromEntries(params.entries());
    } else {
      const rawText = await req.text();
      try {
        bodyData = JSON.parse(rawText);
      } catch {
        bodyData = { raw: rawText };
      }
    }

    // Extract headers for logging
    const headersObj: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headersObj[key] = val;
    });

    const status = bodyData.status || "00";
    const refid = bodyData.refid || bodyData.reference_id || "";
    const message = bodyData.message || (status === "00" ? "Notifikasi transaksi berhasil" : "Notifikasi transaksi gagal");

    const logged = logWebhook({
      headers: headersObj,
      body: bodyData,
      status,
      message,
    });

    // If refid exists, update stored transaction
    if (refid) {
      const existing = findTransaction(refid);
      if (existing) {
        saveTransaction({
          ...existing,
          status,
          statusLabel: status === "00" ? "Sukses" : "Gagal",
          message: message || existing.message,
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Webhook diterima dengan baik oleh Arwani Store.",
      webhookId: logged.id,
      timestamp: logged.receivedAt,
    });
  } catch (error: any) {
    console.error("Webhook receiver error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memproses webhook: " + (error?.message || "Kesalahan server"),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const logs = getWebhookLogs();
  return NextResponse.json({
    success: true,
    endpoint: "https://arwani-store.vercel.app/api/webhook",
    totalLogs: logs.length,
    recentLogs: logs.slice(0, 20),
  });
}

