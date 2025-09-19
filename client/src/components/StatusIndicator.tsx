import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";

interface StatusIndicatorProps {
  status: "online" | "offline" | "away" | "busy";
  lastSeen?: string;
  className?: string;
  showDot?: boolean;
  size?: "sm" | "md" | "lg";
}

const statusConfig = {
  online: {
    label: "Online",
    color: "text-green-500",
    bgColor: "bg-green-500",
    variant: "secondary" as const,
  },
  offline: {
    label: "Offline", 
    color: "text-gray-500",
    bgColor: "bg-gray-500",
    variant: "secondary" as const,
  },
  away: {
    label: "Away",
    color: "text-yellow-500", 
    bgColor: "bg-yellow-500",
    variant: "secondary" as const,
  },
  busy: {
    label: "Busy",
    color: "text-red-500",
    bgColor: "bg-red-500", 
    variant: "secondary" as const,
  },
};

export function StatusIndicator({ 
  status, 
  lastSeen, 
  className, 
  showDot = true, 
  size = "md" 
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  
  const dotSize = {
    sm: "h-2 w-2",
    md: "h-3 w-3", 
    lg: "h-4 w-4",
  };

  return (
    <div className={cn("flex items-center gap-2", className)} data-testid={`status-${status}`}>
      {showDot && (
        <div className="relative">
          <Circle 
            className={cn(
              dotSize[size], 
              config.bgColor,
              status === "online" && "animate-pulse"
            )} 
            fill="currentColor"
          />
        </div>
      )}
      <Badge variant={config.variant} className={cn("text-xs", config.color)}>
        {config.label}
      </Badge>
      {lastSeen && (
        <span className="text-xs text-muted-foreground" data-testid="text-last-seen">
          {lastSeen}
        </span>
      )}
    </div>
  );
}