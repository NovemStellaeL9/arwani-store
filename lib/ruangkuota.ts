import { Product, OperatorName, PackageCategory } from "@/types/product";
import { calculateSellingPrice } from "@/utils/helpers";

export interface RuangKuotaProduct {
  code: string;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export interface PurchaseResult {
  success: boolean;
  refid: string;
  trxuuid: string;
  userid?: string;
  username?: string;
  status: "00" | "01" | "02" | string;
  productcode: string;
  phonenumber: string;
  price: number;
  saldoawal?: number;
  saldoakhir?: number;
  time?: string;
  message: string;
  raw: string;
}

export const RUANG_KUOTA_API_KEY =
  process.env.RUANG_KUOTA_API_KEY ||
  "e0c71040fb8a1f3730858c1d9cbb89db5bf1e40bd4088a2e5614c76bbe9a5838cd871a7bc2fe814ffc5146acec445cdf339cf7e906c9b1543557b110c7dc1d88459233f4e5096de6cc51cc";

export const SERVICE_BASE_URL =
  process.env.RUANG_KUOTA_BASE_URL || "https://service.ruang-kuota.my.id";

export function parseReportString(text: string): PurchaseResult {
  const cleanText = text.replace(/^report\?/, "").trim();
  const params = new URLSearchParams(cleanText);

  const status = params.get("status") || "02";
  const refid = params.get("refid") || "";
  const trxuuid = params.get("trxuuid") || "";
  const productcode = params.get("productcode") || "";
  const phonenumber = params.get("phonenumber") || "";
  const message = params.get("message") || "";
  const price = Number(params.get("price")) || 0;
  const saldoawal = Number(params.get("saldoawal")) || 0;
  const saldoakhir = Number(params.get("saldoakhir")) || 0;
  const time = params.get("time") || "";
  const userid = params.get("userid") || "";
  const username = params.get("username") || "";

  return {
    success: status === "00",
    refid,
    trxuuid,
    userid,
    username,
    status,
    productcode,
    phonenumber,
    price,
    saldoawal,
    saldoakhir,
    time,
    message,
    raw: text,
  };
}

export async function fetchLiveStock(): Promise<RuangKuotaProduct[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 7000);

  try {
    const response = await fetch(`${SERVICE_BASE_URL}/user/products/stock`, {
      headers: {
        "x-api-key": RUANG_KUOTA_API_KEY,
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gagal memuat produk dari server penyedia: HTTP ${response.status}`);
    }

    const json = (await response.json()) as {
      success: boolean;
      data?: { products: RuangKuotaProduct[] };
    };

    if (!json.success || !json.data || !Array.isArray(json.data.products)) {
      throw new Error("Format respon server produk tidak sesuai");
    }

    // Filter KETAT: Hanya produk yang BENAR-BENAR TERSEDIA (stock > 0)
    // dan bukan produk pengecekan (seperti 'Cek PLN')
    return json.data.products.filter(
      (p) => p.stock > 0 && p.name && !p.name.toLowerCase().includes("cek pln")
    );
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function executePurchase(params: {
  productcode: string;
  phonenumber: string;
  refid: string;
}): Promise<PurchaseResult> {
  const query = new URLSearchParams({
    apikey: RUANG_KUOTA_API_KEY,
    productcode: params.productcode,
    phonenumber: params.phonenumber,
    refid: params.refid,
  });

  const response = await fetch(`${SERVICE_BASE_URL}/user/purchase?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  return parseReportString(text);
}

export async function checkPurchaseStatus(params: {
  refid: string;
  productcode?: string;
  phonenumber?: string;
}): Promise<PurchaseResult> {
  const query = new URLSearchParams({
    apikey: RUANG_KUOTA_API_KEY,
    refid: params.refid,
    productcode: params.productcode || "CHECK",
    phonenumber: params.phonenumber || "08000000000",
  });

  const response = await fetch(`${SERVICE_BASE_URL}/user/purchase?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  const text = await response.text();
  return parseReportString(text);
}

/**
 * Memetakan produk live dari provider menjadi format Product aplikasi
 * dengan kalkulasi harga jual akhir (Selling Price) via calculateSellingPrice(costPrice).
 */
export function mapLiveProductToApp(p: RuangKuotaProduct, index: number): Product {
  let name = (p.name || "").trim();
  if (p.code === "50gbTri" && !name) {
    name = "Tri Data Happy 50GB, 28 Hari";
  }

  const nameLower = name.toLowerCase();
  const catUpper = (p.category || "").toUpperCase();

  let operator: OperatorName = "Lainnya";
  if (nameLower.includes("telkomsel") || catUpper.includes("TELKOMSEL")) {
    operator = "Telkomsel";
  } else if (
    nameLower.includes("indosat") ||
    catUpper.includes("INDOSAT") ||
    nameLower.includes("im3") ||
    nameLower.includes("freedom")
  ) {
    operator = "Indosat";
  } else if (nameLower.includes("axis") || catUpper.includes("AXIS")) {
    operator = "Axis";
  } else if (
    nameLower.includes("flex") ||
    nameLower.includes("akrab") ||
    nameLower.includes("ark") ||
    catUpper.includes("XL") ||
    catUpper.startsWith("AKRAB") ||
    nameLower.includes("pulsa")
  ) {
    operator = "XL";
  } else if (nameLower.includes("tri") || catUpper.includes("TRI")) {
    operator = "Tri";
  } else if (nameLower.includes("pln") || catUpper.includes("PLN")) {
    operator = "PLN";
  } else if (nameLower.includes("dana")) {
    operator = "DANA";
  }

  let packageCategory: PackageCategory = "Bulanan";
  if (nameLower.includes("masa aktif")) {
    packageCategory = "Masa Aktif";
  } else if (
    nameLower.includes("1 h") ||
    nameLower.includes("1 hari") ||
    nameLower.includes("2 h") ||
    nameLower.includes("2 hari") ||
    nameLower.includes("3 h") ||
    nameLower.includes("3 hari") ||
    nameLower.includes("5 h") ||
    nameLower.includes("5 hari")
  ) {
    packageCategory = "Harian";
  } else if (
    nameLower.includes("7 h") ||
    nameLower.includes("7 hari") ||
    nameLower.includes("14 hari")
  ) {
    packageCategory = "Mingguan";
  } else if (
    nameLower.includes("akrab") ||
    nameLower.includes("ark") ||
    catUpper.startsWith("AKRAB") ||
    nameLower.includes("v4") ||
    nameLower.includes("v5") ||
    nameLower.includes("v2")
  ) {
    packageCategory = "Combo";
  } else if (nameLower.includes("unlimited") || nameLower.includes("fup")) {
    packageCategory = "Unlimited";
  }

  // Quota match
  const quotaMatch = name.match(/(\d+(\.\d+)?\s*(GB|MB))/i);
  let quota = quotaMatch ? quotaMatch[0].toUpperCase() : "Kuota Data";
  if (operator === "PLN") quota = "Token Listrik";
  else if (operator === "DANA") quota = "Saldo DANA";
  else if (packageCategory === "Masa Aktif") quota = "Masa Aktif";
  else if (nameLower.includes("pulsa")) quota = "Pulsa Transfer";

  // Validity match
  let validity = "28 - 30 Hari";
  if (nameLower.includes("360 hari")) validity = "360 Hari";
  else if (nameLower.includes("180 hari")) validity = "180 Hari";
  else if (nameLower.includes("90 hari")) validity = "90 Hari";
  else if (nameLower.includes("4 bulan")) validity = "120 Hari";
  else if (nameLower.includes("28 hari")) validity = "28 Hari";
  else if (nameLower.includes("30 hari")) validity = "30 Hari";
  else if (nameLower.includes("7 hari") || nameLower.includes("7 h")) validity = "7 Hari";
  else if (nameLower.includes("5 hari") || nameLower.includes("5 h")) validity = "5 Hari";
  else if (nameLower.includes("3 hari") || nameLower.includes("3 h")) validity = "3 Hari";
  else if (nameLower.includes("2 hari") || nameLower.includes("2 h")) validity = "2 Hari";
  else if (nameLower.includes("1 hari") || nameLower.includes("1 h")) validity = "1 Hari";

  const costPrice = p.price;
  const sellingPrice = calculateSellingPrice(costPrice);
  const markup = sellingPrice - costPrice;

  return {
    id: `LIVE-${p.code}-${index}`,
    code: p.code,
    name,
    operator,
    packageCategory,
    category: p.category,
    costPrice,
    price: sellingPrice,
    markup,
    validity,
    quota,
    desc: `${quota} resmi server pusat. Masa aktif ${validity}.`,
    stock: p.stock,
    isAvailable: true,
    isPopular: costPrice >= 35000 && costPrice <= 90000,
  };
}
