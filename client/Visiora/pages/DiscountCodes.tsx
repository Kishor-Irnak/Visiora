import React, { useMemo, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { fetchDiscountCodes, AppDiscountCode } from "../api/discounts";
import {
  Tag,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
  Search,
  Download,
  Filter,
  Plus,
  Percent,
  Coins,
  TrendingDown,
  Info,
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

export const DiscountCodes: React.FC = () => {
  const [discounts, setDiscounts] = useState<AppDiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        const data = await fetchDiscountCodes();
        setDiscounts(data);
      } catch (error) {
        console.error("Failed to load discount codes", error);
      } finally {
        setLoading(false);
      }
    };
    loadDiscounts();
  }, []);

  const filteredDiscounts = useMemo(() => {
    if (!searchQuery) return discounts;
    const lowerQuery = searchQuery.toLowerCase();
    return discounts.filter(
      (c) =>
        c.code.toLowerCase().includes(lowerQuery) ||
        c.status.toLowerCase().includes(lowerQuery)
    );
  }, [discounts, searchQuery]);

  const stats = useMemo(() => {
    const totalCodes = discounts.length;
    const usageCount = discounts.reduce(
      (acc, code) => acc + code.usageCount,
      0
    );
    const revenueWithDiscount = discounts.reduce(
      (acc, code) => acc + code.revenueGenerated,
      0
    );

    const estimatedLoss = discounts.reduce((acc, code) => {
      if (code.discountType === "Percentage") {
        // Assume avg order value is around 100 for calculation
        return acc + code.usageCount * (100 * (code.value / 100));
      } else {
        return acc + code.usageCount * code.value;
      }
    }, 0);

    const lossPercentage =
      revenueWithDiscount + estimatedLoss > 0
        ? (estimatedLoss / (revenueWithDiscount + estimatedLoss)) * 100
        : 0;

    return { totalCodes, usageCount, revenueWithDiscount, lossPercentage };
  }, [discounts]);

  const handleExport = () => {
    const headers = [
      "Code",
      "Type",
      "Value",
      "Usage",
      "Revenue",
      "Status",
      "Expiry",
    ];
    const rows = filteredDiscounts.map((c) => [
      c.code,
      c.discountType,
      c.value.toString(),
      c.usageCount.toString(),
      c.revenueGenerated.toString(),
      c.status,
      c.expiryDate,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "discount_codes.csv";
    link.click();
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Expired":
        return "secondary";
      case "Scheduled":
        return "info";
      default:
        return "default";
    }
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
          <h2 className="text-3xl font-bold tracking-tight">Discount Codes</h2>
          <p className="text-muted-foreground">
            Create and track promotional codes and coupons.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AttioButton onClick={handleExport} className="shrink-0">
            <Download className="w-4 h-4 mr-2 text-muted-foreground" />
            Export
          </AttioButton>
          <AttioButton variant="primary" className="shrink-0">
            <Plus className="w-4 h-4 mr-2" />
            Create Code
          </AttioButton>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Codes
              </p>
              <p className="text-2xl font-bold">{stats.totalCodes}</p>
            </div>
            <Tag className="h-5 w-5 text-primary opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Total Usage
              </p>
              <p className="text-2xl font-bold">
                {stats.usageCount.toLocaleString()}
              </p>
            </div>
            <Coins className="h-5 w-5 text-blue-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Avg. Discount
              </p>
              <p className="text-2xl font-bold">
                {stats.lossPercentage.toFixed(1)}%
              </p>
            </div>
            <TrendingDown className="h-5 w-5 text-green-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Revenue Generated
              </p>
              <p className="text-2xl font-bold">
                ₹{(stats.revenueWithDiscount / 1000).toFixed(1)}k
              </p>
            </div>
            <Percent className="h-5 w-5 text-purple-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by code or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          />
        </div>
      </div>

      {/* --- MOBILE CARD LIST (Visible on small screens) --- */}
      <div className="md:hidden space-y-4">
        {filteredDiscounts.length > 0 ? (
          filteredDiscounts.map((code) => (
            <div
              key={code.id}
              className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-lg font-bold text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                      {code.code}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {code.expiryDate}
                  </div>
                </div>
                <Badge variant={getStatusVariant(code.status) as any}>
                  {code.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                <div className="text-sm">
                  <span className="text-muted-foreground">Value: </span>
                  <span className="font-semibold text-foreground">
                    {code.discountType === "Percentage"
                      ? `${code.value}%`
                      : `₹${code.value}`}
                  </span>
                </div>
                <div className="text-sm text-right">
                  <span className="text-muted-foreground block text-xs">
                    Revenue
                  </span>
                  <span className="font-semibold text-foreground">
                    ₹{code.revenueGenerated.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-12 h-12 mb-4 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mb-4">
              No discount codes found.
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
                  <th className="px-6 py-3 font-medium">Code</th>
                  <th className="px-6 py-3 font-medium">Discount</th>
                  <th className="px-6 py-3 font-medium">Usage</th>
                  <th className="px-6 py-3 font-medium">Revenue</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Expiry</th>
                  <th className="w-12 px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredDiscounts.length > 0 ? (
                  filteredDiscounts.map((code) => (
                    <tr
                      key={code.id}
                      className="group transition-colors cursor-default hover:bg-muted/50"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-medium text-foreground bg-muted/50 px-2 py-1 rounded text-sm border border-border/50">
                          {code.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {code.discountType === "Percentage"
                          ? `${code.value}%`
                          : `₹${code.value}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {code.usageCount.toLocaleString()} uses
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground tabular-nums">
                        ₹{code.revenueGenerated.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusVariant(code.status) as any}>
                          {code.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm text-muted-foreground whitespace-nowrap">
                        {code.expiryDate}
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
                      colSpan={7}
                      className="px-6 py-16 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-12 h-12 text-muted-foreground/20" />
                        <p>No discount codes found matching your search.</p>
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
