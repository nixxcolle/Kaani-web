import { supabase } from "./supabase";

export type ReportCategory =
  | "Incorrect product information"
  | "Misleading price or quantity"
  | "Product marked as available but unavailable"
  | "Suspicious or inappropriate listing"
  | "Suspected scam or fraudulent activity"
  | "Other concerns";

export const REPORT_CATEGORIES: ReportCategory[] = [
  "Incorrect product information",
  "Misleading price or quantity",
  "Product marked as available but unavailable",
  "Suspicious or inappropriate listing",
  "Suspected scam or fraudulent activity",
  "Other concerns",
];

export interface MarketReport {
  id: string;
  productId: string;
  productName: string;
  sellerName: string;
  category: ReportCategory;
  description?: string;
  reporterName?: string;
  reporterContact?: string;
  reporterUserId?: string;
  createdAt: string;
  status: "pending" | "investigated" | "resolved" | "dismissed";
  actionTaken?: "none" | "warning_issued" | "listing_hidden" | "dismissed";
}

const STORAGE_KEY = "kaani_market_reports";

export function getStoredReports(): MarketReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load reports from storage", err);
    return [];
  }
}

export function saveStoredReports(reports: MarketReport[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    window.dispatchEvent(new CustomEvent("kaani-reports-updated"));
  } catch (err) {
    console.error("Failed to save reports", err);
  }
}

export function hasUserReportedProduct(productId: string, reporterIdentifier?: string): boolean {
  const reports = getStoredReports();
  return reports.some((r) => {
    if (r.productId !== productId) return false;
    if (reporterIdentifier && (r.reporterUserId === reporterIdentifier || r.reporterContact === reporterIdentifier)) {
      return true;
    }
    // Also check if reported recently in this browser
    return !reporterIdentifier;
  });
}

export async function submitMarketReport(input: {
  productId: string;
  productName: string;
  sellerName: string;
  category: ReportCategory;
  description?: string;
  reporterName?: string;
  reporterContact?: string;
  reporterUserId?: string;
}): Promise<{ success: boolean; report?: MarketReport; message?: string }> {
  // Validate required fields
  if (!input.productId || !input.category) {
    return { success: false, message: "Product and category are required." };
  }

  const reports = getStoredReports();

  // Prevent immediate duplicate submissions from same session/user
  const alreadyReported = reports.find(
    (r) =>
      r.productId === input.productId &&
      ((!!input.reporterUserId && r.reporterUserId === input.reporterUserId) ||
        (input.reporterContact && r.reporterContact === input.reporterContact) ||
        // If unauthenticated, prevent duplicate report with same category in last 24h
        (r.category === input.category &&
          Date.now() - new Date(r.createdAt).getTime() < 24 * 60 * 60 * 1000))
  );

  if (alreadyReported) {
    return {
      success: false,
      message: "You have already submitted a report for this listing. Our team is investigating.",
    };
  }

  const newReport: MarketReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: input.productId,
    productName: input.productName,
    sellerName: input.sellerName,
    category: input.category,
    description: input.description?.trim() || "",
    reporterName: input.reporterName?.trim() || "Anonymous Community Member",
    reporterContact: input.reporterContact?.trim() || "",
    reporterUserId: input.reporterUserId,
    createdAt: new Date().toISOString(),
    status: "pending",
    actionTaken: "none",
  };


  // Attempt remote Supabase insert if available without breaking
  try {
    const { error } = await supabase.from("market_reports").insert({
      id: newReport.id,
      product_id: newReport.productId,
      product_name: newReport.productName,
      seller_name: newReport.sellerName,
      category: newReport.category,
      description: newReport.description,
      reporter_user_id: newReport.reporterUserId || null,
      reporter_name: newReport.reporterName,
      reporter_contact: newReport.reporterContact,
      status: "pending",
      created_at: newReport.createdAt,
    });
    if (error) throw error;
    reports.unshift(newReport);
    saveStoredReports(reports);
  } catch (err) {
    // Graceful offline fallback
    console.warn("Report delivery failed", err);
    return { success: false, message: "Report could not be sent. Please check your connection and try again." };
  }

  return { success: true, report: newReport };
}

export function updateReportStatus(
  reportId: string,
  status: MarketReport["status"],
  actionTaken?: MarketReport["actionTaken"]
): boolean {
  const reports = getStoredReports();
  const index = reports.findIndex((r) => r.id === reportId);
  if (index === -1) return false;

  reports[index].status = status;
  if (actionTaken) {
    reports[index].actionTaken = actionTaken;
  }
  saveStoredReports(reports);
  return true;
}
