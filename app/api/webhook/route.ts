import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { resolveStatusLabel } from "@/lib/ruangkuota";
import { logWebhook, getWebhookLogs, findTransaction, saveTransaction } from "@/lib/transactionStore";

export const dynamic = "force-dynamic";

function hasValidSecret(req: Request): boolean {
  const expected = process.env.WEBHOOK_SECRET;
  if (!expected) return true;

  const authorization = req.headers.get("authorization") || "";
  const supplied =
    req.headers.get("x-webhook-secret") ||
    authorization.replace(/^Bearer\s+/i, "");
  const expectedBytes = Buffer.from(expected);
  const suppliedBytes = Buffer.from(supplied);
  return expectedBytes.length === suppliedBytes.length && timingSafeEqual(expectedBytes, suppliedBytes);
}

export async function POST(req: Request) {
  try {
    if (!hasValidSecret(req)) {
      return NextResponse.json({ success: false, message: "Secret webhook tidak valid." }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";
    let bodyData: Record<string, unknown>;

    if (contentType.includes("application/json")) {
      const body: unknown = await req.json();
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return NextResponse.json({ success: false, message: "Format webhook tidak valid." }, { status: 400 });
      }
      bodyData = body as Record<string, unknown>;
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      bodyData = Object.fromEntries(params.entries());
    } else {
      const rawText = await req.text();
      try {
        const parsed: unknown = JSON.parse(rawText);
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          return NextResponse.json({ success: false, message: "Format webhook tidak valid." }, { status: 400 });
        }
        bodyData = parsed as Record<string, unknown>;
      } catch {
        bodyData = { raw: rawText };
      }
    }

    // Extract headers for logging
    const headersObj: Record<string, string> = {};
    req.headers.forEach((val, key) => {
      headersObj[key] = ["authorization", "cookie", "set-cookie", "x-api-key", "x-webhook-secret"].includes(key)
        ? "[REDACTED]"
        : val;
    });

    const status = typeof bodyData.status === "string" ? bodyData.status.trim() : "";
    const refid = String(bodyData.refid || bodyData.reference_id || "").trim();
    const message =
      typeof bodyData.message === "string" && bodyData.message.trim()
        ? bodyData.message.trim()
        : status === "00"
          ? "Notifikasi transaksi berhasil"
          : status
            ? "Notifikasi transaksi diterima"
            : "Status transaksi belum tersedia";
    const statusLabel = resolveStatusLabel(status, message);

    const logged = logWebhook({
      headers: headersObj,
      body: bodyData,
      status,
      message,
    });

    // If refid exists, update stored transaction
    if (refid && (status === "00" || status === "01" || status === "02")) {
      const existing = findTransaction(refid);
      if (existing) {
        saveTransaction({
          ...existing,
          status,
          statusLabel,
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
  } catch (error: unknown) {
    console.error("Webhook receiver error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal memproses webhook: " + (error instanceof Error ? error.message : "Kesalahan server"),
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
