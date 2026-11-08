export type PackageCategory =
  | "Semua"
  | "Harian"
  | "Mingguan"
  | "Bulanan"
  | "Combo"
  | "Unlimited"
  | "Masa Aktif";

export type OperatorName =
  | "Semua"
  | "Telkomsel"
  | "Indosat"
  | "XL"
  | "Axis"
  | "Tri"
  | "Smartfren"
  | "PLN"
  | "DANA"
  | "Lainnya";

export interface Product {
  id: string;
  code: string;
  name: string;
  operator: OperatorName;
  packageCategory: PackageCategory;
  category: string;
  costPrice: number;
  price: number;
  markup: number;
  validity: string;
  quota: string;
  desc: string;
  stock: number;
  isAvailable: boolean;
  isPopular?: boolean;
}

export interface GroupedProduct {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  variants: Product[];
}

export type PaymentMethod =
  | "QRIS"
  | "BCA_VA"
  | "BRI_VA"
  | "BNI_VA"
  | "MANDIRI_VA"
  | "DANA"
  | "OVO"
  | "SHOPEEPAY"
  | "GOPAY";

export interface PaymentOption {
  id: PaymentMethod;
  name: string;
  category: "QRIS" | "VIRTUAL_ACCOUNT" | "E_WALLET";
  fee: number;
  icon: string;
  description: string;
}

export type TransactionStatus =
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "SUCCESS"
  | "FAILED"
  | "EXPIRED";

export interface TransactionRecord {
  refid: string;
  trxuuid?: string;
  productCode: string;
  productName: string;
  operator: string;
  packageCategory: string;
  phoneNumber: string;
  costPrice: number;
  sellingPrice: number;
  fee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  statusLabel: string;
  qrisPayload?: string;
  vaNumber?: string;
  sn?: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  expiredAt: string;
}

export interface CheckoutRequest {
  productCode: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
}

export interface CheckoutResponse {
  success: boolean;
  refid: string;
  order: TransactionRecord;
  message: string;
}
