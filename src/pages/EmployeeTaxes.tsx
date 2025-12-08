import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, Download, Eye, Calendar, DollarSign, Info, ExternalLink } from 'lucide-react';

const EmployeeTaxes = () => {
  const taxDocuments = [
    {
      id: '1',
      type: 'W-2 Form',
      year: 2023,
      dateIssued: new Date('2024-01-31'),
      status: 'Available' as const,
    },
    {
      id: '2',
      type: 'W-2 Form',
      year: 2022,
      dateIssued: new Date('2023-01-31'),
      status: 'Available' as const,
    },
    {
      id: '3',
      type: '1099 Form',
      year: 2023,
      dateIssued: new Date('2024-02-15'),
      status: 'Available' as const,
    },
  ];

  const handleView = (docType: string, year: number) => {
    alert(`Viewing ${docType} for ${year}...`);
  };

  const handleDownload = (docType: string, year: number) => {
    alert(`Downloading ${docType} for ${year} as PDF...`);
  };

  const handleRequestW4Update = () => {
    alert('Please contact HR to update your W-4');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tax Documents</h1>
        <p className="text-sm text-gray-500 mt-1">
          Access your tax forms and withholding information
        </p>
      </div>

      {/* Available Tax Documents */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Available Tax Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">Document Type</TableHead>
                  <TableHead className="font-semibold">Tax Year</TableHead>
                  <TableHead className="font-semibold">Date Issued</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {taxDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {doc.type}
                      </div>
                    </TableCell>
                    <TableCell>{doc.year}</TableCell>
                    <TableCell>
                      {doc.dateIssued.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(doc.type, doc.year)}
                          className="h-8"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(doc.type, doc.year)}
                          className="h-8"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Download PDF
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Tax Withholding Information */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Tax Withholding Information</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRequestW4Update}
            >
              Request W-4 Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Federal Tax ID</p>
              <p className="text-base font-medium text-gray-900 mt-1">***-**-1234</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Filing Status</p>
              <p className="text-base font-medium text-gray-900 mt-1">Married Filing Jointly</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Allowances</p>
              <p className="text-base font-medium text-gray-900 mt-1">2</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Additional Withholding</p>
              <p className="text-base font-medium text-gray-900 mt-1">$0.00</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">State</p>
              <p className="text-base font-medium text-gray-900 mt-1">New York</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Last W-4 Update</p>
              <p className="text-base font-medium text-gray-900 mt-1">Jan 15, 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Year-to-Date Tax Summary */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-50">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Year-to-Date Tax Summary (2024)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Federal Tax Withheld</span>
              <span className="text-base font-semibold text-gray-900">$10,238.46</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">State Tax Withheld</span>
              <span className="text-base font-semibold text-gray-900">$3,412.56</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Social Security Withheld</span>
              <span className="text-base font-semibold text-gray-900">$4,231.50</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-gray-200">
              <span className="text-sm text-gray-600">Medicare Withheld</span>
              <span className="text-base font-semibold text-gray-900">$989.63</span>
            </div>
            <div className="flex justify-between items-center pt-2 bg-blue-50 p-3 rounded-lg">
              <span className="text-base font-semibold text-blue-900">Total Tax Withheld YTD</span>
              <span className="text-xl font-bold text-blue-900">$18,872.15</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-50">
              <Calendar className="h-4 w-4 text-purple-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Important Dates</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">W-2 Forms Available</p>
                <p className="text-sm text-gray-500">January 31, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Tax Filing Deadline</p>
                <p className="text-sm text-gray-500">April 15, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Estimated Tax Quarter Deadlines</p>
                <ul className="text-sm text-gray-500 mt-1 space-y-1">
                  <li>• Q1: April 15, 2025</li>
                  <li>• Q2: June 15, 2025</li>
                  <li>• Q3: September 15, 2025</li>
                  <li>• Q4: January 15, 2026</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Resources */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-50">
              <Info className="h-4 w-4 text-green-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Tax Resources</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <a 
              href="#" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={(e) => { e.preventDefault(); alert('Opening IRS Tax Withholding Estimator...'); }}
            >
              <ExternalLink className="h-4 w-4" />
              IRS Tax Withholding Estimator
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={(e) => { e.preventDefault(); alert('Opening Understanding Your W-2...'); }}
            >
              <ExternalLink className="h-4 w-4" />
              Understanding Your W-2
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={(e) => { e.preventDefault(); alert('Opening Tax Filing Deadlines & Extensions...'); }}
            >
              <ExternalLink className="h-4 w-4" />
              Tax Filing Deadlines & Extensions
            </a>
            <a 
              href="#" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={(e) => { e.preventDefault(); alert('Opening State Tax Information...'); }}
            >
              <ExternalLink className="h-4 w-4" />
              State Tax Information
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Information Notice */}
      <Alert className="bg-blue-50 border-blue-200">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          Tax documents are available by January 31st each year. For questions about withholdings or to update your W-4, please contact HR.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmployeeTaxes;
