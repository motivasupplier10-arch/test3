import { useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AppSidebar } from "@/components/AppSidebar";
import { LoginPage } from "@/components/LoginPage";
import { Dashboard } from "@/components/Dashboard";
import { ShopManagement } from "@/components/ShopManagement";
import { InventoryManagement } from "@/components/InventoryManagement";
import { SalesManagement } from "@/components/SalesManagement";
import { UserManagement } from "@/components/UserManagement";
import { RealTimeStockTable } from "@/components/RealTimeStockTable";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Dashboard />} />
      <Route path="/dashboard" component={() => <Dashboard />} />
      <Route path="/shops" component={() => <ShopManagement />} />
      <Route path="/inventory" component={() => <InventoryManagement />} />
      <Route path="/realtime-stock" component={() => <RealTimeStockTable />} />
      <Route path="/sales" component={() => <SalesManagement />} />
      <Route path="/reports" component={() => <SalesManagement />} />
      <Route path="/users" component={() => <UserManagement />} />
      <Route path="/settings" component={() => <div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Application settings would go here.</p></div>} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [location] = useLocation();

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", { email, password });
    // Todo: remove mock authentication - implement real JWT authentication
    if (email && password) {
      setIsAuthenticated(true);
      // Simulate successful login
      alert("Login successful! Welcome to the Admin Portal.");
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
    setIsAuthenticated(false);
    // Todo: remove mock functionality - implement real logout with JWT cleanup
    alert("You have been logged out successfully.");
  };

  // Custom sidebar width for admin portal
  const sidebarStyle = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="admin-portal-theme">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <LoginPage onLogin={handleLogin} />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="admin-portal-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <SidebarProvider style={sidebarStyle as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar onLogout={handleLogout} />
              <div className="flex flex-col flex-1">
                <header className="flex items-center justify-between p-4 border-b bg-background">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger data-testid="button-sidebar-toggle" />
                    <div>
                      <h2 className="text-lg font-semibold" data-testid="text-page-title">
                        {location === "/" || location === "/dashboard" ? "Dashboard" :
                         location === "/shops" ? "Shop Management" :
                         location === "/inventory" ? "Inventory Management" :
                         location === "/sales" ? "Sales Management" :
                         location === "/reports" ? "Reports" :
                         location === "/users" ? "User Management" :
                         location === "/settings" ? "Settings" : "Admin Portal"}
                      </h2>
                      <p className="text-sm text-muted-foreground" data-testid="text-page-description">
                        Real-time monitoring and management
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeToggle />
                  </div>
                </header>
                <main className="flex-1 overflow-auto bg-background">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;