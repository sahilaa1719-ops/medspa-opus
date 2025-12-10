import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, Pencil, Trash2, Plus } from 'lucide-react';
import { format, differenceInYears, differenceInMonths } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useLicenseStatus } from '@/hooks/useLicenseStatus';
import { toast } from 'sonner';
import { EmployeeFormModal } from '@/components/employees/EmployeeFormModal';
import { LicenseFormModal } from '@/components/licenses/LicenseFormModal';
import { DocumentFormModal } from '@/components/documents/DocumentFormModal';

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, locations, licenses, documents, deleteEmployee, deleteLicense, deleteDocument } = useData();
  const { getLicenseStatus, getExpirationText } = useLicenseStatus();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLicenseId, setDeleteLicenseId] = useState<string | null>(null);
  const [deleteDocumentId, setDeleteDocumentId] = useState<string | null>(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isLicenseFormOpen, setIsLicenseFormOpen] = useState(false);
  const [editingLicenseId, setEditingLicenseId] = useState<string | null>(null);
  const [isDocumentFormOpen, setIsDocumentFormOpen] = useState(false);

  const employee = employees.find((e) => e.id === id);
  const employeeLicenses = licenses.filter((l) => l.employeeId === id);
  const employeeDocuments = documents.filter((d) => d.employeeId === id);

  if (!employee) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Employee not found</p>
      </div>
    );
  }

  const getLocationById = (locId: string) => locations.find((l) => l.id === locId);

  const getTenure = () => {
    const hireDate = new Date(employee.hireDate);
    const years = differenceInYears(new Date(), hireDate);
    const months = differenceInMonths(new Date(), hireDate) % 12;
    
    if (years === 0) return `${months} months`;
    if (months === 0) return `${years} years`;
    return `${years} years, ${months} months`;
  };

  const handleDeleteEmployee = async () => {
    await deleteEmployee(employee.id);
    toast.success('Employee deleted successfully');
    navigate('/employees');
  };

  const handleDeleteLicense = async () => {
    if (deleteLicenseId) {
      await deleteLicense(deleteLicenseId);
      toast.success('License deleted successfully');
      setDeleteLicenseId(null);
    }
  };

  const handleDeleteDocument = async () => {
    if (deleteDocumentId) {
      await deleteDocument(deleteDocumentId);
      toast.success('Document deleted successfully');
      setDeleteDocumentId(null);
    }
  };

  const handleEditLicense = (licenseId: string) => {
    setEditingLicenseId(licenseId);
    setIsLicenseFormOpen(true);
  };

  const handleCloseLicenseForm = () => {
    setIsLicenseFormOpen(false);
    setEditingLicenseId(null);
  };

  return (
    <div className="min-h-screen">
      <Header title="Employee Details" />

      <div className="p-4 lg:p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/employees')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Employees
        </Button>

        {/* Employee Header */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={employee.photoUrl} alt={employee.fullName} />
                <AvatarFallback className="bg-gray-100 text-gray-700 text-2xl">
                  {employee.fullName.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-card-foreground">
                    {employee.fullName}
                  </h2>
                  <StatusBadge status={employee.status}>{employee.status}</StatusBadge>
                </div>
                <p className="mt-1 text-lg text-muted-foreground">{employee.position}</p>
                
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {employee.email}
                  </div>
                  {employee.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {employee.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Hired {format(new Date(employee.hireDate), 'MMM d, yyyy')} ({getTenure()})
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {employee.locationIds.map((locId) => {
                    const location = getLocationById(locId);
                    return (
                      <Badge key={locId} variant="secondary">
                        {location?.name || 'Unknown'}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditFormOpen(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents ({employeeDocuments.length})</TabsTrigger>
            <TabsTrigger value="licenses">Licenses ({employeeLicenses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
              <h3 className="mb-4 font-semibold text-card-foreground">Emergency Contact</h3>
              {employee.emergencyContactName ? (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium text-card-foreground">
                      {employee.emergencyContactName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium text-card-foreground">
                      {employee.emergencyContactPhone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Relationship</p>
                    <p className="font-medium text-card-foreground">
                      {employee.emergencyContactRelationship || 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No emergency contact information</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button onClick={() => setIsDocumentFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
            
            {employeeDocuments.length === 0 ? (
              <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
                <p className="text-muted-foreground">No documents uploaded</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {employeeDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm"
                  >
                    <div>
                      <p className="font-medium text-card-foreground">{doc.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {doc.documentType} • {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteDocumentId(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="licenses" className="mt-6">
            <div className="mb-4 flex justify-end">
              <Button onClick={() => setIsLicenseFormOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add License
              </Button>
            </div>

            {employeeLicenses.length === 0 ? (
              <div className="rounded-xl border border-border bg-card p-12 text-center">
                <p className="text-muted-foreground">No licenses added</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {employeeLicenses.map((license) => {
                  const status = getLicenseStatus(new Date(license.expiryDate));
                  return (
                    <div
                      key={license.id}
                      className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-card-foreground">
                            {license.licenseType}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            #{license.licenseNumber}
                          </p>
                        </div>
                        <StatusBadge status={status}>
                          {getExpirationText(new Date(license.expiryDate))}
                        </StatusBadge>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Issue Date</p>
                          <p className="font-medium text-card-foreground">
                            {format(new Date(license.issueDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expiry Date</p>
                          <p className="font-medium text-card-foreground">
                            {format(new Date(license.expiryDate), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditLicense(license.id)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteLicenseId(license.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Employee Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employee</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {employee.fullName}? This will also delete all their documents and licenses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete License Dialog */}
      <AlertDialog open={!!deleteLicenseId} onOpenChange={() => setDeleteLicenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete License</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this license? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLicense} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Document Dialog */}
      <AlertDialog open={!!deleteDocumentId} onOpenChange={() => setDeleteDocumentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Employee Modal */}
      <EmployeeFormModal
        open={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        employeeId={employee.id}
      />

      {/* License Form Modal */}
      <LicenseFormModal
        open={isLicenseFormOpen}
        onClose={handleCloseLicenseForm}
        employeeId={employee.id}
        licenseId={editingLicenseId}
      />

      {/* Document Form Modal */}
      <DocumentFormModal
        open={isDocumentFormOpen}
        onClose={() => setIsDocumentFormOpen(false)}
        employeeId={employee.id}
      />
    </div>
  );
};

export default EmployeeDetail;
