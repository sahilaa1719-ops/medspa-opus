import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Copy, 
  Save, 
  Eye, 
  CheckCircle,
  Users,
  Clock,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  photoUrl: string;
  position: string;
  type: 'Hourly' | 'Salaried';
  rate: number;
  regularHours: number | null;
  overtimeHours: number | null;
  status: 'Not Started' | 'In Progress' | 'Complete';
  selected: boolean;
}

const RunPayroll = () => {
  const { toast } = useToast();
  const [payPeriod, setPayPeriod] = useState('nov-16-30-2024');
  const [currentStep, setCurrentStep] = useState(2); // Enter Hours step

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      photoUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=F3F4F6&color=374151',
      position: 'RN',
      type: 'Hourly',
      rate: 32.50,
      regularHours: 80,
      overtimeHours: 5,
      status: 'Complete',
      selected: true,
    },
    {
      id: '2',
      name: 'Michael Chen',
      photoUrl: 'https://ui-avatars.com/api/?name=Michael+Chen&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      type: 'Hourly',
      rate: 28.00,
      regularHours: null,
      overtimeHours: null,
      status: 'Not Started',
      selected: true,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      photoUrl: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F3F4F6&color=374151',
      position: 'LPN',
      type: 'Hourly',
      rate: 26.50,
      regularHours: 80,
      overtimeHours: 0,
      status: 'Complete',
      selected: true,
    },
    {
      id: '4',
      name: 'David Kim',
      photoUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=F3F4F6&color=374151',
      position: 'Medical Director',
      type: 'Salaried',
      rate: 8333.33,
      regularHours: null,
      overtimeHours: null,
      status: 'Complete',
      selected: true,
    },
    {
      id: '5',
      name: 'Jessica Martinez',
      photoUrl: 'https://ui-avatars.com/api/?name=Jessica+Martinez&background=F3F4F6&color=374151',
      position: 'Front Desk',
      type: 'Hourly',
      rate: 18.00,
      regularHours: null,
      overtimeHours: null,
      status: 'Not Started',
      selected: true,
    },
    {
      id: '6',
      name: 'Amanda White',
      photoUrl: 'https://ui-avatars.com/api/?name=Amanda+White&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      type: 'Hourly',
      rate: 28.00,
      regularHours: null,
      overtimeHours: null,
      status: 'Not Started',
      selected: true,
    },
    {
      id: '7',
      name: 'Robert Taylor',
      photoUrl: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=F3F4F6&color=374151',
      position: 'Laser Tech',
      type: 'Hourly',
      rate: 30.00,
      regularHours: null,
      overtimeHours: null,
      status: 'Not Started',
      selected: true,
    },
    {
      id: '8',
      name: 'Lisa Anderson',
      photoUrl: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=F3F4F6&color=374151',
      position: 'Manager',
      type: 'Salaried',
      rate: 5416.67,
      regularHours: null,
      overtimeHours: null,
      status: 'Complete',
      selected: true,
    },
  ]);

  const calculateGrossPay = (emp: Employee) => {
    if (emp.type === 'Salaried') {
      return emp.rate;
    }
    if (emp.regularHours === null) return 0;
    const regularPay = emp.regularHours * emp.rate;
    const overtimePay = (emp.overtimeHours || 0) * emp.rate * 1.5;
    return regularPay + overtimePay;
  };

  const handleHoursChange = (id: string, field: 'regularHours' | 'overtimeHours', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    
    // Validation
    if (numValue !== null && (numValue < 0 || numValue > 200)) {
      toast({
        title: 'Invalid Hours',
        description: 'Hours must be between 0 and 200',
        variant: 'destructive',
      });
      return;
    }

    setEmployees(prev => prev.map(emp => {
      if (emp.id === id) {
        const updated = { ...emp, [field]: numValue };
        // Update status
        if (emp.type === 'Hourly' && updated.regularHours !== null) {
          updated.status = 'Complete';
        } else if (updated.regularHours !== null || updated.overtimeHours !== null) {
          updated.status = 'In Progress';
        }
        return updated;
      }
      return emp;
    }));

    // Auto-save
    toast({
      title: 'Saved',
      description: 'Hours updated successfully',
      duration: 2000,
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setEmployees(prev => prev.map(emp => ({ ...emp, selected: checked })));
  };

  const handleSelectEmployee = (id: string, checked: boolean) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, selected: checked } : emp
    ));
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      'Complete': 'bg-[#27AE60] text-white hover:bg-[#27AE60]',
      'In Progress': 'bg-[#F39C12] text-white hover:bg-[#F39C12]',
      'Not Started': 'bg-gray-300 text-gray-700 hover:bg-gray-300',
    };
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const totalEmployees = employees.length;
  const processedEmployees = employees.filter(e => e.status === 'Complete').length;
  const totalRegularHours = employees.reduce((sum, e) => sum + (e.regularHours || 0), 0);
  const totalOvertimeHours = employees.reduce((sum, e) => sum + (e.overtimeHours || 0), 0);
  const totalGrossPay = employees.reduce((sum, e) => sum + calculateGrossPay(e), 0);
  const progressPercent = (processedEmployees / totalEmployees) * 100;
  const allComplete = processedEmployees === totalEmployees;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Run Payroll</h1>
          <p className="text-sm text-gray-500 mt-1">
            Process payroll for the selected pay period
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Pay Period</label>
            <Select value={payPeriod} onValueChange={setPayPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nov-16-30-2024">Nov 16 - 30, 2024</SelectItem>
                <SelectItem value="nov-1-15-2024">Nov 1 - 15, 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Pay Date</label>
            <Input type="date" defaultValue="2024-12-05" className="w-40" />
          </div>
        </div>
      </div>

      {/* Workflow Progress */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Workflow Progress - Step {currentStep} of 4</span>
              <span className="text-gray-500">{Math.round(progressPercent)}% Complete</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className={currentStep >= 1 ? 'text-[#27AE60] font-medium' : ''}>1. Select Employees</span>
              <span className={currentStep >= 2 ? 'text-[#3498DB] font-medium' : ''}>2. Enter Hours</span>
              <span className={currentStep >= 3 ? 'text-gray-500' : ''}>3. Review</span>
              <span className={currentStep >= 4 ? 'text-gray-500' : ''}>4. Generate</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content with Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Employee Table */}
        <div className="lg:col-span-3">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Employee Hours Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={employees.every(e => e.selected)}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-semibold">Employee</TableHead>
                      <TableHead className="font-semibold">Position</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Rate</TableHead>
                      <TableHead className="font-semibold">Regular Hrs</TableHead>
                      <TableHead className="font-semibold">OT Hrs</TableHead>
                      <TableHead className="font-semibold">Gross Pay</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((emp) => (
                      <TableRow key={emp.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox 
                            checked={emp.selected}
                            onCheckedChange={(checked) => handleSelectEmployee(emp.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={emp.photoUrl} alt={emp.name} />
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                              {emp.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell className="text-gray-600">{emp.position}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {emp.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-700">
                          ${emp.rate.toFixed(2)}{emp.type === 'Hourly' ? '/hr' : ''}
                        </TableCell>
                        <TableCell>
                          {emp.type === 'Hourly' ? (
                            <Input
                              type="number"
                              value={emp.regularHours ?? ''}
                              onChange={(e) => handleHoursChange(emp.id, 'regularHours', e.target.value)}
                              className="w-20 h-8"
                              placeholder="0"
                              min="0"
                              max="200"
                            />
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {emp.type === 'Hourly' ? (
                            <Input
                              type="number"
                              value={emp.overtimeHours ?? ''}
                              onChange={(e) => handleHoursChange(emp.id, 'overtimeHours', e.target.value)}
                              className="w-20 h-8"
                              placeholder="0"
                              min="0"
                              max="100"
                            />
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold text-gray-900">
                          {calculateGrossPay(emp) > 0 ? `$${calculateGrossPay(emp).toFixed(2)}` : '--'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(emp.status)}
                          {emp.status === 'Complete' && (
                            <CheckCircle className="inline-block h-4 w-4 text-[#27AE60] ml-2" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 mt-4">
            <Button variant="outline" className="border-gray-300">
              <Upload className="h-4 w-4 mr-2" />
              Import Hours from CSV
            </Button>
            <Button variant="outline" className="border-gray-300">
              <Copy className="h-4 w-4 mr-2" />
              Copy Hours from Last Period
            </Button>
            <Button variant="outline" className="border-gray-300">
              <Save className="h-4 w-4 mr-2" />
              Save Progress
            </Button>
            <Button className="bg-[#3498DB] hover:bg-[#2980B9] text-white ml-auto">
              <Eye className="h-4 w-4 mr-2" />
              Preview Pay Stubs
            </Button>
            <Button 
              className="bg-[#27AE60] hover:bg-[#229954] text-white"
              disabled={!allComplete}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Generate Pay Stubs
            </Button>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border border-gray-200 bg-white shadow-sm sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Total Employees</span>
                </div>
                <span className="text-lg font-bold">{totalEmployees}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Processed</span>
                </div>
                <span className="text-lg font-bold text-[#27AE60]">
                  {processedEmployees} / {totalEmployees}
                </span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Regular Hours</span>
                </div>
                <span className="text-lg font-bold">{totalRegularHours}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">OT Hours</span>
                </div>
                <span className="text-lg font-bold text-[#F39C12]">{totalOvertimeHours}</span>
              </div>

              <div className="flex items-center justify-between pt-2 bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#3498DB]" />
                  <span className="text-sm font-semibold text-[#3498DB]">Total Gross</span>
                </div>
                <span className="text-xl font-bold text-[#3498DB]">
                  ${totalGrossPay.toFixed(2)}
                </span>
              </div>

              <Button variant="link" className="w-full text-[#3498DB] mt-2">
                Review Details →
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RunPayroll;
