import { format } from 'date-fns';
import { Award, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { useData } from '@/context/DataContext';
import { useLicenseStatus } from '@/hooks/useLicenseStatus';
import { useState, useMemo } from 'react';
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
import { toast } from 'sonner';

const Licenses = () => {
  const { licenses, employees, locations, deleteLicense } = useData();
  const { getLicenseStatus, getExpirationText } = useLicenseStatus();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const getEmployeeById = (id: string) => employees.find((e) => e.id === id);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteLicense(deleteId);
      toast.success('License deleted successfully');
      setDeleteId(null);
    }
  };

  // Filter and sort licenses
  const filteredAndSortedLicenses = useMemo(() => {
    let filtered = licenses.filter((license) => {
      const employee = getEmployeeById(license.employeeId);
      const status = getLicenseStatus(new Date(license.expiryDate));
      
      const matchesSearch = searchQuery === '' || 
        license.licenseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        license.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      
      const matchesEmployee = selectedEmployee === 'all' || license.employeeId === selectedEmployee;
      const matchesStatus = selectedStatus === 'all' || status === selectedStatus;
      
      // Location filter - check if employee is assigned to selected location
      const matchesLocation = selectedLocation === 'all' || 
        (employee && employee.employee_locations?.some(el => el.location_id === selectedLocation));
      
      return matchesSearch && matchesEmployee && matchesStatus && matchesLocation;
    });

    // Sort by expiry date
    return filtered.sort((a, b) => {
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    });
  }, [licenses, searchQuery, selectedEmployee, selectedStatus, selectedLocation, employees, getLicenseStatus]);

  // Get unique license types for potential future filtering
  const licenseTypes = useMemo(() => {
    const types = new Set(licenses.map(license => license.licenseType));
    return Array.from(types).sort();
  }, [licenses]);

  return (
    <div className="min-h-screen">
      <Header title="Licenses" />

      <div className="p-4 lg:p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search licenses, employees, or license numbers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="valid">Valid</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by location" />
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
          </div>
        </div>

        {filteredAndSortedLicenses.length === 0 ? (
          licenses.length === 0 ? (
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
            <Award className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No licenses added yet</p>
          </div>
          ) : (
            <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
              <Award className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No licenses match your search criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedEmployee('all');
                  setSelectedStatus('all');
                  setSelectedLocation('all');
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )
        ) : (
          <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-[#F9FAFB]">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    License
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#374151]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedLicenses.map((license) => {
                  const employee = getEmployeeById(license.employeeId);
                  const status = getLicenseStatus(new Date(license.expiryDate));

                  return (
                    <tr key={license.id} className="border-b border-[#E5E7EB] last:border-0 bg-white hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <Award className="h-5 w-5 text-[#6B7280]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#374151]">
                              {license.licenseType}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              #{license.licenseNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#374151]">
                        {employee?.fullName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-[#374151]">
                        {format(new Date(license.issueDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-[#374151]">
                        {format(new Date(license.expiryDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={status}>
                          {getExpirationText(new Date(license.expiryDate))}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(license.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete License</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this license? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Licenses;
