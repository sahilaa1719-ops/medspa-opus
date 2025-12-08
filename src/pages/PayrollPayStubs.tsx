import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
} from '@/components/ui/dialog';
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
import { 
  Search, 
  Eye, 
  Download, 
  Mail, 
  Trash2, 
  Plus,
  FileDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PayStub {
  id: string;
  payPeriod: string;
  employeeName: string;
  employeePhoto: string;
  position: string;
  payDate: string;
  grossPay: number;
  deductions: number;
  netPay: number;
  status: 'Generated' | 'Sent' | 'Paid';
  employeeId: string;
  regularHours?: number;
  overtimeHours?: number;
  hourlyRate?: number;
}

const PayrollPayStubs = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('current');
  const [statusFilter, setStatusFilter] = useState('all');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [viewingPayStub, setViewingPayStub] = useState<PayStub | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [deletePayStubId, setDeletePayStubId] = useState<string | null>(null);

  const [payStubs] = useState<PayStub[]>([
    {
      id: '1',
      payPeriod: 'Nov 16-30, 2024',
      employeeName: 'Sarah Johnson',
      employeePhoto: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=F3F4F6&color=374151',
      position: 'RN',
      payDate: 'Dec 5, 2024',
      grossPay: 2843.75,
      deductions: -936.29,
      netPay: 1907.46,
      status: 'Sent',
      employeeId: 'EMP-001',
      regularHours: 80,
      overtimeHours: 5,
      hourlyRate: 32.50,
    },
    {
      id: '2',
      payPeriod: 'Nov 16-30, 2024',
      employeeName: 'Emily Rodriguez',
      employeePhoto: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F3F4F6&color=374151',
      position: 'LPN',
      payDate: 'Dec 5, 2024',
      grossPay: 2120.00,
      deductions: -698.00,
      netPay: 1422.00,
      status: 'Sent',
      employeeId: 'EMP-002',
      regularHours: 80,
      overtimeHours: 0,
      hourlyRate: 26.50,
    },
    {
      id: '3',
      payPeriod: 'Nov 16-30, 2024',
      employeeName: 'David Kim',
      employeePhoto: 'https://ui-avatars.com/api/?name=David+Kim&background=F3F4F6&color=374151',
      position: 'Medical Director',
      payDate: 'Dec 5, 2024',
      grossPay: 8333.33,
      deductions: -2745.50,
      netPay: 5587.83,
      status: 'Paid',
      employeeId: 'EMP-003',
    },
    {
      id: '4',
      payPeriod: 'Nov 1-15, 2024',
      employeeName: 'Sarah Johnson',
      employeePhoto: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=F3F4F6&color=374151',
      position: 'RN',
      payDate: 'Nov 20, 2024',
      grossPay: 2600.00,
      deductions: -856.00,
      netPay: 1744.00,
      status: 'Paid',
      employeeId: 'EMP-001',
      regularHours: 80,
      overtimeHours: 0,
      hourlyRate: 32.50,
    },
    {
      id: '5',
      payPeriod: 'Nov 1-15, 2024',
      employeeName: 'Michael Chen',
      employeePhoto: 'https://ui-avatars.com/api/?name=Michael+Chen&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      payDate: 'Nov 20, 2024',
      grossPay: 2240.00,
      deductions: -737.00,
      netPay: 1503.00,
      status: 'Paid',
      employeeId: 'EMP-004',
      regularHours: 80,
      overtimeHours: 0,
      hourlyRate: 28.00,
    },
    {
      id: '6',
      payPeriod: 'Oct 16-31, 2024',
      employeeName: 'Lisa Anderson',
      employeePhoto: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=F3F4F6&color=374151',
      position: 'Manager',
      payDate: 'Nov 5, 2024',
      grossPay: 5416.67,
      deductions: -1782.50,
      netPay: 3634.17,
      status: 'Paid',
      employeeId: 'EMP-005',
    },
    {
      id: '7',
      payPeriod: 'Oct 16-31, 2024',
      employeeName: 'Robert Taylor',
      employeePhoto: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=F3F4F6&color=374151',
      position: 'Laser Tech',
      payDate: 'Nov 5, 2024',
      grossPay: 2400.00,
      deductions: -790.00,
      netPay: 1610.00,
      status: 'Paid',
      employeeId: 'EMP-006',
      regularHours: 80,
      overtimeHours: 0,
      hourlyRate: 30.00,
    },
    {
      id: '8',
      payPeriod: 'Oct 1-15, 2024',
      employeeName: 'Amanda White',
      employeePhoto: 'https://ui-avatars.com/api/?name=Amanda+White&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      payDate: 'Oct 20, 2024',
      grossPay: 2240.00,
      deductions: -737.00,
      netPay: 1503.00,
      status: 'Paid',
      employeeId: 'EMP-007',
      regularHours: 80,
      overtimeHours: 0,
      hourlyRate: 28.00,
    },
    {
      id: '9',
      payPeriod: 'Oct 1-15, 2024',
      employeeName: 'Jessica Martinez',
      employeePhoto: 'https://ui-avatars.com/api/?name=Jessica+Martinez&background=F3F4F6&color=374151',
      position: 'Front Desk',
      payDate: 'Oct 20, 2024',
      grossPay: 1440.00,
      deductions: -474.00,
      netPay: 966.00,
      status: 'Paid',
      employeeId: 'EMP-008',
      regularHours: 80,
      overtimeHours: 0,
      hourlyRate: 18.00,
    },
    {
      id: '10',
      payPeriod: 'Sep 16-30, 2024',
      employeeName: 'David Kim',
      employeePhoto: 'https://ui-avatars.com/api/?name=David+Kim&background=F3F4F6&color=374151',
      position: 'Medical Director',
      payDate: 'Oct 5, 2024',
      grossPay: 8333.33,
      deductions: -2745.50,
      netPay: 5587.83,
      status: 'Paid',
      employeeId: 'EMP-003',
    },
  ]);

  const filteredPayStubs = payStubs.filter(stub => {
    const matchesSearch = stub.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || stub.status.toLowerCase() === statusFilter;
    const matchesEmployee = employeeFilter === 'all' || stub.employeeId === employeeFilter;
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      'Generated': 'bg-blue-100 text-blue-800 hover:bg-blue-100',
      'Sent': 'bg-[#F39C12] text-white hover:bg-[#F39C12]',
      'Paid': 'bg-[#27AE60] text-white hover:bg-[#27AE60]',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const handleView = (payStub: PayStub) => {
    setViewingPayStub(payStub);
    setIsViewModalOpen(true);
  };

  const handleDownload = (payStub: PayStub) => {
    toast({
      title: 'Downloading',
      description: `Downloading pay stub for ${payStub.employeeName}...`,
    });
  };

  const handleEmail = (payStub: PayStub) => {
    toast({
      title: 'Email Sent',
      description: `Pay stub sent to ${payStub.employeeName}`,
    });
  };

  const handleDeleteConfirm = () => {
    if (deletePayStubId) {
      toast({
        title: 'Deleted',
        description: 'Pay stub deleted successfully',
      });
      setDeletePayStubId(null);
    }
  };

  const handleGenerateNew = () => {
    toast({
      title: 'Generate Pay Stub',
      description: 'Redirecting to payroll run page...',
    });
  };

  const handleExportCSV = () => {
    toast({
      title: 'Exporting',
      description: 'Downloading pay stubs as CSV...',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pay Stubs</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage all generated pay stubs
          </p>
        </div>
        <Button onClick={handleGenerateNew} className="bg-[#3498DB] hover:bg-[#2980B9] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Generate New Pay Stub
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by employee name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Pay Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Period</SelectItem>
                <SelectItem value="previous">Previous Period</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="generated">Generated</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Employees" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="EMP-001">Sarah Johnson</SelectItem>
                <SelectItem value="EMP-002">Emily Rodriguez</SelectItem>
                <SelectItem value="EMP-003">David Kim</SelectItem>
                <SelectItem value="EMP-004">Michael Chen</SelectItem>
                <SelectItem value="EMP-005">Lisa Anderson</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pay Stubs Table */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">Pay Period</TableHead>
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Position</TableHead>
                  <TableHead className="font-semibold">Pay Date</TableHead>
                  <TableHead className="font-semibold">Gross Pay</TableHead>
                  <TableHead className="font-semibold">Deductions</TableHead>
                  <TableHead className="font-semibold">Net Pay</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayStubs.map((stub) => (
                  <TableRow key={stub.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{stub.payPeriod}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={stub.employeePhoto} alt={stub.employeeName} />
                          <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                            {stub.employeeName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{stub.employeeName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{stub.position}</TableCell>
                    <TableCell className="text-gray-600">{stub.payDate}</TableCell>
                    <TableCell className="font-medium text-gray-900">${stub.grossPay.toFixed(2)}</TableCell>
                    <TableCell className="font-medium text-red-600">${stub.deductions.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold text-[#27AE60]">${stub.netPay.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(stub.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(stub)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4 text-[#3498DB]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(stub)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEmail(stub)}
                          className="h-8 w-8 p-0"
                        >
                          <Mail className="h-4 w-4 text-[#F39C12]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletePayStubId(stub.id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-[#E74C3C]" />
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

      {/* Results count */}
      <div className="text-sm text-gray-500">
        Showing {filteredPayStubs.length} pay stub{filteredPayStubs.length !== 1 ? 's' : ''}
      </div>

      {/* Pay Stub Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">MedSpa Pro - Pay Stub</DialogTitle>
          </DialogHeader>

          {viewingPayStub && (
            <div className="space-y-6 py-4">
              {/* Header Info */}
              <div className="text-center space-y-2 pb-4 border-b-2 border-gray-200">
                <p className="text-lg font-semibold text-gray-900">
                  Pay Period: {viewingPayStub.payPeriod}
                </p>
                <p className="text-base text-gray-600">
                  Pay Date: {viewingPayStub.payDate}
                </p>
              </div>

              {/* Employee Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Employee Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={viewingPayStub.employeePhoto} alt={viewingPayStub.employeeName} />
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {viewingPayStub.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-base">{viewingPayStub.employeeName}</p>
                        <p className="text-gray-600">{viewingPayStub.position}</p>
                      </div>
                    </div>
                    <p className="text-gray-600">Employee ID: {viewingPayStub.employeeId}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">Company Information</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>MedSpa Pro</p>
                    <p>123 Main Street</p>
                    <p>New York, NY 10001</p>
                  </div>
                </div>
              </div>

              {/* Earnings */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Earnings</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  {viewingPayStub.regularHours !== undefined && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Regular Hours ({viewingPayStub.regularHours} hrs @ ${viewingPayStub.hourlyRate})</span>
                        <span className="font-medium">${(viewingPayStub.regularHours * (viewingPayStub.hourlyRate || 0)).toFixed(2)}</span>
                      </div>
                      {viewingPayStub.overtimeHours! > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Overtime Hours ({viewingPayStub.overtimeHours} hrs @ ${((viewingPayStub.hourlyRate || 0) * 1.5).toFixed(2)})</span>
                          <span className="font-medium">${(viewingPayStub.overtimeHours! * (viewingPayStub.hourlyRate || 0) * 1.5).toFixed(2)}</span>
                        </div>
                      )}
                    </>
                  )}
                  {viewingPayStub.regularHours === undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Salary</span>
                      <span className="font-medium">${viewingPayStub.grossPay.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-300">
                    <span>Gross Pay</span>
                    <span>${viewingPayStub.grossPay.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Deductions</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Federal Tax</span>
                    <span className="text-red-600">-${(Math.abs(viewingPayStub.deductions) * 0.456).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">State Tax</span>
                    <span className="text-red-600">-${(Math.abs(viewingPayStub.deductions) * 0.152).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Social Security (6.2%)</span>
                    <span className="text-red-600">-${(Math.abs(viewingPayStub.deductions) * 0.188).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Medicare (1.45%)</span>
                    <span className="text-red-600">-${(Math.abs(viewingPayStub.deductions) * 0.044).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Health Insurance</span>
                    <span className="text-red-600">-${(Math.abs(viewingPayStub.deductions) * 0.16).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base font-semibold text-red-600 pt-2 border-t border-gray-300">
                    <span>Total Deductions</span>
                    <span>${viewingPayStub.deductions.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Net Pay */}
              <div className="bg-[#27AE60] text-white p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Net Pay</span>
                  <span className="text-3xl font-bold">${viewingPayStub.netPay.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button 
                  onClick={() => handleDownload(viewingPayStub)}
                  className="bg-[#3498DB] hover:bg-[#2980B9] text-white flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button 
                  onClick={() => handleEmail(viewingPayStub)}
                  variant="outline"
                  className="flex-1"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Employee
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePayStubId} onOpenChange={() => setDeletePayStubId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pay Stub?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this pay stub? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-[#E74C3C] hover:bg-[#C0392B]"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PayrollPayStubs;
