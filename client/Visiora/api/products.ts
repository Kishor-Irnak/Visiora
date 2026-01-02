import { API_BASE } from "./common";

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  status: string;
  tags: string; // "tag1, tag 2, tag3"
  images: Array<{
    src: string;
  }>;
  variants: Array<{
    id: number;
    price: string;
    inventory_quantity: number;
    sku: string;
  }>;
}

export interface AppProduct {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  image: string;
  sales: number;
}

export const fetchProducts = async (): Promise<AppProduct[]> => {
  try {
    const userId = localStorage.getItem('userId') || 1; // Default to user ID 1 for demo purposes
    const response = await fetch(`${API_BASE}/products?userId=${userId}`);
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();

    // Our backend returns products in a different format than Shopify's API
    return data.products.map((product: any) => {
      // Extract inventory from variants if available
      const totalInventory = product.variants && Array.isArray(product.variants) 
        ? product.variants.reduce((acc: number, v: any) => acc + (v.inventory_quantity || 0), 0)
        : 0;
      
      return {
        id: product.id.toString(),
        name: product.title,
        price: parseFloat(product.variants?.[0]?.price) || 0,
        stock: totalInventory,
        category: "Uncategorized", // Default value since our backend doesn't provide categories
        status: product.status === "active" ? "Active" : "Draft",
        image: "https://placehold.co/100", // Default value since our backend doesn't provide images
        sales: 0,
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
