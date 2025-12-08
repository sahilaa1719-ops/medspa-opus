import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { 
  Upload, 
  Download, 
  Mail, 
  FileText, 
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  FileDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface W2Employee {
  id: string;
  name: string;
  photo: string;
  position: string;
  ssn: string;
  ytdGross: number;
  ytdFederal: number;
  ytdState: number;
  ytdSsMedicare: number;
  w2Status: 'Generated' | 'Pending' | 'Not Started';
}

interface Contractor {
  id: string;
  name: string;
  serviceType: string;
  totalPaid: number;
  taxWithheld: number;
  status: 'Generated' | 'Pending' | 'Not Started';
}

const PayrollTaxes = () => {
  const { toast } = useToast();
  const [taxYear, setTaxYear] = useState('2024');
  const [activeTab, setActiveTab] = useState('w2');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  const [w2Employees] = useState<W2Employee[]>([
    {
      id: 'EMP-001',
      name: 'Sarah Johnson',
      photo: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=F3F4F6&color=374151',
      position: 'RN',
      ssn: '***-**-5678',
      ytdGross: 68250,
      ytdFederal: 10238,
      ytdState: 3413,
      ytdSsMedicare: 5221,
      w2Status: 'Generated',
    },
    {
      id: 'EMP-002',
      name: 'Michael Chen',
      photo: 'https://ui-avatars.com/api/?name=Michael+Chen&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      ssn: '***-**-9012',
      ytdGross: 58240,
      ytdFederal: 8736,
      ytdState: 2912,
      ytdSsMedicare: 4455,
      w2Status: 'Generated',
    },
    {
      id: 'EMP-003',
      name: 'Emily Rodriguez',
      photo: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F3F4F6&color=374151',
      position: 'LPN',
      ssn: '***-**-3456',
      ytdGross: 55120,
      ytdFederal: 8268,
      ytdState: 2756,
      ytdSsMedicare: 4216,
      w2Status: 'Pending',
    },
    {
      id: 'EMP-004',
      name: 'David Kim',
      photo: 'https://ui-avatars.com/api/?name=David+Kim&background=F3F4F6&color=374151',
      position: 'Medical Director',
      ssn: '***-**-7890',
      ytdGross: 100000,
      ytdFederal: 18500,
      ytdState: 6500,
      ytdSsMedicare: 7650,
      w2Status: 'Generated',
    },
    {
      id: 'EMP-005',
      name: 'Lisa Anderson',
      photo: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=F3F4F6&color=374151',
      position: 'Manager',
      ssn: '***-**-2345',
      ytdGross: 65000,
      ytdFederal: 9750,
      ytdState: 3250,
      ytdSsMedicare: 4973,
      w2Status: 'Generated',
    },
    {
      id: 'EMP-006',
      name: 'Robert Taylor',
      photo: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=F3F4F6&color=374151',
      position: 'Laser Tech',
      ssn: '***-**-6789',
      ytdGross: 62400,
      ytdFederal: 9360,
      ytdState: 3120,
      ytdSsMedicare: 4774,
      w2Status: 'Generated',
    },
    {
      id: 'EMP-007',
      name: 'Jessica Martinez',
      photo: 'https://ui-avatars.com/api/?name=Jessica+Martinez&background=F3F4F6&color=374151',
      position: 'Front Desk',
      ssn: '***-**-4567',
      ytdGross: 37440,
      ytdFederal: 5616,
      ytdState: 1872,
      ytdSsMedicare: 2864,
      w2Status: 'Not Started',
    },
    {
      id: 'EMP-008',
      name: 'Amanda White',
      photo: 'https://ui-avatars.com/api/?name=Amanda+White&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      ssn: '***-**-8901',
      ytdGross: 58240,
      ytdFederal: 8736,
      ytdState: 2912,
      ytdSsMedicare: 4455,
      w2Status: 'Not Started',
    },
  ]);

  const [contractors] = useState<Contractor[]>([
    {
      id: 'CON-001',
      name: 'ABC Cleaning Services',
      serviceType: 'Janitorial',
      totalPaid: 12000,
      taxWithheld: 0,
      status: 'Generated',
    },
    {
      id: 'CON-002',
      name: 'John Doe Consulting',
      serviceType: 'IT Services',
      totalPaid: 15000,
      taxWithheld: 0,
      status: 'Generated',
    },
    {
      id: 'CON-003',
      name: 'Marketing Pro Agency',
      serviceType: 'Marketing',
      totalPaid: 8500,
      taxWithheld: 0,
      status: 'Pending',
    },
  ]);

  const w2Generated = w2Employees.filter(e => e.w2Status === 'Generated').length;
  const w2Missing = w2Employees.filter(e => e.w2Status === 'Not Started');
  const totalW2 = w2Employees.length;
  
  const totalFederalWithheld = w2Employees.reduce((sum, e) => sum + e.ytdFederal, 0);
  const totalStateWithheld = w2Employees.reduce((sum, e) => sum + e.ytdState, 0);
  const totalSsMedicare = w2Employees.reduce((sum, e) => sum + e.ytdSsMedicare, 0);
  const totalWithheld = totalFederalWithheld + totalStateWithheld + totalSsMedicare;

  const daysUntilDeadline = 54;

  const quarterlyData = [
    { quarter: 'Q1 2024', federal: 62162.50, state: 20720.83, ss: 30712.50, medicare: 7182.50 },
    { quarter: 'Q2 2024', federal: 62162.50, state: 20720.83, ss: 30712.50, medicare: 7182.50 },
    { quarter: 'Q3 2024', federal: 62162.50, state: 20720.83, ss: 30712.50, medicare: 7182.50 },
    { quarter: 'Q4 2024', federal: 62162.50, state: 20720.84, ss: 30712.50, medicare: 7182.50 },
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      'Generated': 'bg-[#27AE60] text-white hover:bg-[#27AE60]',
      'Pending': 'bg-[#F39C12] text-white hover:bg-[#F39C12]',
      'Not Started': 'bg-gray-300 text-gray-700 hover:bg-gray-300',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const handleGenerateW2 = (employeeId: string) => {
    toast({
      title: 'W-2 Generated',
      description: 'W-2 form generated successfully',
    });
  };

  const handleDownloadW2 = (employeeName: string) => {
    toast({
      title: 'Downloading',
      description: `Downloading W-2 for ${employeeName}...`,
    });
  };

  const handleEmailW2 = (employeeName: string) => {
    toast({
      title: 'Email Sent',
      description: `W-2 sent to ${employeeName}`,
    });
  };

  const handleGenerateAllW2s = () => {
    toast({
      title: 'Generating W-2s',
      description: `Generating W-2 forms for all ${totalW2} employees...`,
    });
  };

  const handleEmailAllW2s = () => {
    toast({
      title: 'Sending Emails',
      description: `Sending W-2 forms to all ${w2Generated} employees...`,
    });
  };

  const handleDownloadAllW2s = () => {
    toast({
      title: 'Downloading',
      description: 'Preparing ZIP file with all W-2 forms...',
    });
  };

  const handleUploadW2 = () => {
    if (!selectedEmployee || !uploadFile) {
      toast({
        title: 'Missing Information',
        description: 'Please select an employee and upload a file',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Uploaded',
      description: 'W-2 form uploaded successfully',
    });
    setUploadModalOpen(false);
    setSelectedEmployee('');
    setUploadFile(null);
  };

  const handleGenerateMissingW2s = () => {
    toast({
      title: 'Generating Missing W-2s',
      description: `Generating ${w2Missing.length} missing W-2 forms...`,
    });
  };

  const handleAddContractor = () => {
    toast({
      title: 'Add Contractor',
      description: 'Contractor form coming soon',
    });
  };

  const handleExportTaxReport = () => {
    toast({
      title: 'Exporting',
      description: 'Downloading tax report...',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Documents</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage W-2s, 1099s, and tax compliance for all employees
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={taxYear} onValueChange={setTaxYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            onClick={() => setUploadModalOpen(true)}
            className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Tax Documents
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              W-2 Forms Generated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {w2Generated} <span className="text-xl text-gray-400">/ {totalW2}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  {w2Missing.length > 0 ? (
                    <>
                      <Badge className="bg-[#F39C12] text-white hover:bg-[#F39C12] text-xs">
                        {w2Missing.length} missing
                      </Badge>
                    </>
                  ) : (
                    <span className="text-[#27AE60]">All complete</span>
                  )}
                </p>
              </div>
              <FileText className="h-10 w-10 text-[#3498DB] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              1099 Forms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{contractors.length}</p>
                <p className="text-sm text-gray-500 mt-1">For contractors</p>
              </div>
              <FileText className="h-10 w-10 text-[#9B59B6] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Tax Withheld
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  ${totalWithheld.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">Federal + State YTD</p>
              </div>
              <FileDown className="h-10 w-10 text-[#27AE60] opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Filing Deadline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">Jan 31, 2025</p>
                <p className="text-sm text-[#F39C12] mt-1 font-semibold">
                  {daysUntilDeadline} days remaining
                </p>
              </div>
              <Clock className="h-10 w-10 text-[#F39C12] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="w2">W-2 Forms</TabsTrigger>
          <TabsTrigger value="1099">1099 Forms</TabsTrigger>
          <TabsTrigger value="summary">Tax Summary</TabsTrigger>
        </TabsList>

        {/* TAB 1: W-2 FORMS */}
        <TabsContent value="w2" className="space-y-4">
          {/* Missing W-2 Alert */}
          {w2Missing.length > 0 && (
            <Alert className="border-[#E74C3C] bg-red-50">
              <AlertCircle className="h-4 w-4 text-[#E74C3C]" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-[#E74C3C] font-medium">
                  {w2Missing.length} employees missing W-2 forms: {w2Missing.map(e => e.name).join(', ')}
                </span>
                <Button 
                  size="sm"
                  onClick={handleGenerateMissingW2s}
                  className="bg-[#E74C3C] hover:bg-[#C0392B] text-white"
                >
                  Generate Missing W-2s
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Bulk Actions */}
          <div className="flex items-center gap-3">
            <Button onClick={handleGenerateAllW2s} className="bg-[#3498DB] hover:bg-[#2980B9] text-white">
              <FileText className="h-4 w-4 mr-2" />
              Generate All W-2s
            </Button>
            <Button variant="outline" onClick={handleEmailAllW2s}>
              <Mail className="h-4 w-4 mr-2" />
              Email All W-2s
            </Button>
            <Button variant="outline" onClick={handleDownloadAllW2s}>
              <Download className="h-4 w-4 mr-2" />
              Download All as ZIP
            </Button>
            <Button variant="outline" onClick={() => setUploadModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Bulk W-2s
            </Button>
          </div>

          {/* W-2 Table */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">Employee Name</TableHead>
                      <TableHead className="font-semibold">Position</TableHead>
                      <TableHead className="font-semibold">SSN</TableHead>
                      <TableHead className="font-semibold">YTD Gross Pay</TableHead>
                      <TableHead className="font-semibold">YTD Federal Tax</TableHead>
                      <TableHead className="font-semibold">YTD State Tax</TableHead>
                      <TableHead className="font-semibold">YTD SS + Medicare</TableHead>
                      <TableHead className="font-semibold">W-2 Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {w2Employees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.photo} alt={employee.name} />
                              <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                                {employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{employee.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">{employee.position}</TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">{employee.ssn}</TableCell>
                        <TableCell className="font-medium">${employee.ytdGross.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-600">${employee.ytdFederal.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-600">${employee.ytdState.toLocaleString()}</TableCell>
                        <TableCell className="text-gray-600">${employee.ytdSsMedicare.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(employee.w2Status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {employee.w2Status === 'Generated' ? (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadW2(employee.name)}
                                  className="h-8 px-2"
                                >
                                  <Download className="h-4 w-4 text-[#3498DB]" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEmailW2(employee.name)}
                                  className="h-8 px-2"
                                >
                                  <Mail className="h-4 w-4 text-[#F39C12]" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleGenerateW2(employee.id)}
                                className="bg-[#3498DB] hover:bg-[#2980B9] text-white h-8"
                              >
                                Generate
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: 1099 FORMS */}
        <TabsContent value="1099" className="space-y-4">
          {/* Add Contractor Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Manage 1099 forms for independent contractors and service providers
            </p>
            <Button onClick={handleAddContractor} className="bg-[#9B59B6] hover:bg-[#8E44AD] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Contractor
            </Button>
          </div>

          {/* 1099 Table */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Contractor Name</TableHead>
                    <TableHead className="font-semibold">Service Type</TableHead>
                    <TableHead className="font-semibold">Total Paid (2024)</TableHead>
                    <TableHead className="font-semibold">Tax Withheld</TableHead>
                    <TableHead className="font-semibold">1099 Status</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contractors.map((contractor) => (
                    <TableRow key={contractor.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{contractor.name}</TableCell>
                      <TableCell className="text-gray-600">{contractor.serviceType}</TableCell>
                      <TableCell className="font-medium">${contractor.totalPaid.toLocaleString()}</TableCell>
                      <TableCell className="text-gray-600">${contractor.taxWithheld.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(contractor.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {contractor.status === 'Generated' ? (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDownloadW2(contractor.name)}
                                className="h-8 px-2"
                              >
                                <Download className="h-4 w-4 text-[#3498DB]" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEmailW2(contractor.name)}
                                className="h-8 px-2"
                              >
                                <Mail className="h-4 w-4 text-[#F39C12]" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => handleGenerateW2(contractor.id)}
                              className="bg-[#9B59B6] hover:bg-[#8E44AD] text-white h-8"
                            >
                              Generate
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: TAX SUMMARY */}
        <TabsContent value="summary" className="space-y-6">
          {/* YTD Summary Cards */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">YTD Tax Withholding Report</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="border-2 border-[#3498DB] bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Federal Tax
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#3498DB]">
                    ${totalFederalWithheld.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#9B59B6] bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total State Tax
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#9B59B6]">
                    ${totalStateWithheld.toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#F39C12] bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Social Security
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#F39C12]">
                    ${(totalSsMedicare * 0.857).toFixed(0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#E74C3C] bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Medicare
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#E74C3C]">
                    ${(totalSsMedicare * 0.143).toFixed(0).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-[#27AE60] bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    Total Withheld
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-[#27AE60]">
                    ${totalWithheld.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Employee Type Breakdown */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">By Employee Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#3498DB] bg-opacity-10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#3498DB]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">W-2 Employees</p>
                    <p className="text-sm text-gray-600">{totalW2} employees</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">${totalWithheld.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#9B59B6] bg-opacity-10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-[#9B59B6]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">1099 Contractors</p>
                    <p className="text-sm text-gray-600">{contractors.length} contractors</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">$0</p>
              </div>
            </CardContent>
          </Card>

          {/* Quarterly Breakdown */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Quarterly Breakdown</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportTaxReport}>
                <FileDown className="h-4 w-4 mr-2" />
                Export Tax Report
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Quarter</TableHead>
                    <TableHead className="font-semibold">Federal</TableHead>
                    <TableHead className="font-semibold">State</TableHead>
                    <TableHead className="font-semibold">Social Security</TableHead>
                    <TableHead className="font-semibold">Medicare</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quarterlyData.map((quarter) => (
                    <TableRow key={quarter.quarter} className="hover:bg-gray-50">
                      <TableCell className="font-semibold">{quarter.quarter}</TableCell>
                      <TableCell className="font-medium">${quarter.federal.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${quarter.state.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${quarter.ss.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">${quarter.medicare.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Compliance Checklist */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Compliance Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                <span className="text-gray-700">All W-2 forms generated</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                <span className="text-gray-700">All 1099 forms generated</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-[#F39C12]" />
                <span className="text-gray-700">W-2 distribution pending (Due: Jan 31, 2025)</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-[#F39C12]" />
                <span className="text-gray-700">IRS filing pending (Due: Jan 31, 2025)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-[#27AE60]" />
                <span className="text-gray-700">State tax filing up to date</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload W-2 Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload W-2 Form</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Select Employee</label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {w2Employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tax Year</label>
              <Input value={taxYear} disabled className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Upload PDF File</label>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUploadW2}
              className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollTaxes;
