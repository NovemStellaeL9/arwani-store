export interface StoredTransaction {
  refid: string;
  trxuuid?: string;
  productcode: string;
  productName?: string;
  category?: string;
  phonenumber: string;
  price: number;
  costPrice?: number;
  status: string; // '00' | '01' | '02' | string
  statusLabel: string; // 'Sukses' | 'Diproses' | 'Gagal'
  message: string;
  createdAt: string;
  updatedAt: string;
  source: "API_DIRECT" | "MANUAL_CS";
}

export interface WebhookLog {
  id: string;
  receivedAt: string;
  headers: Record<string, string>;
  body: any;
  status?: string;
  message?: string;
}

// Global server in-memory storage (persists while lambdas stay warm)
const globalStore = global as unknown as {
  __arwani_transactions?: StoredTransaction[];
  __arwani_webhooks?: WebhookLog[];
};

if (!globalStore.__arwani_transactions) {
  globalStore.__arwani_transactions = [];
}

if (!globalStore.__arwani_webhooks) {
  globalStore.__arwani_webhooks = [];
}

export function saveTransaction(tx: StoredTransaction): void {
  const list = globalStore.__arwani_transactions || [];
  const idx = list.findIndex((item) => item.refid === tx.refid);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...tx, updatedAt: new Date().toISOString() };
  } else {
    list.unshift(tx);
  }
  // Keep up to 200 recent transactions
  if (list.length > 200) list.pop();
  globalStore.__arwani_transactions = list;
}

export function getTransactions(): StoredTransaction[] {
  return globalStore.__arwani_transactions || [];
}

export function findTransaction(refid: string): StoredTransaction | undefined {
  return (globalStore.__arwani_transactions || []).find((tx) => tx.refid.toLowerCase() === refid.toLowerCase());
}

export function logWebhook(entry: Omit<WebhookLog, "id" | "receivedAt">): WebhookLog {
  const log: WebhookLog = {
    id: `WH-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    receivedAt: new Date().toISOString(),
    ...entry,
  };
  const list = globalStore.__arwani_webhooks || [];
  list.unshift(log);
  if (list.length > 100) list.pop();
  globalStore.__arwani_webhooks = list;
  return log;
}

export function getWebhookLogs(): WebhookLog[] {
  return globalStore.__arwani_webhooks || [];
}
