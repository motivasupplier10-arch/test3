import { KPICard } from "../KPICard";
import { Store, DollarSign, ShoppingCart, Package } from "lucide-react";

export default function KPICardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-6">
      <KPICard
        title="Online Shops"
        value="12/17"
        description="Active locations"
        icon={Store}
        trend={{ value: 5.2, label: "from last week", direction: "up" }}
      />
      <KPICard
        title="Sales Today"
        value="$24,580"
        description="Revenue generated"
        icon={DollarSign}
        trend={{ value: 12.5, label: "from yesterday", direction: "up" }}
      />
      <KPICard
        title="Orders Today"
        value={342}
        description="Transactions processed"
        icon={ShoppingCart}
        trend={{ value: -2.1, label: "from yesterday", direction: "down" }}
      />
      <KPICard
        title="Low Stock Items"
        value={23}
        description="Require attention"
        icon={Package}
      />
    </div>
  );
}