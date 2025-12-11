import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, Key, Copy } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { EmployeeFormModal } from '@/components/employees/EmployeeFormModal';

const Employees = () => {
  const navigate = useNavigate();
  const { employees, deleteEmployee, getEmployeeDeletionInfo } = useData();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletionInfo, setDeletionInfo] = useState<{ employee?: any; documentCount: number; licenseCount: number } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedEmployeePassword, setSelectedEmployeePassword] = useState<{ name: string; email: string; password: string } | null>(null);
  const [employeePasswords, setEmployeePasswords] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAllPasswords();
  }, []);

  const fetchAllPasswords = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('email, password_hash')
        .eq('role', 'employee');
      
      if (error) throw error;
      
      const passwordMap: Record<string, string> = {};
      data?.forEach(user => {
        passwordMap[user.email] = user.password_hash;
      });
      setEmployeePasswords(passwordMap);
    } catch (error) {
      console.error('Error fetching passwords:', error);
    }
  };

  const handleViewPassword = (employee: any) => {
    const password = employeePasswords[employee.email] || 'Not found';
    setSelectedEmployeePassword({
      name: employee.fullName,
      email: employee.email,
      password: password
    });
    setPasswordModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.fullName.toLowerCase().includes(search.toLowerCase()) ||
      employee.email.toLowerCase().includes(search.toLowerCase()) ||
      employee.position.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || employee.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleDeleteClick = (id: string) => {
    const info = getEmployeeDeletionInfo(id);
    setDeletionInfo(info);
    setDeleteId(id);
  };

  const handleDelete = async () => {
    if (deleteId && deletionInfo) {
      const result = await deleteEmployee(deleteId);
      const message = `Employee deleted successfully. Also deleted ${result.deletedDocuments} document(s) and ${result.deletedLicenses} license(s).`;
      toast.success(message);
      setDeleteId(null);
      setDeletionInfo(null);
    }
  };

  const handleEdit = (id: string) => {
    setEditingEmployee(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEmployee(null);
  };

  return (
    <div className="min-h-screen">
      <Header title="Employees" />

      <div className="p-4 lg:p-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or position..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Employee Grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm transition-shadow hover:shadow-sm"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={employee.photoUrl} alt={employee.fullName} />
                  <AvatarFallback className="bg-gray-100 text-gray-700 text-lg">
                    {employee.fullName.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-card-foreground truncate">
                    {employee.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{employee.position}</p>
                  <p className="text-sm text-muted-foreground mt-1">{employee.email}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(() => {
                      const locationNames = employee.employee_locations
                        ?.map(el => el.locations?.name)
                        .filter(Boolean) || [];
                      return locationNames.length > 0 ? (
                        locationNames.slice(0, 2).map((name, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {name}
                          </Badge>
                        ))
                      ) : null;
                    })()}
                    {(() => {
                      const locationCount = employee.employee_locations?.length || 0;
                      return locationCount > 2 ? (
                        <Badge variant="outline" className="text-xs">
                          +{locationCount - 2}
                        </Badge>
                      ) : null;
                    })()}
                  </div>
                </div>
                <StatusBadge status={employee.status}>
                  {employee.status}
                </StatusBadge>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/employees/${employee.id}`)}
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewPassword(employee)}
                  title="View Password"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Key className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(employee.id)}
                  title="Edit Employee"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(employee.id)}
                  className="text-destructive hover:text-destructive"
                  title="Delete Employee"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredEmployees.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">No employees found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => {
        setDeleteId(null);
        setDeletionInfo(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              {deletionInfo ? (
                <>
                  Are you sure you want to delete <strong>{deletionInfo.employee?.fullName}</strong>?
                  <br /><br />
                  This will also permanently delete:
                  <ul className="mt-2 ml-4 list-disc">
                    <li><strong>{deletionInfo.documentCount}</strong> document(s)</li>
                    <li><strong>{deletionInfo.licenseCount}</strong> license(s)</li>
                  </ul>
                  <br />
                  This action cannot be undone.
                </>
              ) : (
                "Are you sure you want to delete this employee? This action cannot be undone."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Employee
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Modal */}
      <AlertDialog open={passwordModalOpen} onOpenChange={setPasswordModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Employee Login Credentials</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedEmployeePassword && (
                <div className="space-y-4 mt-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Employee Name</p>
                    <p className="text-base text-gray-900">{selectedEmployeePassword.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Email</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm">
                        {selectedEmployeePassword.email}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedEmployeePassword.email)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Password</p>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                        {selectedEmployeePassword.password}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(selectedEmployeePassword.password)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setPasswordModalOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Employee Form Modal */}
      <EmployeeFormModal
        open={isFormOpen}
        onClose={handleCloseForm}
        employeeId={editingEmployee}
      />
    </div>
  );
};

export default Employees;
