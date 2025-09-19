import { useState } from "react";
import { DataTable } from "./DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, AlertTriangle, List, Grid3x3 } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Todo: remove mock data - replace with real API data
interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  shopName: string;
  availableQty: number;
  reorderPoint: number;
  category: string;
  unitPrice: number;
  lastUpdated: string;
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    productName: "Paracetamol 500mg",
    sku: "MED001",
    shopName: "Downtown Pharmacy",
    availableQty: 450,
    reorderPoint: 100,
    category: "Pain Relief",
    unitPrice: 0.25,
    lastUpdated: "2 minutes ago",
  },
  {
    id: "2",
    productName: "Ibuprofen 400mg",
    sku: "MED002",
    shopName: "Medical Center",
    availableQty: 15,
    reorderPoint: 50,
    category: "Pain Relief",
    unitPrice: 0.45,
    lastUpdated: "5 minutes ago",
  },
  {
    id: "3",
    productName: "Vitamin C 1000mg",
    sku: "VIT001",
    shopName: "Health Plus",
    availableQty: 0,
    reorderPoint: 25,
    category: "Vitamins",
    unitPrice: 0.80,
    lastUpdated: "1 hour ago",
  },
  {
    id: "4",
    productName: "Blood Pressure Monitor",
    sku: "DEV001",
    shopName: "Central Wellness", 
    availableQty: 8,
    reorderPoint: 5,
    category: "Medical Devices",
    unitPrice: 45.00,
    lastUpdated: "30 minutes ago",
  },
  {
    id: "5",
    productName: "Insulin Pen",
    sku: "MED003",
    shopName: "Corner Drug Store",
    availableQty: 2,
    reorderPoint: 10,
    category: "Diabetes Care",
    unitPrice: 25.50,
    lastUpdated: "10 minutes ago",
  },
];

export function InventoryManagement() {
  const [viewMode, setViewMode] = useState<"list" | "grouped">("list");

  const getStockStatus = (item: InventoryItem) => {
    if (item.availableQty === 0) {
      return { status: "out-of-stock", label: "Out of Stock", variant: "destructive" as const };
    } else if (item.availableQty <= item.reorderPoint) {
      return { status: "low-stock", label: "Low Stock", variant: "secondary" as const };
    } else {
      return { status: "in-stock", label: "In Stock", variant: "default" as const };
    }
  };

  const columns: ColumnDef<InventoryItem>[] = [
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
      accessorKey: "shopName",
      header: "Shop",
      cell: ({ row }) => (
        <span data-testid={`text-shop-${row.original.id}`}>
          {row.getValue("shopName")}
        </span>
      ),
    },
    {
      accessorKey: "availableQty",
      header: "Stock",
      cell: ({ row }) => {
        const item = row.original;
        const stockInfo = getStockStatus(item);
        return (
          <div className="text-right">
            <div className="font-mono font-medium" data-testid={`text-qty-${item.id}`}>
              {item.availableQty}
            </div>
            <Badge variant={stockInfo.variant} className="text-xs mt-1">
              {stockInfo.label}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" data-testid={`badge-category-${row.original.id}`}>
          {row.getValue("category")}
        </Badge>
      ),
    },
    {
      accessorKey: "unitPrice",
      header: "Unit Price",
      cell: ({ row }) => (
        <div className="text-right font-mono" data-testid={`text-price-${row.original.id}`}>
          ${row.getValue<number>("unitPrice").toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-updated-${row.original.id}`}>
          {row.getValue("lastUpdated")}
        </span>
      ),
    },
  ];

  const handleExportCsv = () => {
    console.log("Exporting inventory to CSV...");
    // Todo: remove mock functionality - implement real CSV export
    alert("CSV export functionality would download inventory data here");
  };

  // Group inventory by shop
  const groupedInventory = mockInventory.reduce((acc, item) => {
    if (!acc[item.shopName]) {
      acc[item.shopName] = [];
    }
    acc[item.shopName].push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

  const lowStockItems = mockInventory.filter(item => 
    item.availableQty <= item.reorderPoint && item.availableQty > 0
  ).length;
  const outOfStockItems = mockInventory.filter(item => item.availableQty === 0).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-inventory-title">Inventory Management</h1>
        <p className="text-muted-foreground" data-testid="text-inventory-description">
          Monitor stock levels and manage inventory across all locations
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-products">
              {mockInventory.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600" data-testid="text-low-stock-count">
              {lowStockItems}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600" data-testid="text-out-stock-count">
              {outOfStockItems}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-value">
              ${mockInventory.reduce((sum, item) => sum + (item.availableQty * item.unitPrice), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Inventory Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle data-testid="text-inventory-table-title">Stock Levels</CardTitle>
              <CardDescription>Real-time inventory across all locations</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                data-testid="button-list-view"
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button
                variant={viewMode === "grouped" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grouped")}
                data-testid="button-grouped-view"
              >
                <Grid3x3 className="h-4 w-4 mr-2" />
                Group by Shop
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === "list" ? (
            <DataTable
              columns={columns}
              data={mockInventory}
              searchPlaceholder="Search products..."
              onExportCsv={handleExportCsv}
            />
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedInventory).map(([shopName, items]) => {
                const shopLowStock = items.filter(item => 
                  item.availableQty <= item.reorderPoint && item.availableQty > 0
                ).length;
                const shopOutOfStock = items.filter(item => item.availableQty === 0).length;
                const shopTotalValue = items.reduce((sum, item) => sum + (item.availableQty * item.unitPrice), 0);
                
                return (
                  <div key={shopName} className="border rounded-lg p-4 space-y-4" data-testid={`shop-group-${shopName.replace(/\s+/g, '-').toLowerCase()}`}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{shopName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{items.length} products</span>
                        {shopLowStock > 0 && (
                          <Badge variant="secondary" className="text-yellow-600">
                            {shopLowStock} low stock
                          </Badge>
                        )}
                        {shopOutOfStock > 0 && (
                          <Badge variant="destructive">
                            {shopOutOfStock} out of stock
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total Products: </span>
                        <span className="font-medium">{items.length}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Total Value: </span>
                        <span className="font-medium">${shopTotalValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Updated: </span>
                        <span className="font-medium">{items.reduce((latest, item) => 
                          latest === "just now" || item.lastUpdated < latest ? item.lastUpdated : latest
                        , "just now")}</span>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      {items.map((item) => {
                        const stockInfo = getStockStatus(item);
                        return (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-muted/30 rounded border" data-testid={`grouped-item-${item.id}`}>
                            <div className="flex-1">
                              <div className="font-medium">{item.productName}</div>
                              <div className="text-sm text-muted-foreground">SKU: {item.sku} • {item.category}</div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className="font-mono font-medium">{item.availableQty}</div>
                                <Badge variant={stockInfo.variant} className="text-xs">
                                  {stockInfo.label}
                                </Badge>
                              </div>
                              <div className="text-right text-sm">
                                <div className="font-medium">${item.unitPrice.toFixed(2)}</div>
                                <div className="text-muted-foreground">{item.lastUpdated}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}