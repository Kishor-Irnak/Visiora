import { API_BASE } from "./common";

export interface ShopifyCustomer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  orders_count: number;
  total_spent: string;
  tags: string;
  created_at: string;
  last_order_id: number | null;
}

export interface AppCustomer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrderDate: string; // approximate from creation if not available
  tags: string[];
}

export const fetchCustomers = async (): Promise<AppCustomer[]> => {
  try {
    // For now, we'll return an empty array since our backend doesn't have a customers endpoint yet
    // In a real implementation, you would have a customers endpoint on your backend
    const userId = localStorage.getItem('userId') || 1; // Default to user ID 1 for demo purposes
    // const response = await fetch(`${API_BASE}/customers?userId=${userId}`);
    // if (!response.ok) throw new Error("Failed to fetch customers");
    // const data = await response.json();
    
    // Return mock data for now
    return [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        orders: 5,
        spent: 299.95,
        lastOrderDate: new Date().toLocaleDateString(),
        tags: ["VIP", "Wholesale"]
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane@example.com",
        orders: 3,
        spent: 149.97,
        lastOrderDate: new Date().toLocaleDateString(),
        tags: ["Regular"]
      }
    ];
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};
