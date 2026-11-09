// Format mata uang Rupiah Indonesia
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

/**
 * =========================================================================
 * TEMPAT MENGATUR & MENGEDIT HARGA / MARKUP KEUNTUNGAN:
 * =========================================================================
 * Jika Anda ingin mengubah harga jual, ubah angka pada fungsi di bawah ini:
 *
 * 1. BATAS MODAL (Threshold): Saat ini Rp 85.000 (costPrice > 85000).
 * 2. MARKUP TIER TINGGI: Saat ini +10000 (costPrice + 10000).
 *    -> Contoh jika ingin untung Rp 15.000, ganti 10000 menjadi 15000.
 * 3. MARKUP TIER RENDAH: Saat ini +5000 (markup = 5000).
 *    -> Contoh jika ingin untung Rp 4.000, ganti 5000 menjadi 4000.
 */
export const calculateSellingPrice = (costPrice: number): number => {
  if (costPrice <= 0) return 0;

  // Jika harga modal > Rp 85.000: Tambah untung Rp 10.000
  if (costPrice > 85000) {
    return costPrice + 10000;
  }

  // Jika harga modal <= Rp 85.000: Tambah untung Rp 5.000
  const markup = 5000;
  const rawPrice = costPrice + markup;

  // Dibulatkan ke kelipatan 500 terdekat untuk kemudahan transfer
  return Math.ceil(rawPrice / 500) * 500;
};

// Hitung besaran margin keuntungan
export const getMarkupAmount = (costPrice: number): number => {
  return calculateSellingPrice(costPrice) - costPrice;
};

/**
 * Deteksi otomatis operator berdasarkan 4 digit prefix nomor telepon Indonesia:
 */
export const detectOperator = (num: string): string => {
  if (!num) return "";
  const clean = num.replace(/[^0-9]/g, "");

  if (clean.startsWith("62")) {
    return detectOperator("0" + clean.slice(2));
  }

  if (clean.length < 4) return "";

  const prefix4 = clean.slice(0, 4);

  // Telkomsel
  if (["0811", "0812", "0813", "0821", "0822", "0823", "0851", "0852", "0853"].includes(prefix4)) {
    return "Telkomsel";
  }
  // Indosat Ooredoo Hutchison
  if (["0814", "0815", "0816", "0855", "0856", "0857", "0858"].includes(prefix4)) {
    return "Indosat";
  }
  // XL Axiata
  if (["0817", "0818", "0819", "0859", "0877", "0878"].includes(prefix4)) {
    return "XL";
  }
  // Axis
  if (["0831", "0832", "0833", "0838"].includes(prefix4)) {
    return "Axis";
  }
  // Tri (3)
  if (["0895", "0896", "0897", "0898", "0899"].includes(prefix4)) {
    return "Tri";
  }
  // Smartfren
  if (["0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889"].includes(prefix4)) {
    return "Smartfren";
  }

  return "";
};

// Operator Brand Data
export const OPERATOR_META: Record<
  string,
  {
    name: string;
    logo: string;
    color: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
  }
> = {
  Telkomsel: {
    name: "Telkomsel",
    logo: "/telkomsel.png",
    color: "#E11D48",
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-400",
    borderColor: "border-red-500/30",
  },
  Indosat: {
    name: "Indosat",
    logo: "/indosat.png",
    color: "#F59E0B",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    borderColor: "border-amber-500/30",
  },
  XL: {
    name: "XL Axiata",
    logo: "/xl.png",
    color: "#2563EB",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
  Axis: {
    name: "Axis",
    logo: "/xl.png",
    color: "#9333EA",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-400",
    borderColor: "border-purple-500/30",
  },
  Tri: {
    name: "Tri (3)",
    logo: "/tri.png",
    color: "#EC4899",
    badgeBg: "bg-pink-500/10",
    badgeText: "text-pink-400",
    borderColor: "border-pink-500/30",
  },
  Smartfren: {
    name: "Smartfren",
    logo: "/smartfren.png",
    color: "#F43F5E",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-400",
    borderColor: "border-rose-500/30",
  },
  PLN: {
    name: "Token Listrik PLN",
    logo: "/globe.svg",
    color: "#EAB308",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    borderColor: "border-amber-500/30",
  },
  DANA: {
    name: "Saldo DANA",
    logo: "/globe.svg",
    color: "#3B82F6",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
  Lainnya: {
    name: "Lainnya",
    logo: "/globe.svg",
    color: "#64748B",
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-300",
    borderColor: "border-slate-500/30",
  },
};

export const getOperatorMeta = (op: string) => {
  return (
    OPERATOR_META[op] || {
      name: op || "Umum",
      logo: "/globe.svg",
      color: "#64748B",
      badgeBg: "bg-slate-500/10",
      badgeText: "text-slate-300",
      borderColor: "border-slate-500/30",
    }
  );
};

export const getProviderLogo = (cat: string): string => {
  if (cat.includes("Telkomsel")) return "/telkomsel.png";
  if (cat.includes("Indosat")) return "/indosat.png";
  if (cat.includes("Axis")) return "/xl.png";
  if (cat.includes("XL")) return "/xl.png";
  if (cat.includes("Tri")) return "/tri.png";
  if (cat.includes("Smartfren")) return "/smartfren.png";
  if (cat.includes("by.U")) return "/byu.png";
  return "/globe.svg";
};

export const getMasaAktifLogo = (op: string): string => {
  return getProviderLogo(op);
};

export const getTypeColor = (): { bg: string; text: string; border: string } => {
  return { bg: "#EFF6FF", text: "#1D4ED8", border: "#60A5FA" };
};

// WhatsApp Link Generator Umum
export const getWaLink = (
  productName: string,
  price: number | string,
  targetNumber?: string,
  refid?: string
): string => {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_CS_WHATSAPP || "6285967096912";
  const formattedPrice = typeof price === "number" ? formatRupiah(price) : price;
  const priceText = formattedPrice ? ` seharga ${formattedPrice}` : "";
  const phoneText = targetNumber ? ` untuk nomor tujuan ${targetNumber}` : "";
  const refText = refid ? ` (ID Transaksi: ${refid})` : "";
  const msg = `Halo Admin Ilham Arwani, saya ingin konfirmasi pesanan ${productName}${priceText}${phoneText}${refText}. Terima kasih.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

/**
 * Format Pesan WhatsApp Konfirmasi Pembayaran Wajib
 */
export const getWaPaymentConfirmationLink = (params: {
  productName: string;
  totalAmount: number;
  phoneNumber: string;
  refid: string;
  paymentMethod: string;
}): string => {
  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_CS_WHATSAPP || "6285967096912";
  const methodLabel =
    params.paymentMethod === "GOPAY"
      ? "GoPay (085967096912 a/n Ilham Arwani)"
      : "QRIS Resmi (ILHAM ARWANI, EDUKASI)";

  const msg = `Halo Admin Ilham Arwani, saya sudah transfer untuk pesanan paket kuota:

📦 *Paket*: ${params.productName}
📱 *Nomor Tujuan*: ${params.phoneNumber}
💰 *Total Bayar*: ${formatRupiah(params.totalAmount)}
💳 *Metode Transfer*: ${methodLabel}
🆔 *ID Pesanan*: ${params.refid}

Berikut saya lampirkan bukti transfernya di chat ini. Mohon segera diproses ya Kak. Terima kasih!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};
