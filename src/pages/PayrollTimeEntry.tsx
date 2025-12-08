import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  Upload, 
  CheckCircle, 
  Save, 
  Copy, 
  Trash2,
  Check,
  X,
  ChevronDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TimeEntry {
  employeeId: string;
  employeeName: string;
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
  total: number;
  ot: number;
  status: 'Not Started' | 'Draft' | 'Submitted';
}

interface PendingApproval {
  id: string;
  employeeName: string;
  date: string;
  regularHours: number;
  otHours: number;
  reason: string;
  submittedBy: string;
  submittedDate: string;
}

interface ApprovedEntry {
  id: string;
  employeeName: string;
  week: string;
  totalHours: number;
  otHours: number;
  approvedBy: string;
  approvedDate: string;
}

const PayrollTimeEntry = () => {
  const { toast } = useToast();
  const [payPeriod, setPayPeriod] = useState('nov-16-30-2024');
  const [activeTab, setActiveTab] = useState('enter');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [approveAllDialog, setApproveAllDialog] = useState(false);

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    {
      employeeId: 'EMP-001',
      employeeName: 'Sarah Johnson',
      mon: 8.0,
      tue: 8.5,
      wed: 8.0,
      thu: 8.0,
      fri: 9.0,
      sat: 0,
      sun: 0,
      total: 41.5,
      ot: 1.5,
      status: 'Draft',
    },
    {
      employeeId: 'EMP-004',
      employeeName: 'Michael Chen',
      mon: 8.0,
      tue: 8.0,
      wed: 8.0,
      thu: 8.0,
      fri: 8.0,
      sat: 0,
      sun: 0,
      total: 40.0,
      ot: 0,
      status: 'Draft',
    },
    {
      employeeId: 'EMP-002',
      employeeName: 'Emily Rodriguez',
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
      total: 0,
      ot: 0,
      status: 'Not Started',
    },
    {
      employeeId: 'EMP-006',
      employeeName: 'Robert Taylor',
      mon: 8.0,
      tue: 10.0,
      wed: 8.0,
      thu: 8.0,
      fri: 8.0,
      sat: 0,
      sun: 0,
      total: 42.0,
      ot: 2.0,
      status: 'Draft',
    },
    {
      employeeId: 'EMP-005',
      employeeName: 'Lisa Anderson',
      mon: 8.0,
      tue: 8.0,
      wed: 8.0,
      thu: 8.0,
      fri: 8.0,
      sat: 0,
      sun: 0,
      total: 40.0,
      ot: 0,
      status: 'Draft',
    },
  ]);

  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([
    {
      id: 'PA-001',
      employeeName: 'Sarah Johnson',
      date: 'Nov 20, 2024',
      regularHours: 8.0,
      otHours: 1.0,
      reason: 'Covered evening shift',
      submittedBy: 'Self-reported',
      submittedDate: 'Nov 21',
    },
    {
      id: 'PA-002',
      employeeName: 'Robert Taylor',
      date: 'Nov 18, 2024',
      regularHours: 8.0,
      otHours: 2.0,
      reason: 'Emergency laser repair',
      submittedBy: 'Self-reported',
      submittedDate: 'Nov 19',
    },
    {
      id: 'PA-003',
      employeeName: 'Michael Chen',
      date: 'Nov 17, 2024',
      regularHours: 8.0,
      otHours: 4.0,
      reason: 'Client consultation ran late',
      submittedBy: 'Self-reported',
      submittedDate: 'Nov 18',
    },
  ]);

  const [approvedEntries, setApprovedEntries] = useState<ApprovedEntry[]>([
    {
      id: 'AE-001',
      employeeName: 'David Kim',
      week: 'Nov 1-15, 2024',
      totalHours: 80.0,
      otHours: 0,
      approvedBy: 'Payroll Manager',
      approvedDate: 'Nov 16, 2024',
    },
    {
      id: 'AE-002',
      employeeName: 'Lisa Anderson',
      week: 'Nov 1-15, 2024',
      totalHours: 80.0,
      otHours: 0,
      approvedBy: 'Payroll Manager',
      approvedDate: 'Nov 16, 2024',
    },
    {
      id: 'AE-003',
      employeeName: 'Amanda White',
      week: 'Nov 1-15, 2024',
      totalHours: 82.0,
      otHours: 2.0,
      approvedBy: 'Payroll Manager',
      approvedDate: 'Nov 16, 2024',
    },
    {
      id: 'AE-004',
      employeeName: 'Sarah Johnson',
      week: 'Oct 16-31, 2024',
      totalHours: 80.0,
      otHours: 0,
      approvedBy: 'Payroll Manager',
      approvedDate: 'Nov 1, 2024',
    },
    {
      id: 'AE-005',
      employeeName: 'Michael Chen',
      week: 'Oct 16-31, 2024',
      totalHours: 80.0,
      otHours: 0,
      approvedBy: 'Payroll Manager',
      approvedDate: 'Nov 1, 2024',
    },
  ]);

  const payPeriods = [
    { value: 'nov-16-30-2024', label: 'Nov 16 - Nov 30, 2024' },
    { value: 'nov-1-15-2024', label: 'Nov 1 - Nov 15, 2024' },
    { value: 'oct-16-31-2024', label: 'Oct 16 - Oct 31, 2024' },
  ];

  const calculateTotals = () => {
    const totalHours = timeEntries.reduce((sum, entry) => sum + entry.total, 0);
    const totalOT = timeEntries.reduce((sum, entry) => sum + entry.ot, 0);
    const employeesWithEntries = timeEntries.filter(entry => entry.total > 0).length;
    return { totalHours, totalOT, employeesWithEntries };
  };

  const handleHoursChange = (employeeId: string, day: keyof TimeEntry, value: string) => {
    const numValue = parseFloat(value) || 0;
    
    setTimeEntries(prev => prev.map(entry => {
      if (entry.employeeId === employeeId) {
        const updated = { ...entry, [day]: numValue };
        const total = updated.mon + updated.tue + updated.wed + updated.thu + updated.fri + updated.sat + updated.sun;
        const ot = Math.max(0, total - 40);
        return { 
          ...updated, 
          total, 
          ot,
          status: total > 0 ? 'Draft' : 'Not Started'
        };
      }
      return entry;
    }));
  };

  const handleSaveEntry = (employeeId: string) => {
    toast({
      title: 'Saved',
      description: 'Time entry saved successfully',
    });
  };

  const handleCopyLastWeek = (employeeId: string) => {
    toast({
      title: 'Copied',
      description: 'Time copied from last week',
    });
  };

  const handleImportTimesheet = () => {
    toast({
      title: 'Import',
      description: 'Timesheet import functionality coming soon',
    });
  };

  const handleApproveAll = () => {
    setApproveAllDialog(false);
    toast({
      title: 'Approved',
      description: `${pendingApprovals.length} time entries approved`,
    });
    setPendingApprovals([]);
  };

  const handleApprove = (id: string) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    toast({
      title: 'Approved',
      description: 'Time entry approved',
    });
  };

  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (rejectingId) {
      setPendingApprovals(prev => prev.filter(item => item.id !== rejectingId));
      toast({
        title: 'Rejected',
        description: 'Time entry rejected',
      });
      setRejectDialogOpen(false);
      setRejectingId(null);
      setRejectReason('');
    }
  };

  const handleClearAll = () => {
    setTimeEntries(prev => prev.map(entry => ({
      ...entry,
      mon: 0,
      tue: 0,
      wed: 0,
      thu: 0,
      fri: 0,
      sat: 0,
      sun: 0,
      total: 0,
      ot: 0,
      status: 'Not Started',
    })));
    toast({
      title: 'Cleared',
      description: 'All time entries cleared',
    });
  };

  const handleSubmitForApproval = () => {
    toast({
      title: 'Submitted',
      description: 'Time entries submitted for approval',
    });
  };

  const getHoursCellClass = (hours: number) => {
    if (hours > 12) return 'bg-red-100 border-red-300';
    if (hours > 8) return 'bg-yellow-100 border-yellow-300';
    return '';
  };

  const filteredApprovedEntries = selectedEmployee === 'all' 
    ? approvedEntries 
    : approvedEntries.filter(entry => entry.employeeName === selectedEmployee);

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Time Entry & Approval</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter and approve employee time for payroll processing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={payPeriod} onValueChange={setPayPeriod}>
            <SelectTrigger className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {payPeriods.map(period => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleImportTimesheet}>
            <Upload className="h-4 w-4 mr-2" />
            Import Timesheet
          </Button>
          {pendingApprovals.length > 0 && activeTab === 'pending' && (
            <Button 
              onClick={() => setApproveAllDialog(true)}
              className="bg-[#27AE60] hover:bg-[#229954] text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve All
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="enter">Enter Time</TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending Approval
            {pendingApprovals.length > 0 && (
              <Badge className="ml-2 bg-[#F39C12] text-white hover:bg-[#F39C12]">
                {pendingApprovals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>

        {/* TAB 1: ENTER TIME */}
        <TabsContent value="enter" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold sticky left-0 bg-gray-50 z-10 min-w-[180px]">
                        Employee Name
                      </TableHead>
                      <TableHead className="font-semibold text-center min-w-[80px]">Mon 11/16</TableHead>
                      <TableHead className="font-semibold text-center min-w-[80px]">Tue 11/17</TableHead>
                      <TableHead className="font-semibold text-center min-w-[80px]">Wed 11/18</TableHead>
                      <TableHead className="font-semibold text-center min-w-[80px]">Thu 11/19</TableHead>
                      <TableHead className="font-semibold text-center min-w-[80px]">Fri 11/20</TableHead>
                      <TableHead className="font-semibold text-center min-w-[80px]">Sat 11/21</TableHead>
                      <TableHead className="font-semibold text-center min-w-[80px]">Sun 11/22</TableHead>
                      <TableHead className="font-semibold text-center min-w-[100px]">Total Hours</TableHead>
                      <TableHead className="font-semibold text-center min-w-[100px]">OT Hours</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Status</TableHead>
                      <TableHead className="font-semibold min-w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timeEntries.map((entry) => (
                      <TableRow key={entry.employeeId} className="hover:bg-gray-50">
                        <TableCell className="font-medium sticky left-0 bg-white">
                          {entry.employeeName}
                        </TableCell>
                        {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map(day => (
                          <TableCell key={day} className="p-1">
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              max="24"
                              value={entry[day] || ''}
                              onChange={(e) => handleHoursChange(entry.employeeId, day, e.target.value)}
                              className={cn(
                                "text-center h-9 w-full",
                                getHoursCellClass(entry[day])
                              )}
                              placeholder="0"
                            />
                          </TableCell>
                        ))}
                        <TableCell className="text-center font-semibold">
                          {entry.total.toFixed(1)}
                        </TableCell>
                        <TableCell className="text-center">
                          {entry.ot > 0 ? (
                            <span className="text-[#F39C12] font-semibold">{entry.ot.toFixed(1)}</span>
                          ) : (
                            <span className="text-gray-400">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={cn(
                              entry.status === 'Draft' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                              entry.status === 'Submitted' ? 'bg-[#F39C12] text-white hover:bg-[#F39C12]' :
                              'bg-gray-100 text-gray-600 hover:bg-gray-100'
                            )}
                          >
                            {entry.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveEntry(entry.employeeId)}
                              className="h-8 px-2"
                            >
                              <Save className="h-4 w-4 text-[#3498DB]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyLastWeek(entry.employeeId)}
                              className="h-8 px-2"
                              title="Copy from Last Week"
                            >
                              <Copy className="h-4 w-4 text-gray-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}

                    {/* Summary Row */}
                    <TableRow className="bg-[#2C3E50] hover:bg-[#2C3E50] font-semibold text-white">
                      <TableCell colSpan={8} className="sticky left-0 bg-[#2C3E50]">
                        TOTALS
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {totals.totalHours.toFixed(1)}
                      </TableCell>
                      <TableCell className="text-center text-lg">
                        {totals.totalOT.toFixed(1)}
                      </TableCell>
                      <TableCell colSpan={2}>
                        <span className="text-sm">
                          Employees with entries: {totals.employeesWithEntries} / {timeEntries.length}
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
            <Button 
              onClick={handleSubmitForApproval}
              className="bg-[#3498DB] hover:bg-[#2980B9] text-white"
            >
              Submit for Approval
            </Button>
          </div>

          {/* Legend */}
          <Card className="border border-gray-200 bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-6 text-sm">
                <span className="font-semibold text-gray-700">Color Code:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span className="text-gray-600">&gt;8 hours (requires review)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                  <span className="text-gray-600">&gt;12 hours (requires approval)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: PENDING APPROVAL */}
        <TabsContent value="pending" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Employee Name</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                    <TableHead className="font-semibold">Regular Hours</TableHead>
                    <TableHead className="font-semibold">OT Hours</TableHead>
                    <TableHead className="font-semibold">Reason</TableHead>
                    <TableHead className="font-semibold">Submitted By</TableHead>
                    <TableHead className="font-semibold">Submitted Date</TableHead>
                    <TableHead className="font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingApprovals.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                        No pending approvals
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingApprovals.map((approval) => (
                      <TableRow key={approval.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{approval.employeeName}</TableCell>
                        <TableCell>{approval.date}</TableCell>
                        <TableCell>{approval.regularHours.toFixed(1)} hrs</TableCell>
                        <TableCell>
                          <span className="text-[#F39C12] font-semibold">
                            {approval.otHours.toFixed(1)} hrs
                          </span>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <span className="text-sm text-gray-600 italic">"{approval.reason}"</span>
                        </TableCell>
                        <TableCell className="text-gray-600">{approval.submittedBy}</TableCell>
                        <TableCell className="text-gray-600">{approval.submittedDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApprove(approval.id)}
                              className="bg-[#27AE60] hover:bg-[#229954] text-white h-8"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(approval.id)}
                              className="border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white h-8"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: APPROVED */}
        <TabsContent value="approved" className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                <SelectItem value="David Kim">David Kim</SelectItem>
                <SelectItem value="Lisa Anderson">Lisa Anderson</SelectItem>
                <SelectItem value="Amanda White">Amanda White</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold">Employee Name</TableHead>
                    <TableHead className="font-semibold">Week</TableHead>
                    <TableHead className="font-semibold">Total Hours</TableHead>
                    <TableHead className="font-semibold">OT Hours</TableHead>
                    <TableHead className="font-semibold">Approved By</TableHead>
                    <TableHead className="font-semibold">Approved Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovedEntries.map((entry) => (
                    <TableRow key={entry.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{entry.employeeName}</TableCell>
                      <TableCell>{entry.week}</TableCell>
                      <TableCell className="font-semibold">{entry.totalHours.toFixed(1)} hrs</TableCell>
                      <TableCell>
                        {entry.otHours > 0 ? (
                          <span className="text-[#F39C12] font-semibold">{entry.otHours.toFixed(1)} hrs</span>
                        ) : (
                          <span className="text-gray-400">0 hrs</span>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">{entry.approvedBy}</TableCell>
                      <TableCell className="text-gray-600">{entry.approvedDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-[#27AE60] text-white hover:bg-[#27AE60]">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="text-sm text-gray-500">
            Showing {filteredApprovedEntries.length} approved entr{filteredApprovedEntries.length !== 1 ? 'ies' : 'y'}
          </div>
        </TabsContent>
      </Tabs>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Time Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Please provide a reason for rejecting this time entry:
            </p>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleRejectConfirm}
              className="bg-[#E74C3C] hover:bg-[#C0392B] text-white"
              disabled={!rejectReason.trim()}
            >
              Reject Entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve All Dialog */}
      <AlertDialog open={approveAllDialog} onOpenChange={setApproveAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve All Time Entries?</AlertDialogTitle>
            <AlertDialogDescription>
              This will approve all {pendingApprovals.length} pending time entries. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApproveAll}
              className="bg-[#27AE60] hover:bg-[#229954]"
            >
              Approve All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PayrollTimeEntry;
