import { KPICard } from "./KPICard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Store, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Boxes,
  Clock
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend
} from "recharts";
import { Badge } from "@/components/ui/badge";

// Todo: remove mock data - replace with real API data
const stockConsumptionData = [
  { day: "Mon", consumption: 1200, restocked: 800 },
  { day: "Tue", consumption: 1350, restocked: 600 },
  { day: "Wed", consumption: 980, restocked: 1200 },
  { day: "Thu", consumption: 1580, restocked: 400 },
  { day: "Fri", consumption: 2100, restocked: 900 },
  { day: "Sat", consumption: 1850, restocked: 700 },
  { day: "Sun", consumption: 920, restocked: 500 },
];

const categoryDistribution = [
  { name: "Pain Relief", value: 35, color: "#10b981", stock: 2450 },
  { name: "Vitamins", value: 25, color: "#3b82f6", stock: 1750 },
  { name: "Diabetes Care", value: 20, color: "#f59e0b", stock: 1400 },
  { name: "Medical Devices", value: 15, color: "#ef4444", stock: 1050 },
  { name: "Others", value: 5, color: "#8b5cf6", stock: 350 },
];

const shopStockAvailability = [
  { shopName: "Downtown Pharmacy", totalStock: 1850, lowStock: 12, outOfStock: 2 },
  { shopName: "Medical Center", totalStock: 2100, lowStock: 8, outOfStock: 1 },
  { shopName: "Health Plus", totalStock: 980, lowStock: 15, outOfStock: 5 },
  { shopName: "Corner Drug Store", totalStock: 1420, lowStock: 6, outOfStock: 3 },
  { shopName: "Central Wellness", totalStock: 1650, lowStock: 9, outOfStock: 1 },
];

const topFastMovingProducts = [
  { name: "Paracetamol 500mg", velocity: 145, currentStock: 450, daysToDepletion: 3 },
  { name: "Ibuprofen 400mg", velocity: 98, currentStock: 320, daysToDepletion: 3 },
  { name: "Vitamin C 1000mg", velocity: 82, currentStock: 180, daysToDepletion: 2 },
  { name: "Cough Syrup", velocity: 67, currentStock: 90, daysToDepletion: 1 },
  { name: "Hand Sanitizer", velocity: 125, currentStock: 280, daysToDepletion: 2 },
];

const lowStockItems = [
  { product: "Aspirin 100mg", shop: "Downtown Pharmacy", stock: 5, reorderPoint: 20 },
  { product: "Insulin Pen", shop: "Medical Center", stock: 2, reorderPoint: 10 },
  { product: "Blood Pressure Monitor", shop: "Health Plus", stock: 1, reorderPoint: 5 },
];

// Calculate total stock value
const totalStockValue = categoryDistribution.reduce((sum, cat) => sum + cat.stock * 12.50, 0); // Avg price $12.50
const outOfStockCount = shopStockAvailability.reduce((sum, shop) => sum + shop.outOfStock, 0);
const lowStockCount = shopStockAvailability.reduce((sum, shop) => sum + shop.lowStock, 0);

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground" data-testid="text-dashboard-description">
          Overview of your shop network performance
        </p>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Stock Value"
          value={`$${(totalStockValue / 1000).toFixed(1)}K`}
          description="Across all locations"
          icon={DollarSign}
          trend={{ value: 3.2, label: "from last week", direction: "up" }}
        />
        <KPICard
          title="Out-of-Stock Items"
          value={outOfStockCount}
          description="Require immediate restocking"
          icon={AlertTriangle}
          trend={{ value: 15.3, label: "from yesterday", direction: "up" }}
        />
        <KPICard
          title="Low Stock Alerts"
          value={lowStockCount}
          description="Below reorder threshold"
          icon={Package}
          trend={{ value: -8.1, label: "from last check", direction: "down" }}
        />
        <KPICard
          title="Fast-Moving Products"
          value={topFastMovingProducts.length}
          description="High velocity items"
          icon={TrendingUp}
          trend={{ value: 22.5, label: "velocity increase", direction: "up" }}
        />
      </div>

      {/* Advanced Chart Widgets */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stock Consumption Over Time */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-stock-consumption-title">Stock Consumption</CardTitle>
            <CardDescription>Daily consumption vs restocking patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stockConsumptionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="consumption"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  name="Consumed"
                />
                <Line
                  type="monotone"
                  dataKey="restocked"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={3}
                  name="Restocked"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category-wise Stock Distribution */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-category-distribution-title">Category Distribution</CardTitle>
            <CardDescription>Stock breakdown by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${value}% (${props.payload.stock} units)`,
                  name
                ]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Shop-wise Stock Availability */}
        <Card>
          <CardHeader>
            <CardTitle data-testid="text-shop-availability-title">Shop Stock Status</CardTitle>
            <CardDescription>Stock levels across all locations</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={shopStockAvailability}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="shopName" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalStock" fill="hsl(var(--chart-1))" name="Total Stock" />
                <Bar dataKey="lowStock" fill="hsl(var(--chart-3))" name="Low Stock" />
                <Bar dataKey="outOfStock" fill="hsl(var(--chart-4))" name="Out of Stock" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top 5 Fast-Moving Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-fast-moving-title">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Top Fast-Moving Products
            </CardTitle>
            <CardDescription>Products with highest consumption velocity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFastMovingProducts.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover-elevate">
                  <div className="flex-1">
                    <p className="font-medium" data-testid={`text-fast-product-${index}`}>{item.name}</p>
                    <p className="text-sm text-muted-foreground">Velocity: {item.velocity} units/day</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.daysToDepletion <= 1 ? "destructive" : item.daysToDepletion <= 2 ? "secondary" : "default"}>                        
                        {item.currentStock} left
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{item.daysToDepletion}d</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" data-testid="text-critical-alerts-title">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Alerts
            </CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800">
                  <div>
                    <p className="font-medium" data-testid={`text-alert-product-${index}`}>{item.product}</p>
                    <p className="text-sm text-muted-foreground" data-testid={`text-alert-shop-${index}`}>{item.shop}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="destructive" data-testid={`badge-alert-stock-${index}`}>
                      {item.stock} left
                    </Badge>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                      Reorder at {item.reorderPoint}
                    </p>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground text-center">
                  <Boxes className="h-4 w-4 inline mr-1" />
                  Total: {outOfStockCount} out of stock, {lowStockCount} low stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}