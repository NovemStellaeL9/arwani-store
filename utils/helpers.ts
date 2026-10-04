const WHATSAPP_NUMBER = "6285967096912";

export const formatRupiah = (price: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace("Rp", "Rp ");
};

export const getPackageType = (name: string): string => {
  const n = name.toLowerCase();
  if (n.includes('akrab'))                                   return 'AKRAB';
  if (n.includes('by.u'))                                    return 'Paket by.U';
  if (n.includes('circel'))                                  return 'Circel Reguler 28 Hari';
  if (n.includes('flexmax'))                                 return 'FlexMax'; 
  if (n.includes('flex'))                                    return 'Combo Flex';
  if (n.includes('flash'))                                   return 'Data Flash';
  if (n.includes('freedom'))                                 return 'Freedom';
  if (n.includes('always') || n.includes('alwayson'))        return 'AlwaysOn';
  if (n.includes('happy'))                                   return 'Happy';
  if (n.includes('bronet'))                                  return 'BRONET';
  if (n.includes('owsem'))                                   return 'OWSEM';
  if (n.includes('combo'))                                   return 'Combo';
  if (n.includes('kuota') || n.includes('unlimited harian')) return 'Paket Kuota';
  return 'Reguler / Lainnya';
};

const PROVIDER_LOGOS: Record<string, string> = {
  "Telkomsel": "/telkomsel.png",
  "by.U":      "/byu.png",
  "Indosat":   "/indosat.png",
  "XL & Axis": "/xl.png",
  "Tri":       "/tri.png",
  "Smartfren": "/smartfren.png",
  "PLN":       "/pln.svg",
  "DANA":      "/dana.svg",
};

const MASA_AKTIF_LOGOS: Record<string, string> = {
  "Telkomsel": "/telkomsel.png",
  "Indosat":   "/indosat.png",
  "Tri":       "/tri.png",
  "Axis":      "/xl.png",
  "XL":        "/xl.png",
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  'Data Flash':        { bg: '#FEF3C7', text: '#92400E' },
  'Freedom':           { bg: '#EDE9FE', text: '#5B21B6' },
  'AlwaysOn':          { bg: '#D1FAE5', text: '#065F46' },
  'Happy':             { bg: '#FCE7F3', text: '#9D174D' },
  'BRONET':            { bg: '#DBEAFE', text: '#1E40AF' },
  'OWSEM':             { bg: '#FEE2E2', text: '#991B1B' },
  'Combo':             { bg: '#F0FDF4', text: '#14532D' },
  'FlexMax':           { bg: '#ECFCCB', text: '#3F6212' },
  'Combo Flex':        { bg: '#ECFDF5', text: '#065F46' },
  'Paket Kuota':       { bg: '#F1F5F9', text: '#334155' },
  'Paket by.U':        { bg: '#EFF6FF', text: '#1D4ED8' },
  'Circel Reguler 28 Hari': { bg: '#FEE2E2', text: '#EF4444' }, // Red theme for Circel Promo
  'Reguler / Lainnya': { bg: '#F3F4F6', text: '#6B7280' },
  'AKRAB':             { bg: '#FFFBEB', text: '#92400E' },
  'Masa Aktif':        { bg: '#E0F2FE', text: '#0369A1' },
};

export const getProviderLogo = (cat: string): string => PROVIDER_LOGOS[cat] ?? "";
export const getMasaAktifLogo = (op: string): string => MASA_AKTIF_LOGOS[op] ?? "";
export const getTypeColor = (t: string): { bg: string; text: string } => TYPE_COLORS[t] ?? TYPE_COLORS['Reguler / Lainnya'];

export const getWaLink = (name: string, price: number | string): string => {
  const formattedPrice = typeof price === 'number' ? formatRupiah(price) : price;
  const t = formattedPrice ? ` dengan harga ${formattedPrice}` : "";
  const msg = `Halo Arwani D'Gabriel Store, saya ingin memesan ${name}${t}. Bagaimana prosedurnya?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
};

export const getProductBadge = (name: string, price: number, category: string, id: number): "BEST SELLER" | "PROMO" | "BARU" | "🔥 PROMO CIRCEL 🔥" | null => {
  const n = name.toLowerCase();
  if (n.includes("circel")) return "🔥 PROMO CIRCEL 🔥";
  if (n.includes("akrab")) return "BEST SELLER";
  if (category !== "MasaAktif" && price < 25000) return "PROMO";
  
  // Alive badges spacing
  if (id % 11 === 0 && category !== "MasaAktif") return "BEST SELLER";
  if (id % 13 === 0 && category !== "MasaAktif") return "PROMO";
  if (id % 19 === 0 && category !== "MasaAktif") return "BARU";
  
  return null;
};

/**
 * Deteksi operator provider dari nama dan kategori produk API
 */
export const detectProvider = (name: string = "", category: string = ""): string => {
  const text = `${name} ${category}`.toLowerCase();

  if (category.includes("MASA_AKTIF") || name.toLowerCase().includes("masa aktif")) {
    return "MasaAktif";
  }
  if (text.includes("telkomsel") || text.includes("mat") || text.includes("tsel") || text.includes("halo") || text.includes("simpati")) {
    return "Telkomsel";
  }
  if (text.includes("byu") || text.includes("by.u")) {
    return "by.U";
  }
  if (text.includes("indosat") || text.includes("im3") || text.includes("mai") || text.includes("freedom") || text.includes("ooredoo")) {
    return "Indosat";
  }
  if (text.includes("axis") || text.includes("aigo") || text.includes("maa") || text.includes("xl") || text.includes("flex") || text.includes("akrab") || text.includes("max") || text.includes("xda") || text.includes("xla") || text.includes("xltp")) {
    return "XL & Axis";
  }
  if (text.includes("tri") || text.includes("three") || text.includes("mar") || text.includes("happy")) {
    return "Tri";
  }
  if (text.includes("smartfren") || text.includes("sf")) {
    return "Smartfren";
  }
  if (text.includes("pln")) {
    return "PLN";
  }
  if (text.includes("dana")) {
    return "DANA";
  }

  return "XL & Axis";
};

/**
 * Deteksi nama operator dari awalan nomor telepon HP
 */
export const detectOperatorFromPhone = (phone: string): string | null => {
  const clean = phone.replace(/[^0-9]/g, "");
  const prefix = clean.startsWith("62") ? "0" + clean.slice(2, 5) : clean.slice(0, 4);

  if (/^(0811|0812|0813|0821|0822|0823|0852|0853)/.test(prefix)) return "Telkomsel";
  if (/^(0851)/.test(prefix)) return "by.U";
  if (/^(0814|0815|0816|0855|0856|0857|0858)/.test(prefix)) return "Indosat";
  if (/^(0817|0818|0819|0859|0877|0878)/.test(prefix)) return "XL & Axis";
  if (/^(0831|0832|0833|0838)/.test(prefix)) return "XL & Axis";
  if (/^(0895|0896|0897|0898|0899)/.test(prefix)) return "Tri";
  if (/^(0881|0882|0883|0884|0885|0886|0887|0888|0889)/.test(prefix)) return "Smartfren";

  return null;
};
