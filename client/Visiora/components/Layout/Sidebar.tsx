import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Tag,
  Archive,
  Truck,
  ShoppingBag,
  Globe,
  BarChart2,
  Ticket,
  Settings,
  HelpCircle,
  Circle,
} from "lucide-react";
import { Button } from "../ui/Button";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isMobile: boolean;
  closeMobile: () => void;
}

const NAV_GROUPS = [
  {
    title: "",
    items: [
      { label: "Dashboard", href: "/", icon: LayoutDashboard },
      { label: "Lifecycle", href: "/funnel", icon: BarChart2 },
      { label: "Analytics", href: "/traffic", icon: Globe },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Orders", href: "/orders", icon: ShoppingCart },
      { label: "Inventory", href: "/inventory", icon: Archive },
      { label: "Products", href: "/products", icon: Tag },
      { label: "Customers", href: "/customers", icon: Users },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Fulfillment", href: "/fulfillment", icon: Truck },
      { label: "Carts", href: "/abandoned-carts", icon: ShoppingBag },
      { label: "Discounts", href: "/discounts", icon: Ticket },
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  isMobile,
  closeMobile,
}) => {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out border-r border-sidebar-border
    ${
      isMobile
        ? isOpen
          ? "w-64 translate-x-0 shadow-xl"
          : "w-64 -translate-x-full"
        : isOpen
        ? "w-64 translate-x-0"
        : "w-[70px] translate-x-0"
    }
  `;

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={closeMobile}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Brand */}
        <div className="flex h-16 items-center px-4 mb-2">
          <div className="flex items-center gap-2 font-semibold text-lg overflow-hidden whitespace-nowrap">
            <div className="flex items-center justify-center shrink-0">
              <Circle className="h-5 w-5 fill-current text-primary" />
            </div>
            {(isOpen || isMobile) && <span>Visiora</span>}
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-none">
          {NAV_GROUPS.map((group, index) => (
            <div key={index} className="mb-6">
              {group.title && (isOpen || isMobile) && (
                <h4 className="mb-2 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.title}
                </h4>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={isMobile ? closeMobile : undefined}
                    className={({ isActive }) => `
                      flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-sidebar-accent/50 text-foreground font-semibold"
                          : "text-muted-foreground hover:bg-sidebar-accent/30 hover:text-foreground"
                      }
                      ${!isOpen && !isMobile ? "justify-center px-2" : ""}
                    `}
                    title={!isOpen && !isMobile ? item.label : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {(isOpen || isMobile) && <span>{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-sidebar-border p-3 space-y-1">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              !isOpen && !isMobile ? "px-2 justify-center" : ""
            }`}
          >
            <Settings className="h-4 w-4" />
            {(isOpen || isMobile) && <span>Settings</span>}
          </Button>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-3 text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent ${
              !isOpen && !isMobile ? "px-2 justify-center" : ""
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            {(isOpen || isMobile) && <span>Get Help</span>}
          </Button>
        </div>
      </aside>
    </>
  );
};
