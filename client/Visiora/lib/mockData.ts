export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  image: string;
  stock: number;
  lowStockThreshold: number;
  sales: number;
}

export const mockInventory: InventoryItem[] = [
  {
    id: "1",
    sku: "SKU-001",
    name: "Wireless Headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    stock: 45,
    lowStockThreshold: 20,
    sales: 156,
  },
  {
    id: "2",
    sku: "SKU-002",
    name: "Smart Watch",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
    stock: 12,
    lowStockThreshold: 15,
    sales: 203,
  },
  {
    id: "3",
    sku: "SKU-003",
    name: "Laptop Stand",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop",
    stock: 0,
    lowStockThreshold: 10,
    sales: 89,
  },
  {
    id: "4",
    sku: "SKU-004",
    name: "USB-C Cable",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&h=100&fit=crop",
    stock: 78,
    lowStockThreshold: 25,
    sales: 312,
  },
  {
    id: "5",
    sku: "SKU-005",
    name: "Mechanical Keyboard",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=100&h=100&fit=crop",
    stock: 23,
    lowStockThreshold: 15,
    sales: 145,
  },
  {
    id: "6",
    sku: "SKU-006",
    name: "Wireless Mouse",
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?w=100&h=100&fit=crop",
    stock: 56,
    lowStockThreshold: 20,
    sales: 234,
  },
  {
    id: "7",
    sku: "SKU-007",
    name: "Phone Case",
    image:
      "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=100&h=100&fit=crop",
    stock: 8,
    lowStockThreshold: 15,
    sales: 178,
  },
  {
    id: "8",
    sku: "SKU-008",
    name: "Portable Charger",
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100&h=100&fit=crop",
    stock: 34,
    lowStockThreshold: 20,
    sales: 267,
  },
  {
    id: "9",
    sku: "SKU-009",
    name: "Bluetooth Speaker",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&h=100&fit=crop",
    stock: 0,
    lowStockThreshold: 12,
    sales: 98,
  },
  {
    id: "10",
    sku: "SKU-010",
    name: "Desk Lamp",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=100&h=100&fit=crop",
    stock: 19,
    lowStockThreshold: 15,
    sales: 123,
  },
  {
    id: "11",
    sku: "SKU-011",
    name: "Monitor",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=100&h=100&fit=crop",
    stock: 15,
    lowStockThreshold: 10,
    sales: 87,
  },
  {
    id: "12",
    sku: "SKU-012",
    name: "Webcam",
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=100&h=100&fit=crop",
    stock: 42,
    lowStockThreshold: 18,
    sales: 156,
  },
  {
    id: "13",
    sku: "SKU-013",
    name: "Gaming Mouse Pad",
    image:
      "https://images.unsplash.com/photo-1625225233840-695456021cde?w=100&h=100&fit=crop",
    stock: 67,
    lowStockThreshold: 25,
    sales: 201,
  },
  {
    id: "14",
    sku: "SKU-014",
    name: "Tablet",
    image:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=100&h=100&fit=crop",
    stock: 9,
    lowStockThreshold: 12,
    sales: 76,
  },
  {
    id: "15",
    sku: "SKU-015",
    name: "Screen Protector",
    image:
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=100&h=100&fit=crop",
    stock: 91,
    lowStockThreshold: 30,
    sales: 289,
  },
];
