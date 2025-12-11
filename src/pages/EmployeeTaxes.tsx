import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Download, Trash2, FileText } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EmployeeTaxes = () => {
  const [employees, setEmployees] = useState<any[]>([]);
  const [taxDocuments, setTaxDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Upload form state
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [taxYear, setTaxYear] = useState(new Date().getFullYear().toString());
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchTaxDocuments();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, full_name, email')
        .order('full_name');
      
      if (error) {
        console.error('Supabase error fetching employees:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        alert(`Failed to load employees: ${error.message}`);
        throw error;
      }
      
      console.log('Fetched employees:', data);
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchTaxDocuments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tax_documents')
        .select(`
          *,
          employees:employee_id (
            full_name,
            email
          )
        `)
        .order('uploaded_at', { ascending: false });
      
      if (error) {
        console.error('Supabase error fetching tax documents:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
      }
      setTaxDocuments(data || []);
    } catch (error) {
      console.error('Error fetching tax documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedEmployee || !documentName || !taxYear || !file) {
      alert('Please fill all fields and select a file');
      return;
    }

    try {
      setUploading(true);

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedEmployee}-${taxYear}-${Date.now()}.${fileExt}`;
      const filePath = `tax-documents/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('employee-files')
        .getPublicUrl(filePath);

      // Insert record
      const { error: insertError } = await supabase
        .from('tax_documents')
        .insert([{
          employee_id: selectedEmployee,
          document_name: documentName,
          tax_year: parseInt(taxYear),
          file_url: publicUrl,
          file_size: file.size,
          uploaded_by: 'admin'
        }]);

      if (insertError) throw insertError;

      alert('Tax document uploaded successfully!');
      
      // Reset form
      setSelectedEmployee('');
      setDocumentName('');
      setTaxYear(new Date().getFullYear().toString());
      setFile(null);
      
      // Refresh list
      fetchTaxDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload tax document');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this tax document?')) return;

    try {
      const { error } = await supabase
        .from('tax_documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      alert('Tax document deleted successfully');
      fetchTaxDocuments();
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete tax document');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tax Documents</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage employee tax documents</p>
      </div>

      {/* Upload Form */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Upload Tax Document</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Employee *</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose employee..." />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.full_name} ({emp.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Document Name *</Label>
              <Input
                placeholder="e.g., W-2 Form, 1099 Form"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Tax Year *</Label>
              <Input
                type="number"
                placeholder="2024"
                value={taxYear}
                onChange={(e) => setTaxYear(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Upload File *</Label>
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="mt-4">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Documents */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Uploaded Tax Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Employee</TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Tax Year</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-500">
                        No tax documents uploaded yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    taxDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell>
                          {doc.employees?.full_name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            {doc.document_name}
                          </div>
                        </TableCell>
                        <TableCell>{doc.tax_year}</TableCell>
                        <TableCell>
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(doc.file_url)}
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(doc.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeTaxes;
