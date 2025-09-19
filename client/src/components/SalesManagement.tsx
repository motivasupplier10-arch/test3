import { useState } from "react";
import { DataTable } from "./DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Eye, CreditCard, Banknote, FileText } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { type ColumnDef } from "@tanstack/react-table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

// Todo: remove mock data - replace with real API data
interface Sale {
  id: string;
  shopName: string;
  totalAmount: number;
  paymentMode: "cash" | "card" | "digital";
  itemsCount: number;
  createdAt: string;
  customerName?: string;
}

const mockSales: Sale[] = [
  {
    id: "TXN001",
    shopName: "Downtown Pharmacy",
    totalAmount: 45.80,
    paymentMode: "card",
    itemsCount: 3,
    createdAt: "2024-01-15 14:30",
    customerName: "John Smith",
  },
  {
    id: "TXN002",
    shopName: "Medical Center",
    totalAmount: 128.50,
    paymentMode: "cash",
    itemsCount: 7,
    createdAt: "2024-01-15 13:45",
  },
  {
    id: "TXN003",
    shopName: "Health Plus",
    totalAmount: 89.99,
    paymentMode: "digital",
    itemsCount: 2,
    createdAt: "2024-01-15 12:20",
    customerName: "Sarah Johnson",
  },
  {
    id: "TXN004",
    shopName: "Corner Drug Store",
    totalAmount: 234.75,
    paymentMode: "card",
    itemsCount: 12,
    createdAt: "2024-01-15 11:15",
  },
  {
    id: "TXN005",
    shopName: "Central Wellness",
    totalAmount: 67.40,
    paymentMode: "cash",
    itemsCount: 4,
    createdAt: "2024-01-15 10:30",
    customerName: "Mike Davis",
  },
];

const dailySalesData = [
  { date: "Mon", sales: 12450, transactions: 78 },
  { date: "Tue", sales: 15680, transactions: 92 },
  { date: "Wed", sales: 18920, transactions: 105 },
  { date: "Thu", sales: 16340, transactions: 87 },
  { date: "Fri", sales: 21570, transactions: 134 },
  { date: "Sat", sales: 24680, transactions: 156 },
  { date: "Sun", sales: 19830, transactions: 112 },
];

export function SalesManagement() {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const getPaymentModeIcon = (mode: string) => {
    switch (mode) {
      case "cash":
        return <Banknote className="h-4 w-4" />;
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "digital":
        return <FileText className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getPaymentModeColor = (mode: string) => {
    switch (mode) {
      case "cash":
        return "text-green-600";
      case "card":
        return "text-blue-600";
      case "digital":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "id",
      header: "Transaction ID",
      cell: ({ row }) => (
        <div className="font-mono text-sm" data-testid={`text-txn-id-${row.original.id}`}>
          {row.getValue("id")}
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
      accessorKey: "totalAmount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-right font-medium" data-testid={`text-amount-${row.original.id}`}>
          ${row.getValue<number>("totalAmount").toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: "paymentMode",
      header: "Payment",
      cell: ({ row }) => {
        const mode = row.getValue("paymentMode") as string;
        return (
          <div className={cn("flex items-center gap-2 capitalize", getPaymentModeColor(mode))}>
            {getPaymentModeIcon(mode)}
            <span data-testid={`text-payment-${row.original.id}`}>{mode}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "itemsCount",
      header: "Items",
      cell: ({ row }) => (
        <div className="text-center" data-testid={`text-items-${row.original.id}`}>
          {row.getValue("itemsCount")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date & Time",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground" data-testid={`text-date-${row.original.id}`}>
          {row.getValue("createdAt")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedSale(row.original)}
          data-testid={`button-view-sale-${row.original.id}`}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const handleExportCsv = () => {
    console.log("Exporting sales to CSV...");
    // Todo: remove mock functionality - implement real CSV export
    alert("CSV export functionality would download sales data here");
  };

  const totalSales = mockSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalTransactions = mockSales.length;
  const avgTransactionValue = totalSales / totalTransactions;
  const cashSales = mockSales.filter(sale => sale.paymentMode === "cash").length;
  const cardSales = mockSales.filter(sale => sale.paymentMode === "card").length;
  const digitalSales = mockSales.filter(sale => sale.paymentMode === "digital").length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-sales-title">Sales Management</h1>
        <p className="text-muted-foreground" data-testid="text-sales-description">
          Track and analyze sales performance across all locations
        </p>
      </div>

      {/* Date Range Picker */}
      <div className="flex items-center gap-4">
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
                data-testid="button-date-from"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "PPP") : "From date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
                data-testid="button-date-to"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "PPP") : "To date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button variant="outline" data-testid="button-quick-today">Today</Button>
        <Button variant="outline" data-testid="button-quick-7d">7 Days</Button>
        <Button variant="outline" data-testid="button-quick-30d">30 Days</Button>
      </div>

      {/* Sales Overview Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-sales-trend-title">Sales Trend (7 Days)</CardTitle>
            <CardDescription>Daily sales performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailySalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-sales">
                ${totalSales.toFixed(2)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-transactions">
                {totalTransactions}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Transaction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-avg-transaction">
                ${avgTransactionValue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Methods Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4 text-green-600" />
              Cash Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-cash-payments">
              {cashSales}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              Card Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-card-payments">
              {cardSales}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-600" />
              Digital Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-digital-payments">
              {digitalSales}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-sales-table-title">Recent Transactions</CardTitle>
          <CardDescription>Latest sales across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockSales}
            searchPlaceholder="Search transactions..."
            onExportCsv={handleExportCsv}
          />
        </CardContent>
      </Card>

      {/* Sale Detail Modal (simplified as card for demo) */}
      {selectedSale && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle data-testid="text-sale-detail-title">
                Transaction {selectedSale.id}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedSale(null)}
                data-testid="button-close-sale-detail"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Shop</h4>
                <p data-testid="text-detail-shop">{selectedSale.shopName}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Customer</h4>
                <p data-testid="text-detail-customer">
                  {selectedSale.customerName || "Walk-in Customer"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Total Amount</h4>
                <p className="text-2xl font-bold text-primary" data-testid="text-detail-amount">
                  ${selectedSale.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Payment Method</h4>
                <div className={cn("flex items-center gap-2 capitalize", getPaymentModeColor(selectedSale.paymentMode))}>
                  {getPaymentModeIcon(selectedSale.paymentMode)}
                  <span data-testid="text-detail-payment">{selectedSale.paymentMode}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Items</h4>
                <p data-testid="text-detail-items">{selectedSale.itemsCount} items</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Date & Time</h4>
                <p data-testid="text-detail-date">{selectedSale.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}