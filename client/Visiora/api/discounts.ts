import { API_BASE } from "./common";

export interface AppDiscountCode {
  id: string;
  code: string;
  discountType: "Percentage" | "Fixed";
  value: number;
  usageCount: number;
  revenueGenerated: number;
  status: "Active" | "Expired" | "Scheduled";
  expiryDate: string;
}

function getDiscountStatus(rule: any): "Active" | "Expired" | "Scheduled" {
  const now = new Date();
  const start = new Date(rule.starts_at);
  const end = rule.ends_at ? new Date(rule.ends_at) : null;

  if (start > now) return "Scheduled";
  if (end && end < now) return "Expired";
  return "Active";
}

export const fetchDiscountCodes = async (): Promise<AppDiscountCode[]> => {
  try {
    // For now, return mock data since our backend doesn't have discount codes endpoint yet
    // In a real implementation, you would have a discount codes endpoint on your backend
    const userId = localStorage.getItem('userId') || 1; // Default to user ID 1 for demo purposes
    
    // Return mock discount codes
    return [
      {
        id: "1",
        code: "SAVE10",
        discountType: "Percentage",
        value: 10,
        usageCount: 25,
        revenueGenerated: 249.90,
        status: "Active",
        expiryDate: "Dec 31, 2024",
      },
      {
        id: "2",
        code: "FREESHIP",
        discountType: "Fixed",
        value: 0, // Free shipping
        usageCount: 15,
        revenueGenerated: 0,
        status: "Active",
        expiryDate: "Jan 15, 2025",
      }
    ];
  } catch (e) {
    console.warn("Failed to fetch discounts", e);
    return [];
  }
};
