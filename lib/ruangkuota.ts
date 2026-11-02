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
  "6a18c64bd19cdb594459bce29fc3fc0410a1a69b0948a77cb5e4feaf82f0b3e7164a58c4cdf17b823c8f38acb1e7b460650476cea2c65378355049e82dfa0741f3fb5dcb68c0010140f02b";

export const SERVICE_BASE_URL = "https://service.ruang-kuota.my.id";

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
  const response = await fetch(`${SERVICE_BASE_URL}/user/products/stock`, {
    headers: {
      "x-api-key": RUANG_KUOTA_API_KEY,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Gagal memuat produk dari server penyedia: HTTP ${response.status}`);
  }

  const json = await response.json();
  if (!json.success || !json.data || !Array.isArray(json.data.products)) {
    throw new Error("Format respon server produk tidak sesuai");
  }

  return json.data.products;
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

export function mapCategoryToDisplay(category: string, productName: string): {
  group: string;
  subgroup: string;
  operator: string;
} {
  const cat = category.toUpperCase();
  const name = productName.toLowerCase();

  if (cat.startsWith("MASA_AKTIF") || cat === "LAINNYA_CAT_10" || cat === "LAINNYA_CAT_11" || cat === "LAINNYA_CAT_12" || cat === "LAINNYA_CAT_13" || cat === "LAINNYA_CAT_23") {
    let op = "Lainnya";
    if (cat.includes("XL") || cat === "LAINNYA_CAT_10") op = "XL";
    else if (cat.includes("INDOSAT") || cat === "LAINNYA_CAT_11") op = "Indosat";
    else if (cat.includes("TELKOMSEL") || cat === "LAINNYA_CAT_12") op = "Telkomsel";
    else if (cat.includes("TRI") || cat === "LAINNYA_CAT_13") op = "Tri";
    else if (cat.includes("AXIS") || cat === "LAINNYA_CAT_23") op = "Axis";
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

