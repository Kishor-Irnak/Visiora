import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { fetchProducts, AppProduct } from "../api/products";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  Package,
  AlertCircle,
  Search,
  Download,
  Filter,
  Loader2,
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

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<AppProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const lowerQuery = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.id.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }, [products, searchQuery]);

  const stats = useMemo(() => {
    const totalSKUs = products.length;
    const lowStockThreshold = 10; // Global threshold for simplicity
    const lowStock = products.filter(
      (p) => p.stock > 0 && p.stock <= lowStockThreshold
    ).length;
    const outOfStock = products.filter((p) => p.stock === 0).length;

    // Data for charts
    // 1. Stock by Category
    const categoryMap = new Map<string, number>();
    products.forEach((p) => {
      const current = categoryMap.get(p.category) || 0;
      categoryMap.set(p.category, current + p.stock);
    });
    const categoryData = Array.from(categoryMap.entries()).map(
      ([name, value]) => ({ name, value })
    );

    // 2. Top Stock Items
    const sortedByStock = [...products].sort((a, b) => b.stock - a.stock);
    const topStock = sortedByStock.slice(0, 5).map((p) => ({
      name: p.name.length > 20 ? p.name.substring(0, 20) + "..." : p.name,
      value: p.stock,
      type: "High",
    }));

    return { totalSKUs, lowStock, outOfStock, categoryData, topStock };
  }, [products]);

  const handleExport = () => {
    const headers = ["ID", "Name", "Category", "Price", "Stock", "Status"];
    const rows = filteredProducts.map((p) => [
      p.id,
      p.name,
      p.category,
      p.price.toFixed(2),
      p.stock,
      p.status,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "inventory.csv";
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
          <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
          <p className="text-muted-foreground">
            Real-time overview of your product stock and performance.
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-l-4 border-l-primary h-full">
          <CardContent className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide">
                Total Products
              </p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stats.totalSKUs}
              </p>
            </div>
            <Package className="h-8 w-8 text-muted-foreground opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 h-full">
          <CardContent className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide">
                Low Stock
              </p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stats.lowStock}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500 opacity-50" />
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 h-full">
          <CardContent className="p-6 sm:p-8 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground tracking-wide">
                Out of Stock
              </p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {stats.outOfStock}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Stock by Category</CardTitle>
            <CardDescription>
              Distribution of total inventory across product categories.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`hsl(var(--primary) / ${
                          1 - index * (0.8 / stats.categoryData.length)
                        })`}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderRadius: "8px",
                      border: "1px solid hsl(var(--border))",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Stock Levels</CardTitle>
            <CardDescription>
              Products with the highest inventory count.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.topStock}
                  layout="vertical"
                  margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
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
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={30}>
                    {stats.topStock.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill="hsl(var(--primary))"
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products by name, ID, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          />
        </div>
      </div>

      {/* --- MOBILE CARD LIST (Visible on small screens) --- */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="font-semibold text-foreground text-base">
                    {product.name}
                  </span>
                  <p className="text-xs text-muted-foreground">
                    ID: {product.id}
                  </p>
                </div>
                <Badge
                  variant={
                    product.stock === 0
                      ? "destructive"
                      : product.stock <= 10
                      ? "warning"
                      : "secondary"
                  }
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : product.stock <= 10
                    ? "Low Stock"
                    : "In Stock"}
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-muted border border-border overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span>Stock: {product.stock}</span>
                    <span>•</span>
                    <span>₹{product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-12 h-12 mb-4 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mb-4">
              No products found.
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
                  <th className="px-4 py-3 font-medium">Product ID</th>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Price</th>
                  <th className="px-4 py-3 font-medium text-right">Stock</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="bg-card divide-y divide-border">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => {
                    const stockStatus =
                      product.stock === 0
                        ? "Out of Stock"
                        : product.stock <= 10
                        ? "Low Stock"
                        : "In Stock";
                    const badgeVariant =
                      stockStatus === "Out of Stock"
                        ? "destructive"
                        : stockStatus === "Low Stock"
                        ? "warning"
                        : "secondary";

                    return (
                      <tr
                        key={product.id}
                        className="group transition-colors cursor-default hover:bg-muted/50"
                      >
                        <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                          #{product.id}
                        </td>

                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted border border-border overflow-hidden shrink-0">
                              <img
                                src={product.image}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <span className="text-sm text-foreground font-medium truncate max-w-[200px]">
                              {product.name}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <Badge variant="outline" className="font-normal">
                            {product.category}
                          </Badge>
                        </td>

                        <td className="px-4 py-3">
                          <Badge variant={badgeVariant}>{stockStatus}</Badge>
                        </td>

                        <td className="px-4 py-3 text-sm text-right font-medium text-foreground tabular-nums">
                          ₹{product.price.toFixed(2)}
                        </td>

                        <td className="px-4 py-3 text-sm text-right tabular-nums">
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-medium">{product.stock}</span>
                            <div className="h-1.5 w-16 bg-secondary rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  stockStatus === "Low Stock"
                                    ? "bg-yellow-500"
                                    : stockStatus === "Out of Stock"
                                    ? "bg-red-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (product.stock / 50) * 100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
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
                        <p>No products found matching your search.</p>
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
