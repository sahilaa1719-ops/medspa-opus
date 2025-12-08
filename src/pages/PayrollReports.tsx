import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
  FileText, 
  Users, 
  Receipt, 
  Clock, 
  Shield, 
  Download, 
  Eye, 
  Plus,
  Mail,
  Printer,
  FileSpreadsheet,
  ChevronRight,
  Calendar,
  Edit,
  Pause,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface QuickReport {
  id: string;
  title: string;
  period: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  recipients: string;
  status: 'Active' | 'Paused';
}

const PayrollReports = () => {
  const { toast } = useToast();
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('this-month');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState('all');
  const [includeGross, setIncludeGross] = useState(true);
  const [includeDeductions, setIncludeDeductions] = useState(true);
  const [includeNet, setIncludeNet] = useState(true);
  const [includeHours, setIncludeHours] = useState(true);
  const [includeTaxes, setIncludeTaxes] = useState(true);

  const reportCategories = [
    {
      title: 'Payroll Summary Reports',
      icon: FileText,
      color: 'text-[#3498DB]',
      bgColor: 'bg-blue-50',
      reports: [
        'Monthly Payroll Summary',
        'Quarterly Payroll Report',
        'Year-to-Date Payroll',
        'Payroll by Pay Period',
      ],
    },
    {
      title: 'Employee Reports',
      icon: Users,
      color: 'text-[#27AE60]',
      bgColor: 'bg-green-50',
      reports: [
        'Employee Earnings Report',
        'Employee Deductions Report',
        'Payroll by Employee',
        'New Hire Report',
      ],
    },
    {
      title: 'Tax Reports',
      icon: Receipt,
      color: 'text-[#9B59B6]',
      bgColor: 'bg-purple-50',
      reports: [
        'Tax Withholding Summary',
        'Quarterly Tax Report',
        'Annual Tax Summary (W-2/1099)',
        'Tax Liability Report',
      ],
    },
    {
      title: 'Labor Reports',
      icon: Clock,
      color: 'text-[#F39C12]',
      bgColor: 'bg-orange-50',
      reports: [
        'Hours Worked Report',
        'Overtime Report',
        'Labor Cost by Department/Location',
        'Productivity Report',
      ],
    },
    {
      title: 'Compliance Reports',
      icon: Shield,
      color: 'text-[#E74C3C]',
      bgColor: 'bg-red-50',
      reports: [
        'Payroll Register',
        'Payroll Journal',
        'Wage & Hour Compliance',
        'ACA Compliance Report',
      ],
    },
  ];

  const quickReports: QuickReport[] = [
    {
      id: '1',
      title: 'Monthly Payroll Summary - November 2024',
      period: 'Nov 1-30, 2024',
      metrics: [
        { label: 'Total Gross', value: '$312,480.00' },
        { label: 'Total Net', value: '$198,491.20' },
      ],
    },
    {
      id: '2',
      title: 'YTD Payroll Report - 2024',
      period: 'Jan 1 - Nov 30, 2024',
      metrics: [
        { label: 'Total Gross', value: '$3,437,280.00' },
        { label: 'Total Net', value: '$2,184,659.20' },
      ],
    },
    {
      id: '3',
      title: 'Overtime Report - November 2024',
      period: 'Nov 1-30, 2024',
      metrics: [
        { label: 'Total OT Hours', value: '47.5 hours' },
        { label: 'Total OT Pay', value: '$2,318.75' },
        { label: 'Employees with OT', value: '8' },
      ],
    },
  ];

  const [scheduledReports] = useState<ScheduledReport[]>([
    {
      id: '1',
      name: 'Monthly Payroll Summary',
      frequency: 'Monthly (1st of month)',
      recipients: 'admin@medspa.com, payroll@medspa.com',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Quarterly Tax Report',
      frequency: 'Quarterly (1st day of quarter)',
      recipients: 'payroll@medspa.com, accounting@medspa.com',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Weekly Hours Report',
      frequency: 'Weekly (Monday)',
      recipients: 'payroll@medspa.com',
      status: 'Paused',
    },
  ]);

  const locationBreakdown = [
    { location: 'Downtown Med Spa', employees: 18, grossPay: 124992.00, netPay: 79494.72 },
    { location: 'Westside Wellness', employees: 16, grossPay: 99993.60, netPay: 63595.91 },
    { location: 'Uptown Beauty Clinic', employees: 13, grossPay: 87494.40, netPay: 55646.14 },
  ];

  const employeeDetails = [
    { name: 'Sarah Johnson', position: 'RN', gross: 5687.50, deductions: -1872.58, net: 3814.92 },
    { name: 'Michael Chen', position: 'Aesthetician', gross: 4824.00, deductions: -1590.00, net: 3234.00 },
    { name: 'Emily Rodriguez', position: 'LPN', gross: 4593.33, deductions: -1514.20, net: 3079.13 },
    { name: 'David Kim', position: 'Medical Director', gross: 8333.33, deductions: -2745.50, net: 5587.83 },
    { name: 'Lisa Anderson', position: 'Manager', gross: 5416.67, deductions: -1782.50, net: 3634.17 },
  ];

  const handleViewCategory = (category: string) => {
    toast({
      title: 'View Reports',
      description: `Viewing ${category} reports...`,
    });
  };

  const handleViewReport = (reportId: string) => {
    setPreviewModalOpen(true);
  };

  const handleDownloadReport = (reportId: string) => {
    toast({
      title: 'Downloading',
      description: 'Downloading report...',
    });
  };

  const handleGenerateReport = () => {
    if (!reportType) {
      toast({
        title: 'Missing Information',
        description: 'Please select a report type',
        variant: 'destructive',
      });
      return;
    }
    setGenerateModalOpen(false);
    setPreviewModalOpen(true);
    toast({
      title: 'Report Generated',
      description: 'Your custom report has been generated',
    });
  };

  const handleDownloadPDF = () => {
    toast({
      title: 'Downloading PDF',
      description: 'Preparing PDF file...',
    });
  };

  const handleDownloadExcel = () => {
    toast({
      title: 'Downloading Excel',
      description: 'Preparing Excel file...',
    });
  };

  const handleEmailReport = () => {
    toast({
      title: 'Email Sent',
      description: 'Report has been emailed',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEditSchedule = (id: string) => {
    toast({
      title: 'Edit Schedule',
      description: 'Edit scheduled report functionality coming soon',
    });
  };

  const handlePauseSchedule = (id: string) => {
    toast({
      title: 'Schedule Updated',
      description: 'Scheduled report paused',
    });
  };

  const handleDeleteSchedule = (id: string) => {
    toast({
      title: 'Schedule Deleted',
      description: 'Scheduled report deleted',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Generate and download comprehensive payroll reports
          </p>
        </div>
        <Button 
          onClick={() => setGenerateModalOpen(true)}
          className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Generate Custom Report
        </Button>
      </div>

      {/* Report Categories */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((category) => (
            <Card key={category.title} className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={cn('h-12 w-12 rounded-lg flex items-center justify-center', category.bgColor)}>
                    <category.icon className={cn('h-6 w-6', category.color)} />
                  </div>
                </div>
                <CardTitle className="text-base mt-4">{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {category.reports.map((report) => (
                    <li key={report} className="text-sm text-gray-600 flex items-center">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-2"></span>
                      {report}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="ghost"
                  className="w-full justify-between hover:bg-gray-50"
                  onClick={() => handleViewCategory(category.title)}
                >
                  View Reports
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Reports */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickReports.map((report) => (
            <Card key={report.id} className="border border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm font-medium">{report.title}</CardTitle>
                <p className="text-xs text-gray-500 mt-1">{report.period}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {report.metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{metric.label}:</span>
                      <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewReport(report.id)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownloadReport(report.id)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scheduled Reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Scheduled Reports</h2>
          <Button 
            variant="outline"
            onClick={() => setScheduleModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Scheduled Report
          </Button>
        </div>
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">Report Name</TableHead>
                  <TableHead className="font-semibold">Frequency</TableHead>
                  <TableHead className="font-semibold">Recipients</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scheduledReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{report.name}</TableCell>
                    <TableCell className="text-gray-600">{report.frequency}</TableCell>
                    <TableCell className="text-gray-600 text-sm">{report.recipients}</TableCell>
                    <TableCell>
                      <Badge 
                        className={cn(
                          report.status === 'Active' 
                            ? 'bg-[#27AE60] text-white hover:bg-[#27AE60]' 
                            : 'bg-gray-300 text-gray-700 hover:bg-gray-300'
                        )}
                      >
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditSchedule(report.id)}
                          className="h-8 px-2"
                        >
                          <Edit className="h-4 w-4 text-[#3498DB]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePauseSchedule(report.id)}
                          className="h-8 px-2"
                        >
                          <Pause className="h-4 w-4 text-[#F39C12]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSchedule(report.id)}
                          className="h-8 px-2"
                        >
                          <Trash2 className="h-4 w-4 text-[#E74C3C]" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Generate Custom Report Modal */}
      <Dialog open={generateModalOpen} onOpenChange={setGenerateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Custom Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Report Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payroll-summary">Payroll Summary</SelectItem>
                  <SelectItem value="employee-earnings">Employee Earnings</SelectItem>
                  <SelectItem value="tax-withholding">Tax Withholding</SelectItem>
                  <SelectItem value="hours-overtime">Hours & Overtime</SelectItem>
                  <SelectItem value="labor-cost">Labor Cost Analysis</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="this-year">This Year</SelectItem>
                  <SelectItem value="ytd">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              {dateRange === 'custom' && (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-xs text-gray-600">From</label>
                    <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">To</label>
                    <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                  </div>
                </div>
              )}
            </div>

            {/* Filter Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Filter Options</h3>
              
              <div className="space-y-2">
                <label className="text-xs text-gray-600">Employees</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Employees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    <SelectItem value="select">Select Specific...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-600">Locations</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="downtown">Downtown Med Spa</SelectItem>
                    <SelectItem value="westside">Westside Wellness</SelectItem>
                    <SelectItem value="uptown">Uptown Beauty Clinic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-600">Employment Type</label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="salaried">Salaried</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Include Options */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Include in Report</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Checkbox checked={includeGross} onCheckedChange={(checked) => setIncludeGross(checked as boolean)} />
                  <label className="text-sm text-gray-700">Gross Pay</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={includeDeductions} onCheckedChange={(checked) => setIncludeDeductions(checked as boolean)} />
                  <label className="text-sm text-gray-700">Deductions</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={includeNet} onCheckedChange={(checked) => setIncludeNet(checked as boolean)} />
                  <label className="text-sm text-gray-700">Net Pay</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={includeHours} onCheckedChange={(checked) => setIncludeHours(checked as boolean)} />
                  <label className="text-sm text-gray-700">Hours</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox checked={includeTaxes} onCheckedChange={(checked) => setIncludeTaxes(checked as boolean)} />
                  <label className="text-sm text-gray-700">Taxes</label>
                </div>
              </div>
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF (for printing)</SelectItem>
                  <SelectItem value="excel">Excel (for analysis)</SelectItem>
                  <SelectItem value="csv">CSV (for import)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerateReport}
              className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
            >
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Report Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Report Header */}
            <div className="bg-[#2C3E50] text-white p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">MedSpa Pro</h2>
                  <p className="text-sm text-gray-300 mt-1">Payroll Management System</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-300">Generated:</p>
                  <p className="font-semibold">December 8, 2024</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Monthly Payroll Summary</h3>
                <p className="text-sm text-gray-300 mt-1">Period: November 1-30, 2024</p>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Gross Pay</p>
                <p className="text-2xl font-bold text-gray-900">$312,480.00</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Deductions</p>
                <p className="text-2xl font-bold text-red-600">$102,918.60</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Net Pay</p>
                <p className="text-2xl font-bold text-[#27AE60]">$209,561.40</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900">3,760.0</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total OT Hours</p>
                <p className="text-2xl font-bold text-[#F39C12]">47.5</p>
              </div>
            </div>

            {/* By Location */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">By Department/Location</h3>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Employees</TableHead>
                    <TableHead className="font-semibold">Gross Pay</TableHead>
                    <TableHead className="font-semibold">Net Pay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationBreakdown.map((location, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{location.location}</TableCell>
                      <TableCell>{location.employees}</TableCell>
                      <TableCell className="font-medium">${location.grossPay.toLocaleString()}</TableCell>
                      <TableCell className="font-medium text-[#27AE60]">${location.netPay.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Employee Details */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Employee Details (Top 5)</h3>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Employee</TableHead>
                    <TableHead className="font-semibold">Position</TableHead>
                    <TableHead className="font-semibold">Gross Pay</TableHead>
                    <TableHead className="font-semibold">Deductions</TableHead>
                    <TableHead className="font-semibold">Net Pay</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeDetails.map((employee, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{employee.name}</TableCell>
                      <TableCell className="text-gray-600">{employee.position}</TableCell>
                      <TableCell className="font-medium">${employee.gross.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">${employee.deductions.toFixed(2)}</TableCell>
                      <TableCell className="font-medium text-[#27AE60]">${employee.net.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter className="flex items-center gap-2">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={handleDownloadExcel}
              className="bg-[#27AE60] hover:bg-[#229954] text-white"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Excel
            </Button>
            <Button variant="outline" onClick={handleEmailReport}>
              <Mail className="h-4 w-4 mr-2" />
              Email Report
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={() => setPreviewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Scheduled Report Modal */}
      <Dialog open={scheduleModalOpen} onOpenChange={setScheduleModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Scheduled Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly-summary">Monthly Payroll Summary</SelectItem>
                  <SelectItem value="quarterly-tax">Quarterly Tax Report</SelectItem>
                  <SelectItem value="weekly-hours">Weekly Hours Report</SelectItem>
                  <SelectItem value="overtime">Overtime Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Frequency</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Recipients (comma-separated emails)</label>
              <Input placeholder="admin@medspa.com, payroll@medspa.com" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setScheduleModalOpen(false);
                toast({
                  title: 'Schedule Added',
                  description: 'Scheduled report added successfully',
                });
              }}
              className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
            >
              Add Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollReports;
