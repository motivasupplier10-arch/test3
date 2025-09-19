import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    direction: "up" | "down";
  };
  className?: string;
}

export function KPICard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className 
}: KPICardProps) {
  const TrendIcon = trend?.direction === "up" ? TrendingUp : TrendingDown;
  const trendColor = trend?.direction === "up" ? "text-green-600" : "text-red-600";

  return (
    <Card className={cn("hover-elevate", className)} data-testid={`kpi-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`kpi-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <div className="flex items-center justify-between mt-2">
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs", trendColor)}>
              <TrendIcon className="h-3 w-3" />
              <span>{trend.value > 0 ? "+" : ""}{trend.value}%</span>
              <span className="text-muted-foreground">{trend.label}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}