import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Upload } from 'lucide-react';

const EmployeeDocuments = () => {
  // Sample documents for Sarah Johnson
  const documents = [
    {
      id: '1',
      name: 'Employment Contract',
      type: 'Contract',
      uploadDate: new Date('2022-03-15'),
      status: 'Approved' as const,
    },
    {
      id: '2',
      name: 'RN License Copy',
      type: 'License Copy',
      uploadDate: new Date('2023-01-15'),
      status: 'Approved' as const,
    },
    {
      id: '3',
      name: 'ID Copy',
      type: 'ID Copy',
      uploadDate: new Date('2022-06-01'),
      status: 'Approved' as const,
    },
  ];

  const getStatusBadge = (status: 'Approved' | 'Pending' | 'Rejected') => {
    const variants = {
      Approved: 'bg-green-100 text-green-800 hover:bg-green-100',
      Pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
      Rejected: 'bg-red-100 text-red-800 hover:bg-red-100',
    };

    return (
      <Badge className={variants[status]}>
        {status}
      </Badge>
    );
  };

  const handleUploadClick = () => {
    alert('Upload document functionality coming soon');
  };

  const handleDownload = (documentName: string) => {
    alert(`Downloading ${documentName}...`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your uploaded documents
          </p>
        </div>
        <Button 
          onClick={handleUploadClick}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Documents Table */}
      <div className="border border-[#E5E7EB] rounded-lg bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Document Name</TableHead>
              <TableHead className="font-semibold text-gray-900">Document Type</TableHead>
              <TableHead className="font-semibold text-gray-900">Upload Date</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              <TableHead className="font-semibold text-gray-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {doc.name}
                </TableCell>
                <TableCell className="text-gray-700">
                  {doc.type}
                </TableCell>
                <TableCell className="text-gray-700">
                  {doc.uploadDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>
                  {getStatusBadge(doc.status)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(doc.name)}
                    className="h-8"
                  >
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Download
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Document Count */}
      <div className="text-sm text-gray-500">
        Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default EmployeeDocuments;
