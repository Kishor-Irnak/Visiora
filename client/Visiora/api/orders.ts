import { API_BASE } from "./common";

export interface ShopifyOrder {
  id: number;
  name: string;
  email: string;
  created_at: string;
  total_price: string;
  subtotal_price: string;
  financial_status: string;
  fulfillment_status: string | null;
  currency: string;
  landing_site: string | null;
  referring_site: string | null;
  customer: {
    first_name: string;
    last_name: string;
  } | null;
  line_items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: string;
  }>;
}

export interface AppOrder {
  id: string;
  customerName: string;
  total: number;
  status: string;
  paymentStatus: string;
  date: string;
  items: number;
  landingSite: string;
  referrer: string;
  lineItems: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

function mapFulfillmentStatus(status: string | null): string {
  if (!status) return "Pending";
  if (status === "fulfilled") return "Delivered"; // Simplified mapping
  if (status === "partial") return "Shipped";
  return "Pending";
}

function mapFinancialStatus(status: string): string {
  if (status === "paid") return "Paid";
  if (status === "pending") return "Pending";
  if (status === "refunded") return "Refunded";
  return "Failed";
}

export const fetchOrders = async (): Promise<AppOrder[]> => {
  try {
    const userId = localStorage.getItem('userId') || 1; // Default to user ID 1 for demo purposes
    const response = await fetch(`${API_BASE}/orders?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    const data = await response.json();

    // Our backend returns orders in a different format than Shopify's API
    return data.orders.map((order: any) => ({
      id: order.name,
      customerName: order.customer 
        ? `${order.customer.first_name || ''} ${order.customer.last_name || ''}`.trim() 
        : "Guest",
      total: parseFloat(order.total_price),
      status: mapFulfillmentStatus(order.fulfillment_status),
      paymentStatus: mapFinancialStatus(order.financial_status),
      date: new Date(order.created_at).toLocaleDateString(),
      items: 1, // Default value since our backend doesn't provide line items
      landingSite: "/", // Default value
      referrer: "Direct", // Default value
      lineItems: [], // Default value
    }));
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
