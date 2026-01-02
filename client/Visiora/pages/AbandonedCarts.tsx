import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { fetchAbandonedCarts, AppAbandonedCart } from "../api/abandonedCarts";
import {
  Mail,
  Tag,
  Target,
  Clock,
  ShoppingBag,
  Loader2,
  Search,
  Download,
  Filter,
  ShoppingCart,
  TrendingUp,
  AlertOctagon,
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

export const AbandonedCarts: React.FC = () => {
  const [carts, setCarts] = useState<AppAbandonedCart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCarts = async () => {
      try {
        const data = await fetchAbandonedCarts();
        setCarts(data);
      } catch (error) {
        console.error("Failed to load abandoned carts", error);
      } finally {
        setLoading(false);
      }
    };
    loadCarts();
  }, []);

  const filteredCarts = useMemo(() => {
    if (!searchQuery) return carts;
    const lowerQuery = searchQuery.toLowerCase();
    return carts.filter(
      (c) =>
        c.customerName.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery)
    );
  }, [carts, searchQuery]);

  const stats = useMemo(() => {
    const sessions = carts.length;
    const potentialRevenue = carts.reduce(
      (acc, cart) => acc + cart.totalValue,
      0
    );
    // Mock recovery rate derived loosely or static as we don't have this data easily
    const recoveryRate = sessions > 0 ? 18.5 : 0;

    return { sessions, potentialRevenue, recoveryRate };
  }, [carts]);

  const handleExport = () => {
    const headers = ["Customer", "Email", "Total", "Items", "Time Left"];
    const rows = filteredCarts.map((c) => [
      c.customerName,
      c.email,
      c.totalValue.toFixed(2),
      c.items.length.toString(),
      c.timeAgo,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "abandoned_carts.csv";
    link.click();
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Abandoned Carts</h2>
          <p className="text-muted-foreground">
            Recover lost sales by tracking and engaging with unfinished orders.
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Abandoned Sessions
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.sessions}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-red-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Potential Revenue
              </p>
              <p className="text-2xl font-bold tracking-tight">
                ₹{stats.potentialRevenue.toLocaleString()}
              </p>
            </div>
            <AlertOctagon className="h-8 w-8 text-blue-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Recovery Rate
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {stats.recoveryRate}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          />
        </div>
      </div>

      {/* --- MOBILE CARD LIST (Visible on small screens) --- */}
      <div className="md:hidden space-y-4">
        {filteredCarts.length > 0 ? (
          filteredCarts.map((cart) => (
            <div
              key={cart.id}
              className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-foreground text-base block">
                    {cart.customerName}
                  </span>
                  <div className="text-xs text-muted-foreground">
                    {cart.email}
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-foreground">
                    ₹{cart.totalValue.toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" /> {cart.timeAgo}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 py-2 overflow-x-auto">
                {cart.items.map((item, i) => (
                  <img
                    key={i}
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-md border border-border object-cover"
                  />
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Mail className="h-3 w-3 mr-1" /> Remind
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Tag className="h-3 w-3 mr-1" /> Discount
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-12 h-12 mb-4 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mb-4">
              No abandoned carts found.
            </p>
            <AttioButton variant="ghost" onClick={() => setSearchQuery("")}>
              Clear Search
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
                  <th className="px-6 py-3 font-medium">Customer</th>
                  <th className="px-6 py-3 font-medium">Cart Items</th>
                  <th className="px-6 py-3 font-medium">Total Value</th>
                  <th className="px-6 py-3 font-medium">Abandoned</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredCarts.length > 0 ? (
                  filteredCarts.map((cart) => (
                    <tr
                      key={cart.id}
                      className="group transition-colors cursor-default hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-foreground">
                          {cart.customerName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cart.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2 overflow-hidden hover:space-x-1 transition-all">
                            {cart.items.slice(0, 3).map((item, i) => (
                              <img
                                key={i}
                                src={item.image}
                                alt={item.name}
                                className="inline-block h-8 w-8 rounded-full ring-2 ring-background object-cover bg-muted border border-border transition-transform hover:scale-110"
                                title={item.name}
                              />
                            ))}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-[150px]">
                              {cart.items[0]?.name || "Item"}
                            </span>
                            {cart.items.length > 1 && (
                              <span className="text-xs text-muted-foreground">
                                +{cart.items.length - 1} more
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        ₹{cart.totalValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3.5 w-3.5" /> {cart.timeAgo}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            title="Send Reminder Email"
                          >
                            <Mail className="h-3.5 w-3.5 mr-1.5" />
                            Remind
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            title="Create Discount Code"
                          >
                            <Tag className="h-3.5 w-3.5 mr-1.5" />
                            Discount
                          </Button>
                        </div>
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
                        <p>No abandoned carts found matching your search.</p>
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
  );
};
