import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "../components/ui/Badge";
import { fetchCustomers, AppCustomer } from "../api/customers";
import {
  Search,
  Download,
  Filter,
  Loader2,
  MoreHorizontal,
  Mail,
  Calendar,
  Tag,
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

export const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<AppCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers", error);
      } finally {
        setLoading(false);
      }
    };
    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers;
    const lowerQuery = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.email.toLowerCase().includes(lowerQuery)
    );
  }, [customers, searchQuery]);

  const handleExport = () => {
    const headers = ["Name", "Email", "Orders", "Spent", "Last Order"];
    const rows = filteredCustomers.map((c) => [
      c.name,
      c.email,
      c.orders,
      c.spent.toFixed(2),
      c.lastOrderDate,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "customers.csv";
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
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground">
            Manage your customer base and view their order history.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AttioButton onClick={handleExport} className="shrink-0">
            <Download className="w-4 h-4 mr-2 text-muted-foreground" />
            Export
          </AttioButton>
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full rounded-md border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
          />
        </div>
      </div>

      {/* --- MOBILE CARD LIST (Visible on small screens) --- */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className="bg-card border border-border rounded-lg p-4 shadow-sm space-y-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-semibold text-foreground text-base block">
                    {customer.name}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Mail className="w-3 h-3 mr-1" />
                    {customer.email}
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-semibold text-foreground">
                    {customer.orders} Orders
                  </span>
                  <span className="text-xs text-muted-foreground block">
                    ₹{customer.spent.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  Last: {customer.lastOrderDate}
                </div>
                <div className="flex gap-1">
                  {customer.tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {customer.tags.length > 2 && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-5"
                    >
                      +{customer.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Filter className="w-12 h-12 mb-4 text-muted-foreground opacity-20" />
            <p className="text-sm text-muted-foreground mb-4">
              No customers found.
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
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium text-right">Orders</th>
                  <th className="px-4 py-3 font-medium text-right">Spent</th>
                  <th className="px-4 py-3 font-medium">Last Order</th>
                  <th className="px-4 py-3 font-medium">Tags</th>
                  <th className="w-12 px-4 py-3"></th>
                </tr>
              </thead>

              <tbody className="bg-card divide-y divide-border">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="group transition-colors cursor-default hover:bg-muted/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm text-foreground font-medium">
                              {customer.name}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center">
                              {customer.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm text-right tabular-nums text-foreground">
                        {customer.orders}
                      </td>

                      <td className="px-4 py-3 text-sm text-right font-medium text-foreground tabular-nums">
                        ₹{customer.spent.toFixed(2)}
                      </td>

                      <td className="px-4 py-3 text-sm text-muted-foreground table-nums">
                        {customer.lastOrderDate}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {customer.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="font-normal text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <button className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-16 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Filter className="w-12 h-12 text-muted-foreground/20" />
                        <p>No customers found matching your search.</p>
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
