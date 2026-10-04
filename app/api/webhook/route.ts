import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🔔 [WEBHOOK RUANG KUOTA DITERIMA]:", body);

    return NextResponse.json({
      status: "success",
      message: "Webhook diterima dengan baik",
    });
  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { status: "error", message: error.message },
      { status: 400 }
    );
  }
}
