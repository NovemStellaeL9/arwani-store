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

export type PublicPurchaseResult = Pick<
  PurchaseResult,
  "success" | "refid" | "trxuuid" | "status" | "productcode" | "phonenumber" | "price" | "time" | "message"
> & {
  statusLabel: "Sukses" | "Diproses" | "Gagal";
};

export const RUANG_KUOTA_API_KEY = process.env.RUANG_KUOTA_API_KEY || "";

export const SERVICE_BASE_URL = "https://service.ruang-kuota.my.id";
const REQUEST_TIMEOUT_MS = 15_000;

function requireApiKey(): string {
  if (!RUANG_KUOTA_API_KEY) {
    throw new Error("RUANG_KUOTA_API_KEY belum dikonfigurasi.");
  }
  return RUANG_KUOTA_API_KEY;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

function toNumberValue(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

export function parseReportString(text: string): PurchaseResult {
  const cleanText = text.trim().replace(/^report\?/, "");
  const params = new URLSearchParams(cleanText);
  let json: Record<string, unknown> = {};

  if (cleanText.startsWith("{")) {
    try {
      const parsed: unknown = JSON.parse(cleanText);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        json = parsed as Record<string, unknown>;
      }
    } catch {
      json = {};
    }
  }

  const read = (key: string) => params.get(key) ?? toStringValue(json[key]);

  const status = read("status") || "02";
  const refid = read("refid");
  const trxuuid = read("trxuuid");
  const productcode = read("productcode");
  const phonenumber = read("phonenumber");
  const message = read("message");
  const price = toNumberValue(read("price"));
  const saldoawal = toNumberValue(read("saldoawal"));
  const saldoakhir = toNumberValue(read("saldoakhir"));
  const time = read("time");
  const userid = read("userid");
  const username = read("username");

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

export function resolveStatusLabel(
  status: string,
  message = ""
): "Sukses" | "Diproses" | "Gagal" {
  if (status === "00") return "Sukses";
  if (status === "02") {
    return /sedang diproses|diproses|dalam proses/i.test(message) ? "Diproses" : "Gagal";
  }
  if (status === "01") return "Gagal";
  return "Diproses";
}

export function toPublicResult(
  result: PurchaseResult,
  publicPrice: number = result.price
): PublicPurchaseResult {
  return {
    success: result.status === "00",
    refid: result.refid,
    trxuuid: result.trxuuid,
    status: result.status,
    statusLabel: resolveStatusLabel(result.status, result.message),
    productcode: result.productcode,
    phonenumber: result.phonenumber,
    price: publicPrice,
    time: result.time,
    message: result.message,
  };
}

export async function fetchLiveStock(): Promise<RuangKuotaProduct[]> {
  const response = await fetch(`${SERVICE_BASE_URL}/user/products/stock`, {
    headers: {
      "x-api-key": requireApiKey(),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Gagal memuat produk dari server penyedia: HTTP ${response.status}`);
  }

  const json: unknown = await response.json();
  if (!json || typeof json !== "object" || !("success" in json) || !("data" in json)) {
    throw new Error("Format respon server produk tidak sesuai");
  }
  const data = json.data;
  if (
    json.success !== true ||
    !data ||
    typeof data !== "object" ||
    !("products" in data) ||
    !Array.isArray(data.products)
  ) {
    throw new Error("Format respon server produk tidak sesuai");
  }

  return data.products.map((item: unknown) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error("Format produk dari server penyedia tidak sesuai");
    }
    const product = item as Record<string, unknown>;
    const code = toStringValue(product.code).trim();
    const name = toStringValue(product.name).trim();
    const category = toStringValue(product.category).trim();
    const stock = Number(product.stock);
    const price = Number(product.price);

    if (
      !code ||
      !name ||
      !category ||
      !Number.isFinite(stock) ||
      stock < 0 ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      throw new Error("Data produk dari server penyedia tidak valid");
    }

    return { code, name, category, stock, price };
  });
}

export async function executePurchase(params: {
  productcode: string;
  phonenumber: string;
  refid: string;
}): Promise<PurchaseResult> {
  const query = new URLSearchParams({
    apikey: requireApiKey(),
    productcode: params.productcode,
    phonenumber: params.phonenumber,
    refid: params.refid,
  });

  const response = await fetch(`${SERVICE_BASE_URL}/user/purchase?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Gagal memproses pembelian ke server penyedia: HTTP ${response.status}`);
  }

  const text = await response.text();
  return parseReportString(text);
}

export async function checkPurchaseStatus(params: {
  refid: string;
  productcode?: string;
  phonenumber?: string;
}): Promise<PurchaseResult> {
  const query = new URLSearchParams({
    apikey: requireApiKey(),
    refid: params.refid,
    productcode: params.productcode || "CHECK",
    phonenumber: params.phonenumber || "08000000000",
  });

  const response = await fetch(`${SERVICE_BASE_URL}/user/purchase?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(`Gagal memeriksa status ke server penyedia: HTTP ${response.status}`);
  }

  const text = await response.text();
  return parseReportString(text);
}

function findMobileProvider(category: string, productName: string): string | undefined {
  const value = `${category} ${productName}`.toLowerCase();
  if (value.includes("telkomsel")) return "Telkomsel";
  if (/\bby[\s.-]?u\b|\bbyu\b/.test(value)) return "by.U";
  if (value.includes("smartfren")) return "Smartfren";
  if (value.includes("indosat") || value.includes("im3")) return "Indosat";
  if (/\btri\b/.test(value)) return "Tri";
  if (value.includes("axis")) return "Axis";
  if (/\bxl\b/.test(value)) return "XL";
  return undefined;
}

export function mapCategoryToDisplay(category: string, productName: string): {
  group: string;
  subgroup: string;
  operator: string;
} {
  const cat = category.toUpperCase();
  const name = productName.toLowerCase();

  if (cat.startsWith("MASA_AKTIF") || cat === "LAINNYA_CAT_10" || cat === "LAINNYA_CAT_11" || cat === "LAINNYA_CAT_12" || cat === "LAINNYA_CAT_13" || cat === "LAINNYA_CAT_23") {
    const op =
      findMobileProvider(category, productName) ||
      (cat === "LAINNYA_CAT_10" ? "XL" :
        cat === "LAINNYA_CAT_11" ? "Indosat" :
          cat === "LAINNYA_CAT_12" ? "Telkomsel" :
            cat === "LAINNYA_CAT_13" ? "Tri" :
              cat === "LAINNYA_CAT_23" ? "Axis" : "Lainnya");
    return { group: "Masa Aktif", subgroup: `Masa Aktif ${op}`, operator: op };
  }

  if (cat === "PLN" || cat === "LAINNYA_CAT_14") {
    return { group: "PLN", subgroup: "Token Listrik PLN", operator: "PLN" };
  }

  if (cat === "LAINNYA_CAT_3" || name.includes("dana")) {
    return { group: "E-Wallet", subgroup: "Top Up DANA", operator: "DANA" };
  }

  if (cat === "LAINNYA_CAT_1" || name.includes("pulsa")) {
    return { group: "Pulsa", subgroup: "Pulsa Transfer XL/Axis", operator: "XL & Axis" };
  }

  if (cat === "LAINNYA_CAT_20" || name.includes("im3") || name.includes("freedom")) {
    return { group: "Indosat", subgroup: "Freedom Internet", operator: "Indosat" };
  }

  if (cat === "LAINNYA_CAT_26" || name.includes("tri data happy")) {
    return { group: "Tri", subgroup: "Tri Data Happy", operator: "Tri" };
  }

  const mobileProvider = findMobileProvider(category, productName);
  if (mobileProvider === "Telkomsel" || mobileProvider === "by.U" || mobileProvider === "Smartfren" || mobileProvider === "Indosat" || mobileProvider === "Tri") {
    return { group: mobileProvider, subgroup: mobileProvider, operator: mobileProvider };
  }

  if (cat.startsWith("AKRAB")) {
    return { group: "XL & Axis", subgroup: `XL Akrab (${cat})`, operator: "XL & Axis" };
  }

  if (cat === "ARK") {
    return { group: "XL & Axis", subgroup: "XL Paket Ark", operator: "XL & Axis" };
  }

  if (cat.startsWith("FLEX") || cat === "LAINNYA_CAT_24" || cat === "LAINNYA_CAT_25") {
    const isMini = cat.includes("MINI") || cat === "LAINNYA_CAT_24";
    const isMax = cat.includes("MAX") || cat === "LAINNYA_CAT_25";
    const sub = isMini ? "XL Flex Mini" : isMax ? "XL Flex Max" : "XL Flex Combo";
    return { group: "XL & Axis", subgroup: sub, operator: "XL & Axis" };
  }

  if (cat === "AXIS" || cat === "LAINNYA_CAT_4") {
    return { group: "XL & Axis", subgroup: "Axis Aigo Bronet", operator: "Axis" };
  }

  if (cat === "LAINNYA_CAT_27") {
    return { group: "Hiburan", subgroup: "Kuota Aplikasi Harian", operator: "Lainnya" };
  }

  return { group: "Lainnya", subgroup: category, operator: "Lainnya" };
}
