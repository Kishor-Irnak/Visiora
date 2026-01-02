import { API_BASE } from "./common";
import { fetchProducts } from "./products";

export interface AppAbandonedCart {
  id: string;
  customerName: string;
  email: string;
  items: Array<{ name: string; price: number; image: string }>;
  itemCount: number;
  totalValue: number;
  abandonedDate: string;
  timeAgo: string;
}

function calculateTimeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export const fetchAbandonedCarts = async (): Promise<AppAbandonedCart[]> => {
  try {
    const [checkoutsResponse, products] = await Promise.all([
      fetch(`${API_BASE}/checkouts.json?limit=50`),
      fetchProducts(),
    ]);

    if (!checkoutsResponse.ok) return [];
    const data = await checkoutsResponse.json();

    // Create image map: ID -> Image URL
    const productImageMap: Record<string, string> = {};
    products.forEach((p) => {
      productImageMap[p.id] = p.image;
    });

    return data.checkouts.map((cart: any) => ({
      id: cart.token,
      customerName: cart.customer
        ? (() => {
            const first = cart.customer.first_name || "";
            const last = cart.customer.last_name || "";
            const full = `${first} ${last}`.trim();
            return full || (cart.email ? cart.email.split("@")[0] : "Guest");
          })()
        : "Guest",
      email: cart.email || "No email",
      items: cart.line_items.map((item: any) => ({
        name: item.title,
        price: parseFloat(item.price),
        image:
          productImageMap[item.product_id?.toString()] ||
          "https://placehold.co/50",
      })),
      itemCount: cart.line_items.length,
      totalValue: parseFloat(cart.total_price),
      abandonedDate: new Date(cart.created_at).toLocaleDateString(),
      timeAgo: calculateTimeAgo(cart.updated_at),
    }));
  } catch (e) {
    console.warn("Failed to fetch abandoned carts", e);
    return [];
  }
};
