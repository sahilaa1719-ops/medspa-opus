import { format } from 'date-fns';
import { FileText, Download, Trash2, Search, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/context/DataContext';
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

const Documents = () => {
  const { documents, employees, deleteDocument } = useData();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<string>('all');
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('all');

  const getEmployeeById = (id: string) => employees.find((e) => e.id === id);

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const employee = getEmployeeById(doc.employeeId);
      const matchesSearch = searchQuery === '' || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      
      const matchesEmployee = selectedEmployee === 'all' || doc.employeeId === selectedEmployee;
      const matchesDocType = selectedDocumentType === 'all' || doc.documentType === selectedDocumentType;
      
      return matchesSearch && matchesEmployee && matchesDocType;
    });
  }, [documents, searchQuery, selectedEmployee, selectedDocumentType, employees]);

  // Get unique document types for filter
  const documentTypes = useMemo(() => {
    const types = new Set(documents.map(doc => doc.documentType));
    return Array.from(types).sort();
  }, [documents]);

  const handleDelete = () => {
    if (deleteId) {
      deleteDocument(deleteId);
      toast.success('Document deleted successfully');
      setDeleteId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="Documents" />

      <div className="p-4 lg:p-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4 sm:flex sm:items-center sm:gap-4 sm:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search documents, employees, or files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
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

          <Select value={selectedDocumentType} onValueChange={setSelectedDocumentType}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {documentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {filteredDocuments.length === 0 ? (
          documents.length === 0 ? (
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No documents uploaded yet</p>
          </div>
          ) : (
            <div className="rounded-lg border border-[#E5E7EB] bg-white p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">No documents match your search criteria</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedEmployee('all');
                  setSelectedDocumentType('all');
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )
        ) : (
          <div className="rounded-lg border border-[#E5E7EB] bg-white shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-[#F9FAFB]">
                <tr className="border-b border-[#E5E7EB]">
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Document
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-[#374151]">
                    Uploaded
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-[#374151]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((doc) => {
                  const employee = getEmployeeById(doc.employeeId);
                  return (
                    <tr key={doc.id} className="border-b border-[#E5E7EB] last:border-0 bg-white hover:bg-[#F9FAFB] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <FileText className="h-5 w-5 text-[#6B7280]" />
                          </div>
                          <div>
                            <p className="font-medium text-[#374151]">{doc.title}</p>
                            <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#374151]">
                        {employee?.fullName || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 text-[#374151]">{doc.documentType}</td>
                      <td className="px-6 py-4 text-[#374151]">
                        {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(doc.id)}
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
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
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

export default Documents;
