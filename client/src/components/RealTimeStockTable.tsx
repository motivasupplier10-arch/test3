import { useState, useEffect } from "react";
import { DataTable } from "./DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Package, 
  AlertTriangle, 
  RefreshCw, 
  Filter,
  Search,
  Calendar,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type ColumnDef } from "@tanstack/react-table";

// Todo: remove mock data - replace with real API data and SSE
interface RealTimeStockItem {
  id: string;
  productName: string;
  sku: string;
  batchNumber: string;
  expiryDate: string;
  shopName: string;
  currentStock: number;
  reorderPoint: number;
  category: string;
  status: "normal" | "low" | "out" | "expiring";
  lastUpdated: string;
  lastUpdatedTimestamp: number;
}

const mockRealTimeStock: RealTimeStockItem[] = [
  {
    id: "1",
    productName: "Paracetamol 500mg",
    sku: "MED001",
    batchNumber: "BTH2024001",
    expiryDate: "2025-06-15",
    shopName: "Downtown Pharmacy",
    currentStock: 450,
    reorderPoint: 100,
    category: "Pain Relief",
    status: "normal",
    lastUpdated: "30 seconds ago",
    lastUpdatedTimestamp: Date.now() - 30000,
  },
  {
    id: "2",
    productName: "Ibuprofen 400mg",
    sku: "MED002",
    batchNumber: "BTH2024002",
    expiryDate: "2024-12-20",
    shopName: "Medical Center",
    currentStock: 15,
    reorderPoint: 50,
    category: "Pain Relief",
    status: "low",
    lastUpdated: "1 minute ago",
    lastUpdatedTimestamp: Date.now() - 60000,
  },
  {
    id: "3",
    productName: "Vitamin C 1000mg",
    sku: "VIT001",
    batchNumber: "BTH2024003",
    expiryDate: "2024-10-30",
    shopName: "Health Plus",
    currentStock: 0,
    reorderPoint: 25,
    category: "Vitamins",
    status: "out",
    lastUpdated: "2 minutes ago",
    lastUpdatedTimestamp: Date.now() - 120000,
  },
  {
    id: "4",
    productName: "Blood Pressure Monitor",
    sku: "DEV001",
    batchNumber: "BTH2024004",
    expiryDate: "2026-08-15",
    shopName: "Central Wellness",
    currentStock: 8,
    reorderPoint: 5,
    category: "Medical Devices",
    status: "normal",
    lastUpdated: "45 seconds ago",
    lastUpdatedTimestamp: Date.now() - 45000,
  },
  {
    id: "5",
    productName: "Insulin Pen",
    sku: "MED003",
    batchNumber: "BTH2024005",
    expiryDate: "2024-11-10",
    shopName: "Corner Drug Store",
    currentStock: 2,
    reorderPoint: 10,
    category: "Diabetes Care",
    status: "expiring",
    lastUpdated: "1 minute ago",
    lastUpdatedTimestamp: Date.now() - 60000,
  },
];

export function RealTimeStockTable() {
  const [stockData, setStockData] = useState<RealTimeStockItem[]>(mockRealTimeStock);
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);
  const [filterShop, setFilterShop] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Simulate real-time updates
  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      setStockData(prevData => {
        return prevData.map(item => ({
          ...item,
          lastUpdated: getTimeAgo(item.lastUpdatedTimestamp),
        }));
      });
      setLastRefresh(new Date());
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  // Todo: replace with actual SSE implementation
  const connectToRealTimeUpdates = () => {
    console.log("Connecting to real-time stock updates via SSE...");
    // Real implementation would establish SSE connection here
  };

  const getTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 bg-green-50 border-green-200";
      case "low":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "out":
        return "text-red-600 bg-red-50 border-red-200";
      case "expiring":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "normal":
        return "default" as const;
      case "low":
        return "secondary" as const;
      case "out":
        return "destructive" as const;
      case "expiring":
        return "secondary" as const;
      default:
        return "outline" as const;
    }
  };

  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // Expiring within 30 days
  };

  const columns: ColumnDef<RealTimeStockItem>[] = [
    {
      accessorKey: "productName",
      header: "Product",
      cell: ({ row }) => (
        <div>
          <div className="font-medium" data-testid={`text-product-${row.original.id}`}>
            {row.getValue("productName")}
          </div>
          <div className="text-sm text-muted-foreground">
            SKU: {row.original.sku}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "batchNumber",
      header: "Batch / Expiry",
      cell: ({ row }) => {
        const item = row.original;
        const expiringSoon = isExpiringShortly(item.expiryDate);
        return (
          <div>
            <div className="font-mono text-sm" data-testid={`text-batch-${item.id}`}>
              {item.batchNumber}
            </div>
            <div className={cn(
              "text-xs flex items-center gap-1",
              expiringSoon ? "text-red-600 font-medium" : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              <span data-testid={`text-expiry-${item.id}`}>{item.expiryDate}</span>
              {expiringSoon && <AlertTriangle className="h-3 w-3" />}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "shopName",
      header: "Shop",
      cell: ({ row }) => (
        <span data-testid={`text-shop-${row.original.id}`}>
          {row.getValue("shopName")}
        </span>
      ),
    },
    {
      accessorKey: "currentStock",
      header: "Current Stock",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="text-right">
            <div className="font-mono font-bold text-lg" data-testid={`text-stock-${item.id}`}>
              {item.currentStock}
            </div>
            <div className="text-xs text-muted-foreground">
              Reorder at {item.reorderPoint}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
        return (
          <Badge 
            variant={getStatusBadgeVariant(status)}
            className={cn(getStatusColor(status))}
            data-testid={`badge-status-${row.original.id}`}
          >
            {statusLabel === "Out" ? "Out of Stock" : statusLabel}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span data-testid={`text-updated-${row.original.id}`}>
            {row.getValue("lastUpdated")}
          </span>
        </div>
      ),
    },
  ];

  // Helper function for expiry checking
  const isExpiringShortly = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  };

  // Filter data based on selected filters
  const filteredData = stockData.filter(item => {
    const matchesShop = !filterShop || item.shopName === filterShop;
    const matchesCategory = !filterCategory || item.category === filterCategory;
    const matchesStatus = !filterStatus || item.status === filterStatus;
    return matchesShop && matchesCategory && matchesStatus;
  });

  const handleExportCsv = () => {
    console.log("Exporting real-time stock to CSV...");
    // Todo: implement real CSV export
    alert("CSV export functionality would download real-time stock data here");
  };

  const shops = Array.from(new Set(stockData.map(item => item.shopName)));
  const categories = Array.from(new Set(stockData.map(item => item.category)));
  const statuses = ["normal", "low", "out", "expiring"];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-realtime-stock-title">
            Real-Time Stock Monitoring
          </h1>
          <p className="text-muted-foreground" data-testid="text-realtime-stock-description">
            Live inventory tracking with batch and expiry information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={isAutoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setIsAutoRefresh(!isAutoRefresh)}
            data-testid="button-auto-refresh"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", isAutoRefresh && "animate-spin")} />
            Auto Refresh
          </Button>
          <div className="text-xs text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          <CardDescription>Filter inventory by shop, category, or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Shop</label>
              <Select value={filterShop} onValueChange={setFilterShop}>
                <SelectTrigger data-testid="select-filter-shop">
                  <SelectValue placeholder="All shops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All shops</SelectItem>
                  {shops.map(shop => (
                    <SelectItem key={shop} value={shop}>{shop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger data-testid="select-filter-category">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger data-testid="select-filter-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Stock Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Live Stock Monitor
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-muted-foreground">Live</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">{filteredData.length} items</span>
            </div>
          </CardTitle>
          <CardDescription>
            Real-time inventory with batch tracking and expiry monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredData}
            searchPlaceholder="Search products, SKU, or batch..."
            onExportCsv={handleExportCsv}
          />
        </CardContent>
      </Card>
    </div>
  );
}