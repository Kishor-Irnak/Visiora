import React, { useState, useEffect, useMemo } from "react";
import { fetchOrders, AppOrder } from "../api/orders";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Download,
  Loader2,
  Search,
  MoreHorizontal,
  Clock,
  Filter,
  ArrowUpDown,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Activity,
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

const AttioTab: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  count?: number;
}> = ({ active, onClick, children, count }) => (
  <button
    onClick={onClick}
    className={`
      relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap
      ${
        active
          ? "bg-muted text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      }
    `}
  >
    {children}
    {count !== undefined && (
      <span
        className={`flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-[10px] rounded-full ${
          active
            ? "bg-background text-foreground shadow-sm"
            : "bg-muted-foreground/10 text-muted-foreground"
        }`}
      >
        {count}
      </span>
    )}
  </button>
);

export const Orders: React.FC = () => {
  // Filters & State
  const [activeTab, setActiveTab] = useState<
    "All" | "Pending" | "Delivered" | "Cancelled"
  >("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<AppOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter((o) => o.status === "Pending").length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      avgOrderValue,
    };
  }, [orders]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesTab = activeTab === "All" ? true : o.status === activeTab;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        o.customerName.toLowerCase().includes(searchLower) ||
        o.id.toString().includes(searchLower);

      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const handleExport = () => {
    const headers = ["Order ID", "Date", "Customer", "Total", "Status"];
    const rows = filteredOrders.map((o) => [
      o.id,
      o.date,
      o.customerName,
      o.total.toFixed(2),
      o.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "orders.csv";
    link.click();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Delivered":
      case "Paid":
        return "success";
      case "Pending":
        return "warning";
      case "Cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const getCount = (status: string) =>
    orders.filter((o) => o.status === status).length;

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">
            Manage and track all your orders in one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AttioButton onClick={handleExport} className="shrink-0">
            <Download className="w-4 h-4 mr-2 text-muted-foreground" />
            Export
          </AttioButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="text-2xl font-bold">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Orders
              </p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Pending Orders
              </p>
              <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            </div>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Order Value
              </p>
              <p className="text-2xl font-bold">
                ₹{stats.avgOrderValue.toFixed(0)}
              </p>
            </div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by ID or Customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <AttioTab
            active={activeTab === "All"}
            count={orders.length}
            onClick={() => setActiveTab("All")}
          >
            All Orders
          </AttioTab>
          <AttioTab
            active={activeTab === "Pending"}
            count={getCount("Pending")}
            onClick={() => setActiveTab("Pending")}
          >
            Pending
          </AttioTab>
          <AttioTab
            active={activeTab === "Delivered"}
            count={getCount("Delivered")}
            onClick={() => setActiveTab("Delivered")}
          >
            Delivered
          </AttioTab>
          <AttioTab
            active={activeTab === "Cancelled"}
            count={getCount("Cancelled")}
            onClick={() => setActiveTab("Cancelled")}
          >
            Cancelled
          </AttioTab>
        </div>
      </div>

      {/* --- MOBILE CARD LIST (Visible on small screens) --- */}
      <div className="md:hidden space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-semibold text-foreground text-base">
                    #{order.id}
                  </span>
                  <p className="text-xs text-muted-foreground">{order.date}</p>
                </div>
                <Badge variant={getStatusVariant(order.status) as any}>
                  {order.status}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                  {order.customerName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {order.customerName}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        order.paymentStatus === "Paid"
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                      }`}
                    />
                    {order.paymentStatus}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground text-base">
                    ₹{order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-12 h-12 mb-4 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mb-4">
              No orders found.
            </p>
            <AttioButton
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setActiveTab("All");
              }}
            >
              Clear Filters
            </AttioButton>
          </div>
        )}
      </div>

      {/* --- DESKTOP TABLE VIEW (Visible on medium+ screens) --- */}
      <div className="hidden md:block">
        <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/50">
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground font-medium">
                  <th className="px-4 py-3 font-medium cursor-pointer hover:text-foreground group">
                    <div className="flex items-center gap-1">
                      Order ID{" "}
                      <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50" />
                    </div>
                  </th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Payment</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="bg-card divide-y divide-border">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    return (
                      <tr
                        key={order.id}
                        className="group transition-colors cursor-default hover:bg-muted/50"
                      >
                        <td className="px-4 py-3">
                          <span className="font-medium text-foreground text-sm">
                            #{order.id}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <Badge
                            variant={getStatusVariant(order.status) as any}
                          >
                            {order.status}
                          </Badge>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                              {order.customerName.charAt(0)}
                            </div>
                            <span className="text-sm text-foreground font-medium">
                              {order.customerName}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">
                          {order.date}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ring-2 ring-opacity-20 ${
                                order.paymentStatus === "Paid"
                                  ? "bg-emerald-500 ring-emerald-500"
                                  : "bg-amber-500 ring-amber-500"
                              }`}
                            />
                            {order.paymentStatus}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-right font-medium text-foreground tabular-nums">
                          ₹{order.total.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-16 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-12 h-12 text-muted-foreground/20" />
                        <p>No orders found matching your filters.</p>
                        <AttioButton
                          variant="ghost"
                          onClick={() => {
                            setSearchQuery("");
                            setActiveTab("All");
                          }}
                        >
                          Clear Filters
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
  );
};
