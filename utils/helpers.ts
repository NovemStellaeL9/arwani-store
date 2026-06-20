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
  if (n.includes('circel'))                                  return 'Circel Reguler';
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
  'Circel Reguler':    { bg: '#FEE2E2', text: '#EF4444' }, // Red theme for Circel Promo
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
