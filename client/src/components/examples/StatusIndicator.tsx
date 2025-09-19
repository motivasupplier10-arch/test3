import { StatusIndicator } from "../StatusIndicator";

export default function StatusIndicatorExample() {
  return (
    <div className="space-y-4 p-6">
      <h2 className="text-lg font-semibold">Status Indicators</h2>
      <div className="grid gap-4">
        <StatusIndicator status="online" lastSeen="2 minutes ago" />
        <StatusIndicator status="offline" lastSeen="1 hour ago" />
        <StatusIndicator status="away" lastSeen="15 minutes ago" />
        <StatusIndicator status="busy" lastSeen="Active now" />
      </div>
      <div className="grid gap-4">
        <h3 className="text-md font-medium">Different Sizes</h3>
        <StatusIndicator status="online" size="sm" />
        <StatusIndicator status="online" size="md" />
        <StatusIndicator status="online" size="lg" />
      </div>
    </div>
  );
}