const WHATSAPP_NUMBER = "6285967096912";

export const formatRupiah = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace("Rp", "Rp ");
};

export const getPackageType = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("akrab")) return "XL Akrab";
  if (n.includes("by.u")) return "Paket by.U";
  if (n.includes("circel")) return "Circel Reguler 28 Hari";
  if (n.includes("flex max") || n.includes("flexmax")) return "Flex Max";
  if (n.includes("flex mini")) return "Flex Mini";
  if (n.includes("flex")) return "Combo Flex";
  if (n.includes("freedom")) return "Freedom Internet";
  if (n.includes("happy") || n.includes("tri data")) return "Tri Data Happy";
  if (n.includes("bronet") || n.includes("aigo")) return "AIGO BRONET";
  if (n.includes("dana")) return "Top Up DANA";
  if (n.includes("pln") || n.includes("token")) return "Token PLN";
  if (n.includes("masa aktif")) return "Masa Aktif";
  if (n.includes("pulsa")) return "Pulsa Transfer";
  if (n.includes("instagram")) return "Kuota Aplikasi";
  return "Paket Reguler";
};

const PROVIDER_LOGOS: Record<string, string> = {
  Telkomsel: "/telkomsel.png",
  "by.U": "/byu.png",
  Indosat: "/indosat.png",
  "XL & Axis": "/xl.png",
  XL: "/xl.png",
  Axis: "/xl.png",
  Tri: "/tri.png",
  Smartfren: "/smartfren.png",
};

const MASA_AKTIF_LOGOS: Record<string, string> = {
  Telkomsel: "/telkomsel.png",
  Indosat: "/indosat.png",
  Tri: "/tri.png",
  Axis: "/xl.png",
  XL: "/xl.png",
};

export const getProviderLogo = (cat: string): string => PROVIDER_LOGOS[cat] ?? "";
export const getMasaAktifLogo = (op: string): string => MASA_AKTIF_LOGOS[op] ?? "";

export const getTypeColor = (
  t: string
): { bg: string; text: string; border: string } => {
  switch (t) {
    case "XL Akrab":
      return { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" };
    case "Freedom Internet":
      return { bg: "#EDE9FE", text: "#5B21B6", border: "#8B5CF6" };
    case "Tri Data Happy":
      return { bg: "#FCE7F3", text: "#9D174D", border: "#EC4899" };
    case "AIGO BRONET":
      return { bg: "#DBEAFE", text: "#1E40AF", border: "#3B82F6" };
    case "Flex Max":
    case "Combo Flex":
      return { bg: "#ECFDF5", text: "#065F46", border: "#10B981" };
    case "Top Up DANA":
      return { bg: "#EFF6FF", text: "#1D4ED8", border: "#60A5FA" };
    case "Token PLN":
      return { bg: "#FEF9C3", text: "#854D0E", border: "#EAB308" };
    case "Masa Aktif":
      return { bg: "#E0F2FE", text: "#0369A1", border: "#0284C7" };
    default:
      return { bg: "#F1F5F9", text: "#334155", border: "#94A3B8" };
  }
};

export const getWaLink = (
  name: string,
  price: number | string,
  targetNumber?: string,
  refid?: string
): string => {
  const formattedPrice = typeof price === "number" ? formatRupiah(price) : price;
  const priceText = formattedPrice ? ` seharga ${formattedPrice}` : "";
  const phoneText = targetNumber ? ` untuk nomor ${targetNumber}` : "";
  const refText = refid ? ` (ID Pesanan: ${refid})` : "";
  const msg = `Halo Arwani D'Gabriel Store, saya ingin memesan ${name}${priceText}${phoneText}${refText}. Mohon panduan konfirmasi pembayarannya. Terima kasih.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export const detectOperator = (num: string): string => {
  const clean = num.replace(/[^0-9]/g, "");
  if (clean.startsWith("62")) return detectOperator("0" + clean.slice(2));

  const prefix4 = clean.slice(0, 4);

  // Telkomsel
  if (["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"].includes(prefix4)) {
    return "Telkomsel";
  }
  // Indosat
  if (["0814", "0815", "0816", "0855", "0856", "0857", "0858"].includes(prefix4)) {
    return "Indosat";
  }
  // XL
  if (["0817", "0818", "0819", "0859", "0877", "0878"].includes(prefix4)) {
    return "XL";
  }
  // Axis
  if (["0831", "0832", "0833", "0838"].includes(prefix4)) {
    return "Axis";
  }
  // Tri
  if (["0895", "0896", "0897", "0898", "0899"].includes(prefix4)) {
    return "Tri";
  }
  // Smartfren
  if (["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"].includes(prefix4)) {
    return "Smartfren";
  }

  return "";
};
