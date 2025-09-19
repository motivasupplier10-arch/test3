import { DataTable } from "../DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface SampleData {
  id: string;
  name: string;
  status: "active" | "inactive";
  value: number;
  date: string;
}

const sampleData: SampleData[] = [
  { id: "1", name: "Item One", status: "active", value: 1250, date: "2024-01-15" },
  { id: "2", name: "Item Two", status: "inactive", value: 850, date: "2024-01-14" },
  { id: "3", name: "Item Three", status: "active", value: 2100, date: "2024-01-13" },
  { id: "4", name: "Item Four", status: "active", value: 675, date: "2024-01-12" },
  { id: "5", name: "Item Five", status: "inactive", value: 1890, date: "2024-01-11" },
];

export default function DataTableExample() {
  const columns: ColumnDef<SampleData>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "value",
      header: "Value",
      cell: ({ row }) => (
        <div className="text-right font-mono">
          ${row.getValue<number>("value").toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.getValue("date")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm">
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
      ),
    },
  ];

  const handleExportCsv = () => {
    console.log("Exporting CSV...");
    alert("CSV export would happen here");
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-4">Data Table Example</h2>
      <DataTable
        columns={columns}
        data={sampleData}
        searchPlaceholder="Search items..."
        onExportCsv={handleExportCsv}
      />
    </div>
  );
}