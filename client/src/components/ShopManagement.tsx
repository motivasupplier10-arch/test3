import { useState } from "react";
import { DataTable } from "./DataTable";
import { StatusIndicator } from "./StatusIndicator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MapPin, Clock } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Todo: remove mock data - replace with real API data
interface Shop {
  id: string;
  name: string;
  address: string;
  status: "online" | "offline" | "away" | "busy";
  lastSeen: string;
  appVersion: string;
  totalSales: number;
  ordersToday: number;
}

const mockShops: Shop[] = [
  {
    id: "1",
    name: "Downtown Pharmacy",
    address: "123 Main St, Downtown",
    status: "online",
    lastSeen: "2 minutes ago",
    appVersion: "v2.1.4",
    totalSales: 15420,
    ordersToday: 34,
  },
  {
    id: "2", 
    name: "Medical Center Pharmacy",
    address: "456 Health Ave, Medical District",
    status: "online",
    lastSeen: "1 minute ago",
    appVersion: "v2.1.4",
    totalSales: 28950,
    ordersToday: 67,
  },
  {
    id: "3",
    name: "Suburban Health Plus",
    address: "789 Oak Dr, Suburbs",
    status: "offline",
    lastSeen: "2 hours ago",
    appVersion: "v2.1.3",
    totalSales: 8750,
    ordersToday: 0,
  },
  {
    id: "4",
    name: "Corner Drug Store",
    address: "321 Elm St, Westside",
    status: "away",
    lastSeen: "45 minutes ago",
    appVersion: "v2.1.4",
    totalSales: 12300,
    ordersToday: 18,
  },
  {
    id: "5",
    name: "Central Wellness",
    address: "654 Broadway, Central",
    status: "online",
    lastSeen: "30 seconds ago",
    appVersion: "v2.1.5",
    totalSales: 22140,
    ordersToday: 51,
  },
];

export function ShopManagement() {
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

  const columns: ColumnDef<Shop>[] = [
    {
      accessorKey: "name",
      header: "Shop Name",
      cell: ({ row }) => (
        <div className="font-medium" data-testid={`text-shop-name-${row.original.id}`}>
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusIndicator
          status={row.getValue("status")}
          lastSeen={row.original.lastSeen}
          showDot={true}
        />
      ),
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground" data-testid={`text-shop-address-${row.original.id}`}>
            {row.getValue("address")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "appVersion",
      header: "Version",
      cell: ({ row }) => (
        <Badge variant="outline" data-testid={`badge-version-${row.original.id}`}>
          {row.getValue("appVersion")}
        </Badge>
      ),
    },
    {
      accessorKey: "totalSales",
      header: "Sales Today",
      cell: ({ row }) => (
        <div className="text-right font-medium" data-testid={`text-sales-${row.original.id}`}>
          ${row.getValue<number>("totalSales").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "ordersToday",
      header: "Orders",
      cell: ({ row }) => (
        <div className="text-right" data-testid={`text-orders-${row.original.id}`}>
          {row.getValue("ordersToday")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedShop(row.original)}
          data-testid={`button-view-shop-${row.original.id}`}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const handleExportCsv = () => {
    console.log("Exporting shops to CSV...");
    // Todo: remove mock functionality - implement real CSV export
    alert("CSV export functionality would download shops data here");
  };

  const onlineShops = mockShops.filter(shop => shop.status === "online").length;
  const offlineShops = mockShops.filter(shop => shop.status === "offline").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-shops-title">Shop Management</h1>
        <p className="text-muted-foreground" data-testid="text-shops-description">
          Monitor and manage your shop network
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-shops">
              {mockShops.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Online Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-online-shops">
              {onlineShops}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Offline Shops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="text-offline-shops">
              {offlineShops}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shops Table */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-shops-table-title">All Shops</CardTitle>
          <CardDescription>Real-time status and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockShops}
            searchPlaceholder="Search shops..."
            onExportCsv={handleExportCsv}
          />
        </CardContent>
      </Card>

      {/* Shop Detail Modal (simplified as card for demo) */}
      {selectedShop && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle data-testid="text-shop-detail-title">
                {selectedShop.name} - Details
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedShop(null)}
                data-testid="button-close-detail"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {selectedShop.address}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <StatusIndicator
                  status={selectedShop.status}
                  lastSeen={selectedShop.lastSeen}
                />
              </div>
              <div>
                <h4 className="font-semibold mb-2">App Version</h4>
                <Badge variant="outline">{selectedShop.appVersion}</Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Performance</h4>
                <div className="space-y-1 text-sm">
                  <p data-testid="text-detail-sales">Sales: ${selectedShop.totalSales.toLocaleString()}</p>
                  <p data-testid="text-detail-orders">Orders: {selectedShop.ordersToday}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}