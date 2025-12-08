import { format } from 'date-fns';
import { Award, Pencil, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useData } from '@/context/DataContext';
import { useLicenseStatus } from '@/hooks/useLicenseStatus';
import { useState } from 'react';
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
  const { licenses, employees, deleteLicense } = useData();
  const { getLicenseStatus, getExpirationText } = useLicenseStatus();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const getEmployeeById = (id: string) => employees.find((e) => e.id === id);

  const handleDelete = () => {
    if (deleteId) {
      deleteLicense(deleteId);
      toast.success('License deleted successfully');
      setDeleteId(null);
    }
  };

  const sortedLicenses = [...licenses].sort((a, b) => {
    return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
  });

  return (
    <div className="min-h-screen">
      <Header title="Licenses" />

      <div className="p-6">
        {licenses.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <Award className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No licenses added yet</p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    License
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Issue Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Expiry Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedLicenses.map((license) => {
                  const employee = getEmployeeById(license.employeeId);
                  const status = getLicenseStatus(new Date(license.expiryDate));

                  return (
                    <tr key={license.id} className="border-b border-border last:border-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10">
                            <Award className="h-5 w-5 text-secondary" />
                          </div>
                          <div>
                            <p className="font-medium text-card-foreground">
                              {license.licenseType}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              #{license.licenseNumber}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-card-foreground">
                        {employee?.fullName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {format(new Date(license.issueDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
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
