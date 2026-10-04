import { NextRequest, NextResponse } from "next/server";
import { PurchaseResponse } from "@/types/product";

const RUANG_KUOTA_KEY = process.env.RUANG_KUOTA_API_KEY || "78e19cdde458c8ace3ac0baaefea005f8ff5a5d579488ea582c2ef9cd8e903173d4ef3c0ddd58996654e65aa6cb9b8729562c52be518877d92cff80ce1671b2651b56a07b3d21f1a922371";
const BASE_URL = process.env.RUANG_KUOTA_BASE_URL || "https://service.ruang-kuota.my.id";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productcode, phonenumber } = body;

    if (!productcode || !phonenumber) {
      return NextResponse.json(
        { success: false, message: "Kode produk dan nomor HP wajib diisi" },
        { status: 400 }
      );
    }

    // Normalisasi format nomor HP (08xxx)
    let cleanPhone = phonenumber.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("62")) {
      cleanPhone = "0" + cleanPhone.slice(2);
    }

    // RefID unik untuk transaksi ini
    const refid = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const queryParams = new URLSearchParams({
      apikey: RUANG_KUOTA_KEY,
      productcode: productcode,
      phonenumber: cleanPhone,
      refid: refid,
    });

    const targetUrl = `${BASE_URL}/user/purchase?${queryParams.toString()}`;
    const res = await fetch(targetUrl, { method: "GET" });
    const responseText = await res.text();

    let parsedParams: URLSearchParams;
    if (responseText.includes("?")) {
      parsedParams = new URLSearchParams(responseText.split("?")[1]);
    } else {
      parsedParams = new URLSearchParams(responseText);
    }

    const status = parsedParams.get("status") || "unknown";
    const message = parsedParams.get("message") || "Transaksi telah dikirim";
    const trxuuid = parsedParams.get("trxuuid") || "";
    const returnedRefId = parsedParams.get("refid") || refid;
    const price = Number(parsedParams.get("price")) || 0;

    const isSuccess = status === "00";

    const result: PurchaseResponse = {
      success: isSuccess,
      refid: returnedRefId,
      trxuuid: trxuuid,
      status: status,
      productcode: productcode,
      phonenumber: cleanPhone,
      price: price,
      message: message,
      time: parsedParams.get("time") || new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error eksekusi pembelian:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Gagal menghubungkan ke server Ruang Kuota",
      },
      { status: 500 }
    );
  }
}
