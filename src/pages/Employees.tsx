import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, Trash2, Copy, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
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
  const [locationFilter, setLocationFilter] = useState('all');
  const [ageRangeFilter, setAgeRangeFilter] = useState('all');
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deletionInfo, setDeletionInfo] = useState<{ employee?: any; documentCount: number; licenseCount: number } | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<string | null>(null);
  const [resetPasswordEmployee, setResetPasswordEmployee] = useState<{ id: string; email: string; fullName: string } | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');


  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
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

    // Location filter
    const matchesLocation = 
      locationFilter === 'all' || 
      employee.employee_locations?.some(el => el.location_id === locationFilter);

    // Age range filter (calculate age from hire date as proxy)
    const matchesAgeRange = () => {
      if (ageRangeFilter === 'all') return true;
      
      const today = new Date();
      const hireDate = new Date(employee.hireDate);
      const yearsWithCompany = Math.floor((today.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      
      switch (ageRangeFilter) {
        case '0-2': return yearsWithCompany >= 0 && yearsWithCompany <= 2;
        case '3-5': return yearsWithCompany >= 3 && yearsWithCompany <= 5;
        case '6-10': return yearsWithCompany >= 6 && yearsWithCompany <= 10;
        case '10+': return yearsWithCompany > 10;
        default: return true;
      }
    };

    return matchesSearch && matchesStatus && matchesLocation && matchesAgeRange();
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

  // Generate random password function
  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  const handleResetPassword = async (employee: { id: string; email: string; fullName: string }) => {
    try {
      // Generate new password
      const generatedPassword = generatePassword();

      // Get the auth user by email
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      
      if (listError) throw listError;

      const authUser = users.find(u => u.email === employee.email);
      if (!authUser) {
        toast.error('Auth user not found for this employee');
        return;
      }

      // Update the password using admin client
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        authUser.id,
        { password: generatedPassword }
      );

      if (updateError) throw updateError;

      // Show the new password to admin
      setNewPassword(generatedPassword);
      setResetPasswordEmployee(employee);
      toast.success('Password reset successfully!');
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Employees" />

      <div className="p-4 lg:p-6">
        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap gap-4">
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
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ageRangeFilter} onValueChange={setAgeRangeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Years Here" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="0-2">0-2 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
                <SelectItem value="6-10">6-10 years</SelectItem>
                <SelectItem value="10+">10+ years</SelectItem>
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
                  onClick={() => handleEdit(employee.id)}
                  title="Edit Employee"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleResetPassword({ id: employee.id, email: employee.email, fullName: employee.fullName })}
                  title="Reset Password"
                >
                  <Key className="h-4 w-4" />
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

      {/* Password Reset Dialog */}
      <AlertDialog open={!!resetPasswordEmployee} onOpenChange={() => {
        setResetPasswordEmployee(null);
        setNewPassword('');
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Password Reset Successful</AlertDialogTitle>
            <AlertDialogDescription>
              A new password has been generated for <strong>{resetPasswordEmployee?.fullName}</strong>.
              <br /><br />
              <div className="bg-muted p-4 rounded-md my-4">
                <div className="space-y-2">
                  <div>
                    <strong>Email:</strong> {resetPasswordEmployee?.email}
                  </div>
                  <div>
                    <strong>New Password:</strong> <code className="bg-background px-2 py-1 rounded">{newPassword}</code>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Please share these credentials securely with the employee. They will be prompted to change their password on first login.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                copyToClipboard(`Email: ${resetPasswordEmployee?.email}\nPassword: ${newPassword}`);
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Credentials
            </Button>
            <AlertDialogAction>Close</AlertDialogAction>
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
