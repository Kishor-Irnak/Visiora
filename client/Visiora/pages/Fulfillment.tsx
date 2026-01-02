import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { fetchOrders, AppOrder } from "../api/orders";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Package,
  Loader2,
  Search,
  Download,
  Filter,
  MoreHorizontal,
} from "lucide-react";

// --- Styled Components (Attio Style) ---
const AttioButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
> = ({ children, className = "", variant = "secondary", ...props }) => {
  const base =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 h-9 px-4 shadow-sm border";
  const variants = {
    primary:
      "bg-primary text-primary-foreground border-transparent hover:bg-primary/90",
    secondary:
      "bg-background text-foreground border-border hover:bg-muted/50 dark:hover:bg-muted/30",
    ghost:
      "bg-transparent text-muted-foreground border-transparent shadow-none hover:bg-muted/50 hover:text-foreground",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Fulfillment: React.FC = () => {
  const [orders, setOrders] = useState<AppOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders for fulfillment", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    const lowerQuery = searchQuery.toLowerCase();
    return orders.filter(
      (o) =>
        o.id.toString().includes(lowerQuery) ||
        o.customerName.toLowerCase().includes(lowerQuery) ||
        o.status.toLowerCase().includes(lowerQuery)
    );
  }, [orders, searchQuery]);

  const analytics = useMemo(() => {
    const counts = {
      Pending: 0,
      Shipped: 0,
      Delivered: 0,
      Failed: 0,
    };

    const deliveryDistribution = {
      "1-2 Days": 0,
      "3-5 Days": 0,
      "5-7 Days": 0,
      "7+ Days": 0,
    };

    orders.forEach((order) => {
      const status = order.status;
      if (status === "Pending") counts.Pending++;
      else if (status === "Shipped") counts.Shipped++;
      else if (status === "Delivered") counts.Delivered++;
      else counts.Failed++;

      // Mock distribution logic
      const rand = parseFloat(order.id.toString().slice(-2)) / 100; // Deterministic random based on ID
      if (rand < 0.2) deliveryDistribution["1-2 Days"]++;
      else if (rand < 0.5) deliveryDistribution["3-5 Days"]++;
      else if (rand < 0.8) deliveryDistribution["5-7 Days"]++;
      else deliveryDistribution["7+ Days"]++;
    });

    const chartData = Object.keys(deliveryDistribution).map((key) => ({
      name: key,
      value: deliveryDistribution[key as keyof typeof deliveryDistribution],
    }));

    return { counts, chartData };
  }, [orders]);

  const handleExport = () => {
    const headers = ["Order ID", "Customer", "Status", "Date", "Total"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.customerName,
      o.status,
      o.date,
      o.total.toFixed(2),
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "fulfillment.csv";
    link.click();
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "success";
      case "Shipped":
        return "info";
      case "Pending":
        return "warning";
      case "Failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fulfillment</h2>
          <p className="text-muted-foreground">
            Track shipments and manage delivery performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AttioButton onClick={handleExport} className="shrink-0">
            <Download className="w-4 h-4 mr-2 text-muted-foreground" />
            Export
          </AttioButton>
        </div>
      </div>

      {/* Fulfillment Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Pending
              </p>
              <p className="text-2xl font-bold">{analytics.counts.Pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Shipped
              </p>
              <p className="text-2xl font-bold">{analytics.counts.Shipped}</p>
            </div>
            <Truck className="h-8 w-8 text-blue-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Delivered
              </p>
              <p className="text-2xl font-bold">{analytics.counts.Delivered}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Failed
              </p>
              <p className="text-2xl font-bold">{analytics.counts.Failed}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Delivery Time Chart */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Delivery Time</CardTitle>
            <CardDescription>Estimated shipping durations.</CardDescription>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analytics.chartData}
                  layout="vertical"
                  margin={{ left: 10, right: 30 }}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fulfillment List Container */}
        <div className="md:col-span-2 space-y-4">
          {/* Filter Section */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search shipments by order ID or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
            />
          </div>

          {/* --- MOBILE CARD LIST (Visible on small screens) --- */}
          <div className="md:hidden space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.slice(0, 10).map((order) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-semibold text-foreground text-base block">
                        #{order.id}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {order.customerName}
                      </span>
                    </div>
                    <Badge variant={getStatusColor(order.status) as any}>
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                    <div className="flex items-center text-muted-foreground">
                      <Truck className="w-4 h-4 mr-2" />
                      Standard Shipping
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {order.date}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No shipments found.
              </div>
            )}
          </div>

          {/* --- DESKTOP TABLE VIEW (Visible on medium+ screens) --- */}
          <div className="hidden md:block">
            <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden h-full">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-muted/50">
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-medium">
                      <th className="px-6 py-3 font-medium">Order ID</th>
                      <th className="px-6 py-3 font-medium">Method</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">
                        Last Update
                      </th>
                      <th className="w-12 px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {filteredOrders.length > 0 ? (
                      filteredOrders.slice(0, 10).map((order) => (
                        <tr
                          key={order.id}
                          className="group transition-colors cursor-default hover:bg-muted/50"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-sm text-foreground">
                              {order.id}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.customerName}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              Standard
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={getStatusColor(order.status) as any}
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-xs text-muted-foreground">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-16 text-center text-muted-foreground"
                        >
                          <div className="flex flex-col items-center gap-3">
                            <Filter className="w-12 h-12 text-muted-foreground/20" />
                            <p>No shipments found matching your search.</p>
                            <AttioButton
                              variant="ghost"
                              onClick={() => setSearchQuery("")}
                            >
                              Clear Search
                            </AttioButton>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
