import { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { DollarSign, CreditCard, Download, Eye } from 'lucide-react';

const EmployeePayroll = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [showPayStub, setShowPayStub] = useState(false);

  const years = ['2024', '2023', '2022'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleViewPayStub = () => {
    setShowPayStub(true);
  };

  const handleDownloadPayStub = () => {
    alert('Downloading pay stub PDF...');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Information</h1>
        <p className="text-sm text-gray-500 mt-1">
          View your pay stubs and payroll details
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-end gap-4">
        <div className="flex-1 max-w-xs">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Year
          </label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 max-w-xs">
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Month
          </label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleViewPayStub}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Pay Stub
        </Button>
      </div>

      {/* Employment Information */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-50">
              <DollarSign className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Employment Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Employment Type</p>
              <p className="text-base font-medium text-gray-900 mt-1">Hourly</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Hourly Rate</p>
              <p className="text-base font-medium text-gray-900 mt-1">$32.50/hour</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Overtime Rate</p>
              <p className="text-base font-medium text-gray-900 mt-1">$48.75/hour (1.5x)</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pay Frequency</p>
              <p className="text-base font-medium text-gray-900 mt-1">Bi-weekly</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card className="border border-[#E5E7EB] bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-50">
              <CreditCard className="h-4 w-4 text-green-600" />
            </div>
            <CardTitle className="text-lg font-semibold">Payment Method</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Bank Account</p>
              <p className="text-base font-medium text-gray-900 mt-1">****1234</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="text-base font-medium text-gray-900 mt-1">Direct Deposit</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Routing Number</p>
              <p className="text-base font-medium text-gray-900 mt-1">****5678</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pay Stub Section */}
      {showPayStub && (
        <Card className="border border-[#E5E7EB] bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Pay Stub for {selectedMonth} 1-15, {selectedYear}
              </CardTitle>
              <Button 
                onClick={handleDownloadPayStub}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Pay Stub (PDF)
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Pay Period Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-xs text-gray-500">Pay Period</p>
                <p className="text-sm font-medium text-gray-900">Nov 1-15, 2024</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Pay Date</p>
                <p className="text-sm font-medium text-gray-900">Nov 20, 2024</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Employee</p>
                <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Employee ID</p>
                <p className="text-sm font-medium text-gray-900">EMP-001</p>
              </div>
            </div>

            {/* Earnings */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Earnings</h3>
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold text-right">Hours/Units</TableHead>
                      <TableHead className="font-semibold text-right">Rate</TableHead>
                      <TableHead className="font-semibold text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Regular Hours</TableCell>
                      <TableCell className="text-right">80 hrs</TableCell>
                      <TableCell className="text-right">$32.50</TableCell>
                      <TableCell className="text-right">$2,600.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Overtime Hours</TableCell>
                      <TableCell className="text-right">5 hrs</TableCell>
                      <TableCell className="text-right">$48.75</TableCell>
                      <TableCell className="text-right">$243.75</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50 font-semibold">
                      <TableCell colSpan={3}>Gross Pay</TableCell>
                      <TableCell className="text-right">$2,843.75</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Deductions</h3>
              <div className="border border-[#E5E7EB] rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Federal Tax</TableCell>
                      <TableCell className="text-right text-red-600">-$426.56</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">State Tax</TableCell>
                      <TableCell className="text-right text-red-600">-$142.19</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Social Security (6.2%)</TableCell>
                      <TableCell className="text-right text-red-600">-$176.31</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Medicare (1.45%)</TableCell>
                      <TableCell className="text-right text-red-600">-$41.23</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Health Insurance</TableCell>
                      <TableCell className="text-right text-red-600">-$150.00</TableCell>
                    </TableRow>
                    <TableRow className="bg-gray-50 font-semibold">
                      <TableCell>Total Deductions</TableCell>
                      <TableCell className="text-right text-red-600">-$936.29</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Net Pay */}
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium mb-1">Net Pay</p>
              <p className="text-4xl font-bold text-green-900">$1,907.46</p>
            </div>

            {/* YTD Summary */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Year-to-Date Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">YTD Gross Pay</p>
                  <p className="text-lg font-semibold text-gray-900">$68,250.00</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">YTD Deductions</p>
                  <p className="text-lg font-semibold text-red-600">-$22,470.96</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">YTD Net Pay</p>
                  <p className="text-lg font-semibold text-green-600">$45,779.04</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeePayroll;
