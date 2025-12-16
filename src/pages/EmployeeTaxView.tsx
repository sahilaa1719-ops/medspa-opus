import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText, Receipt } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const EmployeeTaxView = () => {
  const { user } = useAuth();
  const [taxDocuments, setTaxDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  useEffect(() => {
    fetchTaxDocuments();
  }, [user?.email]);

  const fetchTaxDocuments = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);

      // Fetch employee data by email
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('id')
        .eq('email', user.email)
        .single();

      if (employeeError) {
        console.error('Error fetching employee:', employeeError);
        return;
      }

      if (employeeData) {
        // Fetch tax documents for this employee
        const { data: taxDocsData, error: taxDocsError } = await supabase
          .from('tax_documents')
          .select('*')
          .eq('employee_id', employeeData.id)
          .order('tax_year', { ascending: false });

        if (taxDocsError) {
          console.error('Error fetching tax documents:', taxDocsError);
          return;
        }

        setTaxDocuments(taxDocsData || []);

        // Extract unique years for filter
        const years = [...new Set((taxDocsData || []).map((doc: any) => doc.tax_year))];
        setAvailableYears(years.sort((a, b) => b - a));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (fileUrl: string) => {
    if (!fileUrl) {
      toast.error('No file available for download');
      return;
    }
    window.open(fileUrl, '_blank');
  };

  const filteredDocuments = selectedYear === 'all' 
    ? taxDocuments 
    : taxDocuments.filter(doc => doc.tax_year.toString() === selectedYear);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-50">
          <Receipt className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Documents</h1>
          <p className="text-sm text-gray-500">
            View and download your tax documents
          </p>
        </div>
      </div>

      {/* Filter */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Filter Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-xs">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tax Year
              </label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Your Tax Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading tax documents...
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tax documents found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Tax Year</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-500" />
                          {doc.document_name}
                        </div>
                      </TableCell>
                      <TableCell>{doc.tax_year}</TableCell>
                      <TableCell>
                        {doc.uploaded_at 
                          ? new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc.file_url)}
                          disabled={!doc.file_url}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Count */}
      {!isLoading && filteredDocuments.length > 0 && (
        <div className="text-sm text-gray-500">
          Showing {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export default EmployeeTaxView;
