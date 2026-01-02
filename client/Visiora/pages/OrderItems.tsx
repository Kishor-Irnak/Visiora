import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { fetchOrders, AppOrder } from "../api/orders";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";
import { Loader2 } from "lucide-react";

export const OrderItems: React.FC = () => {
  const [orders, setOrders] = useState<AppOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (e) {
        console.error("Failed to load orders for items", e);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Flatten orders to items
  const allItems = useMemo(() => {
    return orders.flatMap((order) =>
      order.lineItems.map((item) => ({
        ...item,
        orderId: order.id,
        date: order.date,
        // Revenue per item line (price * quantity)
        netRevenue: item.price * item.quantity,
        // We don't have per-item discount details easily in basic fetch, assuming 0 or distributed if needed
        discount: 0,
      }))
    );
  }, [orders]);

  // Analytics Logic
  const analytics = useMemo(() => {
    const productStats: Record<
      string,
      { name: string; quantity: number; revenue: number; discount: number }
    > = {};

    allItems.forEach((item) => {
      if (!productStats[item.name]) {
        productStats[item.name] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
          discount: 0,
        };
      }
      productStats[item.name].quantity += item.quantity;
      productStats[item.name].revenue += item.netRevenue;
      productStats[item.name].discount += item.discount;
    });

    const productsArray = Object.values(productStats);

    const mostSold = [...productsArray]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
    const revenueByProduct = [...productsArray]
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return { mostSold, revenueByProduct };
  }, [allItems]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Most Sold Products</CardTitle>
            <CardDescription>
              Top performing products by quantity sold.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.mostSold}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  >
                    {analytics.mostSold.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index < 3
                            ? "hsl(var(--primary))"
                            : "hsl(var(--muted-foreground))"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Product</CardTitle>
            <CardDescription>
              Top products by revenue generated.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.revenueByProduct.slice(0, 6)}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Net Revenue"
                    stackId="a"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>
            Detailed breakdown of individual line items sold (Last 50 orders).
          </CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Product Name</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">Qty</th>
                <th className="px-6 py-3 text-right whitespace-nowrap">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-right whitespace-nowrap">
                  Net Revenue
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {allItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No items found.
                  </td>
                </tr>
              ) : (
                allItems.slice(0, 50).map((item, idx) => (
                  <tr
                    key={`${item.orderId}-${idx}`}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {item.name}
                      <div className="text-xs text-muted-foreground font-normal">
                        Order {item.orderId} • {item.date}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-medium whitespace-nowrap">
                      ₹{item.netRevenue.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
