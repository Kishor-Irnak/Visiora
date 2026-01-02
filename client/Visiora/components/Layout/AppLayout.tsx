import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Menu, Sun, Moon, Bell, PanelLeft, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { useLocation } from "react-router-dom";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true); // Default to Dark as requested by user preference
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const getPageTitle = (path: string) => {
    const route = path.split("/")[1];
    if (!route) return "Dashboard";
    if (route === "traffic") return "Analytics";
    if (route === "funnel") return "Lifecycle";
    return route
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex w-full overflow-x-hidden relative">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        isMobile={isMobile}
        closeMobile={() => setMobileMenuOpen(false)}
      />

      <Sidebar
        isOpen={mobileMenuOpen}
        setIsOpen={setMobileMenuOpen}
        isMobile={true}
        closeMobile={() => setMobileMenuOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile && sidebarOpen ? "ml-64" : !isMobile ? "ml-[70px]" : ""
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6">
          <div className="flex items-center gap-4 flex-1">
            {isMobile ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="-ml-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="-ml-2 text-muted-foreground hover:text-foreground"
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">
                {getPageTitle(location.pathname)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex relative mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-md border border-input bg-secondary px-9 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-foreground"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-secondary ml-2 border flex items-center justify-center text-xs font-medium cursor-pointer hover:ring-2 ring-primary">
              JD
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden bg-background p-4 sm:p-6 lg:p-10">
          <div className="mx-auto max-w-[1600px] space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
