import { TransactionRecord, TransactionStatus } from "@/types/product";

export interface WebhookLog {
  id: string;
  receivedAt: string;
  headers: Record<string, string>;
  body: Record<string, unknown> | string;
  status?: string;
  message?: string;
}

// In-memory server-side storage for serverless runtime warm instances
const globalStore = global as unknown as {
  __arwani_transactions?: TransactionRecord[];
  __arwani_webhooks?: WebhookLog[];
};

if (!globalStore.__arwani_transactions) {
  globalStore.__arwani_transactions = [];
}

if (!globalStore.__arwani_webhooks) {
  globalStore.__arwani_webhooks = [];
}

export function saveTransaction(tx: TransactionRecord): void {
  const list = globalStore.__arwani_transactions || [];
  const idx = list.findIndex((item) => item.refid === tx.refid);
  if (idx > -1) {
    list[idx] = { ...list[idx], ...tx, updatedAt: new Date().toISOString() };
  } else {
    list.unshift(tx);
  }
  // Simpan hingga 300 transaksi terakhir di memori
  if (list.length > 300) list.pop();
  globalStore.__arwani_transactions = list;
}

export function updateTransactionStatus(
  refid: string,
  status: TransactionStatus,
  statusLabel: string,
  sn?: string,
  message?: string
): TransactionRecord | null {
  const list = globalStore.__arwani_transactions || [];
  const idx = list.findIndex((item) => item.refid.toLowerCase() === refid.toLowerCase());
  if (idx > -1) {
    const updated: TransactionRecord = {
      ...list[idx],
      status,
      statusLabel,
      sn: sn || list[idx].sn,
      message: message || list[idx].message,
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    globalStore.__arwani_transactions = list;
    return updated;
  }
  return null;
}

export function getTransactions(): TransactionRecord[] {
  return globalStore.__arwani_transactions || [];
}

export function findTransaction(refid: string): TransactionRecord | undefined {
  return (globalStore.__arwani_transactions || []).find(
    (tx) => tx.refid.toLowerCase() === refid.toLowerCase()
  );
}

export function logWebhook(entry: Omit<WebhookLog, "id" | "receivedAt">): WebhookLog {
  const log: WebhookLog = {
    id: `WH-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    receivedAt: new Date().toISOString(),
    ...entry,
  };
  const list = globalStore.__arwani_webhooks || [];
  list.unshift(log);
  if (list.length > 150) list.pop();
  globalStore.__arwani_webhooks = list;
  return log;
}

export function getWebhookLogs(): WebhookLog[] {
  return globalStore.__arwani_webhooks || [];
}
