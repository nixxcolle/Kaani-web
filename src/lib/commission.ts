// Kaani Market 5% Sustainable Platform Commission & Transaction Engine
// 5% Platform Service Fee is reinvested into sustainable municipal fisheries & local artisan tools.
// 95% Net Proceeds go directly to the fisherfolk, coastal cooperative, or local artisan.

export const MARKET_COMMISSION_RATE = 0.05; // 5%

export interface CommissionBreakdown {
  grossPrice: number;
  platformFee: number;
  sellerNet: number;
  rate: number;
  ratePercentage: string;
}

export interface MarketTransactionRecord {
  id: string;
  idempotencyKey: string;
  productId: string;
  productName: string;
  sellerName: string;
  buyerName?: string;
  grossPrice: number;
  platformFee: number;
  sellerNet: number;
  commissionRate: number;
  timestamp: string;
  status: 'completed' | 'pending';
}

const TRANSACTIONS_STORAGE_KEY = 'kaani_market_transactions';

/**
 * Calculates the exact 5% commission and 95% seller net payout.
 * Automatically rounds to 2 decimal places.
 */
export function calculateCommission(price: number): CommissionBreakdown {
  const safePrice = Math.round(Math.max(0, !Number.isFinite(price) ? 0 : price) * 100) / 100;
  const platformFee = Math.round(safePrice * MARKET_COMMISSION_RATE * 100) / 100;
  const sellerNet = Math.round((safePrice - platformFee) * 100) / 100;

  return {
    grossPrice: safePrice,
    platformFee,
    sellerNet,
    rate: MARKET_COMMISSION_RATE,
    ratePercentage: `${(MARKET_COMMISSION_RATE * 100).toFixed(0)}%`,
  };
}

/**
 * Format any numerical value into Philippine Peso string (e.g., ₱1,250.00).
 */
export function formatPeso(amount: number): string {
  const safe = isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

/**
 * Retrieve recorded market transactions from persistent client storage.
 */
export function getMarketTransactions(): MarketTransactionRecord[] {
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Failed reading market transactions from storage:', err);
    return [];
  }
}

/**
 * Records an order or sale transaction with idempotency protection.
 * Prevents duplicate transaction charges if submitted multiple times.
 */
export function recordMarketTransaction(params: {
  productId: string;
  productName: string;
  sellerName: string;
  buyerName?: string;
  price: number;
  idempotencyKey?: string;
}): { success: boolean; transaction: MarketTransactionRecord; isDuplicate: boolean } {
  const breakdown = calculateCommission(params.price);
  const existing = getMarketTransactions();

  const key =
    params.idempotencyKey ||
    `tx-${params.productId}-${params.sellerName}-${breakdown.grossPrice}-${Date.now()}`;

  // Check if idempotency key already processed
  const duplicate = existing.find((t) => t.idempotencyKey === key);
  if (duplicate) {
    return { success: true, transaction: duplicate, isDuplicate: true };
  }

  const transactionRecord: MarketTransactionRecord = {
    id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'tx-' + Math.random().toString(36).substring(2, 11),
    idempotencyKey: key,
    productId: params.productId,
    productName: params.productName,
    sellerName: params.sellerName,
    buyerName: params.buyerName || 'Verified Buyer',
    grossPrice: breakdown.grossPrice,
    platformFee: breakdown.platformFee,
    sellerNet: breakdown.sellerNet,
    commissionRate: breakdown.rate,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };

  try {
    existing.unshift(transactionRecord);
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn('Could not persist market transaction:', err);
    return { success: false, transaction: transactionRecord, isDuplicate: false };
  }

  return { success: true, transaction: transactionRecord, isDuplicate: false };
}
