import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AppSidebarExample() {
  const handleLogout = () => {
    console.log("Logout clicked");
    alert("Logout clicked! (This is just a demo)");
  };

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-96 w-full border rounded-lg overflow-hidden">
        <AppSidebar onLogout={handleLogout} />
        <div className="flex-1 bg-background p-6">
          <h2 className="text-lg font-semibold">Main Content Area</h2>
          <p className="text-muted-foreground">The sidebar navigation is fully functional</p>
        </div>
      </div>
    </SidebarProvider>
  );
}