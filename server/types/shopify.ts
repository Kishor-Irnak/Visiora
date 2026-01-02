export interface ShopifyOrder {
  id: string;
  name: string;
  created_at: string;
  total_price: string;
  fulfillment_status: string | null;
  financial_status: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
}

export interface ShopifyProduct {
  id: string;
  title: string;
  status: string;
  variants: Array<{
    inventory_quantity: number;
  }>;
}