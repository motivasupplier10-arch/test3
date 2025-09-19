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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Shield, Eye, User, Settings } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";

// Todo: remove mock data - replace with real API data
interface UserAccount {
  id: string;
  email: string;
  role: "admin" | "viewer";
  name: string;
  lastLogin: string;
  status: "active" | "inactive";
  createdAt: string;
}

const mockUsers: UserAccount[] = [
  {
    id: "1",
    email: "admin@example.com",
    role: "admin",
    name: "John Admin",
    lastLogin: "2 minutes ago",
    status: "active",
    createdAt: "2024-01-01",
  },
  {
    id: "2",
    email: "manager@pharmacy.com",
    role: "viewer",
    name: "Sarah Manager",
    lastLogin: "1 hour ago",
    status: "active",
    createdAt: "2024-01-02",
  },
  {
    id: "3",
    email: "analyst@company.com",
    role: "viewer",
    name: "Mike Analyst",
    lastLogin: "1 day ago",
    status: "active",
    createdAt: "2024-01-03",
  },
  {
    id: "4",
    email: "old.user@test.com",
    role: "viewer",
    name: "Jane Viewer",
    lastLogin: "1 week ago",
    status: "inactive",
    createdAt: "2024-01-04",
  },
];

export function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState<"admin" | "viewer">("viewer");

  const getRoleIcon = (role: string) => {
    return role === "admin" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />;
  };

  const getRoleColor = (role: string) => {
    return role === "admin" ? "text-red-600" : "text-blue-600";
  };

  const columns: ColumnDef<UserAccount>[] = [
    {
      accessorKey: "name",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium" data-testid={`text-user-name-${user.id}`}>
                {user.name}
              </div>
              <div className="text-sm text-muted-foreground" data-testid={`text-user-email-${user.id}`}>
                {user.email}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string;
        return (
          <div className={cn("flex items-center gap-2 capitalize", getRoleColor(role))}>
            {getRoleIcon(role)}
            <span data-testid={`text-role-${row.original.id}`}>{role}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge 
            variant={status === "active" ? "default" : "secondary"}
            data-testid={`badge-status-${row.original.id}`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-last-login-${row.original.id}`}>
          {row.getValue("lastLogin")}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground" data-testid={`text-created-${row.original.id}`}>
          {row.getValue("createdAt")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUser(row.original)}
            data-testid={`button-view-user-${row.original.id}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            data-testid={`button-edit-user-${row.original.id}`}
          >
            <Settings className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const handleCreateUser = () => {
    console.log("Creating user:", { email: newUserEmail, name: newUserName, role: newUserRole });
    // Todo: remove mock functionality - implement real user creation
    alert(`User creation would happen here for ${newUserEmail} as ${newUserRole}`);
    setNewUserEmail("");
    setNewUserName("");
    setNewUserRole("viewer");
  };

  const activeUsers = mockUsers.filter(user => user.status === "active").length;
  const adminUsers = mockUsers.filter(user => user.role === "admin").length;
  const viewerUsers = mockUsers.filter(user => user.role === "viewer").length;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-users-title">User Management</h1>
          <p className="text-muted-foreground" data-testid="text-users-description">
            Manage admin portal access and permissions
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button data-testid="button-add-user">
              <UserPlus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the admin portal with appropriate permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="user-name">Full Name</Label>
                <Input
                  id="user-name"
                  placeholder="Enter full name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  data-testid="input-user-name"
                />
              </div>
              <div>
                <Label htmlFor="user-email">Email Address</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  data-testid="input-user-email"
                />
              </div>
              <div>
                <Label htmlFor="user-role">Role</Label>
                <Select value={newUserRole} onValueChange={(value: "admin" | "viewer") => setNewUserRole(value)}>
                  <SelectTrigger data-testid="select-user-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer - Read-only access</SelectItem>
                    <SelectItem value="admin">Admin - Full access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateUser}
                disabled={!newUserEmail || !newUserName}
                data-testid="button-create-user"
              >
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-users">
              {mockUsers.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600" data-testid="text-active-users">
              {activeUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-admin-users">
              {adminUsers}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4 text-blue-600" />
              Viewers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-viewer-users">
              {viewerUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle data-testid="text-users-table-title">All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={mockUsers}
            searchPlaceholder="Search users..."
          />
        </CardContent>
      </Card>

      {/* User Detail Modal (simplified as card for demo) */}
      {selectedUser && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle data-testid="text-user-detail-title">
                User Details - {selectedUser.name}
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSelectedUser(null)}
                data-testid="button-close-user-detail"
              >
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt={selectedUser.name} />
                <AvatarFallback>
                  {selectedUser.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold" data-testid="text-detail-name">
                  {selectedUser.name}
                </h3>
                <p className="text-muted-foreground" data-testid="text-detail-email">
                  {selectedUser.email}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Role</h4>
                <div className={cn("flex items-center gap-2 capitalize", getRoleColor(selectedUser.role))}>
                  {getRoleIcon(selectedUser.role)}
                  <span data-testid="text-detail-role">{selectedUser.role}</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                <Badge 
                  variant={selectedUser.status === "active" ? "default" : "secondary"}
                  data-testid="text-detail-status"
                >
                  {selectedUser.status}
                </Badge>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Last Login</h4>
                <p data-testid="text-detail-last-login">{selectedUser.lastLogin}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Created</h4>
                <p data-testid="text-detail-created">{selectedUser.createdAt}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" data-testid="button-reset-password">
                Reset Password
              </Button>
              <Button 
                variant="outline"
                data-testid="button-toggle-status"
              >
                {selectedUser.status === "active" ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}