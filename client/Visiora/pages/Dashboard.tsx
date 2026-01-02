import React, { useEffect, useState, useMemo } from "react";
import { KPICard } from "../components/Dashboard/KPICard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Calendar, Loader2 } from "lucide-react";
import { fetchDashboardMetrics } from "../api/dashboard";
import { AppOrder, fetchOrders } from "../api/orders";
import { AppProduct, fetchProducts } from "../api/products";

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({ totalOrders: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState<AppOrder[]>([]);
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [m, o, p] = await Promise.all([
          fetchDashboardMetrics(),
          fetchOrders(),
          fetchProducts(),
        ]);
        setMetrics(m);
        setRecentOrders(o);
        setProducts(p);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Derived Analytics
  const { revenueData, aov, recentRevenue } = useMemo(() => {
    const revenue = recentOrders.reduce((acc, o) => acc + o.total, 0);
    const avgOrderValue =
      recentOrders.length > 0 ? revenue / recentOrders.length : 0;

    // Group by date for chart
    const days = 30;
    const data = [];
    const now = new Date();
    const ordersByDate: Record<string, number> = {};
    const revenueByDate: Record<string, number> = {};

    recentOrders.forEach((o) => {
      const dateKey = new Date(o.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      ordersByDate[dateKey] = (ordersByDate[dateKey] || 0) + 1;
      revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + o.total;
    });

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateKey = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      data.push({
        name: dateKey,
        value: revenueByDate[dateKey] || 0, // Revenue
        value2: ordersByDate[dateKey] || 0, // Orders
      });
    }

    return { revenueData: data, aov: avgOrderValue, recentRevenue: revenue };
  }, [recentOrders]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <p className="text-muted-foreground">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Calendar className="mr-2 h-4 w-4" /> Today
          </Button>
          <Button size="sm">Download Report</Button>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          label="Total Revenue (Recent)"
          value={`₹${recentRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change={0}
          trend="up"
        />
        <KPICard
          label="Orders"
          value={metrics.totalOrders.toString()}
          change={0}
          trend="up"
        />
        <KPICard
          label="Products"
          value={metrics.totalProducts.toString()}
          change={0}
          trend="up"
        />
        <KPICard
          label="Avg. Order Value"
          value={`₹${aov.toFixed(2)}`}
          change={0}
          trend="neutral"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Revenue over time</CardTitle>
            <CardDescription>
              Daily revenue for the past 30 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorValue)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Newest products in your store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product, i) => (
                <div key={product.id} className="flex items-center">
                  <div className="relative h-10 w-10 overflow-hidden rounded-md border mr-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-2 space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <div className="font-medium text-sm">₹{product.price}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest transactions from your store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {order.customerName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {order.id} • {order.items} items
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="block font-medium text-sm">
                      ₹{order.total.toFixed(2)}
                    </span>
                    <Badge
                      variant={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Pending"
                          ? "warning"
                          : "secondary"
                      }
                      className="scale-75 origin-right"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Traffic vs Conversion</CardTitle>
            <CardDescription>
              Session volume vs conversion rate.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
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
                    yAxisId="left"
                    dataKey="value"
                    name="Sessions"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="value2"
                    name="Orders"
                    fill="hsl(var(--muted-foreground))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
