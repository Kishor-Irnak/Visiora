import React from "react";

export type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";
export type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string;
  items: number;
}

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  discount: number;
  netRevenue: number;
  date: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  lastOrderDate: string;
  tags: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: "Active" | "Draft" | "Archived";
  image: string;
  sales: number;
}

export interface InventoryItem extends Product {
  sku: string;
  lowStockThreshold: number;
}

export interface FulfillmentOrder {
  orderId: string;
  customerName: string;
  partner: "FedEx" | "UPS" | "DHL" | "USPS";
  status: "Pending" | "Shipped" | "Delivered" | "Failed";
  estimatedDelivery: string;
  lastUpdate: string;
  deliveryTimeDays: number;
}

export interface AbandonedCart {
  id: string;
  customerName: string;
  email: string;
  items: { name: string; price: number; image: string }[];
  itemCount: number;
  totalValue: number;
  abandonedDate: string;
  timeAgo: string;
}

export interface PageStat {
  path: string;
  views: number;
  visitors: number;
}

export interface ReferrerStat {
  source: string;
  visits: number;
  [key: string]: any;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountType: "Percentage" | "Fixed";
  value: number;
  usageCount: number;
  revenueGenerated: number;
  status: "Active" | "Expired" | "Scheduled";
  expiryDate: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number; // percentage
  trend?: "up" | "down" | "neutral";
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}
