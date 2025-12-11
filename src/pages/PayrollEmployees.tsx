import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Switch } from '@/components/ui/switch';
import { Search, Edit, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: string;
  name: string;
  photoUrl: string;
  position: string;
  locations: string[]; // Mock data format
  employee_locations?: Array<{ // Supabase join format
    location_id: string;
    locations?: {
      id: string;
      name: string;
    };
  }>;
  employmentType: 'Hourly' | 'Salaried';
  payRate: number;
  payFrequency: string;
  bankAccount: string;
  overtimeEligible?: boolean;
  filingStatus?: string;
  federalAllowances?: number;
  stateAllowances?: number;
  additionalWithholding?: number;
}

const PayrollEmployees = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employees] = useState<Employee[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      photoUrl: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=F3F4F6&color=374151',
      position: 'RN',
      locations: ['Downtown Med Spa', 'Westside Wellness'],
      employmentType: 'Hourly',
      payRate: 32.50,
      payFrequency: 'Bi-weekly',
      bankAccount: '****1234',
      overtimeEligible: true,
      filingStatus: 'Married',
      federalAllowances: 2,
      stateAllowances: 2,
      additionalWithholding: 0,
    },
    {
      id: '2',
      name: 'Michael Chen',
      photoUrl: 'https://ui-avatars.com/api/?name=Michael+Chen&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      locations: ['Downtown Med Spa'],
      employmentType: 'Hourly',
      payRate: 28.00,
      payFrequency: 'Bi-weekly',
      bankAccount: '****5678',
      overtimeEligible: true,
      filingStatus: 'Single',
      federalAllowances: 1,
      stateAllowances: 1,
      additionalWithholding: 50,
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      photoUrl: 'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F3F4F6&color=374151',
      position: 'LPN',
      locations: ['Westside Wellness'],
      employmentType: 'Hourly',
      payRate: 26.50,
      payFrequency: 'Bi-weekly',
      bankAccount: '****9012',
      overtimeEligible: true,
      filingStatus: 'Single',
      federalAllowances: 0,
      stateAllowances: 0,
      additionalWithholding: 0,
    },
    {
      id: '4',
      name: 'David Kim',
      photoUrl: 'https://ui-avatars.com/api/?name=David+Kim&background=F3F4F6&color=374151',
      position: 'Medical Director',
      locations: ['Downtown Med Spa', 'Westside Wellness', 'Uptown Beauty'],
      employmentType: 'Salaried',
      payRate: 200000,
      payFrequency: 'Bi-weekly',
      bankAccount: '****3456',
      overtimeEligible: false,
      filingStatus: 'Married',
      federalAllowances: 3,
      stateAllowances: 3,
      additionalWithholding: 0,
    },
    {
      id: '5',
      name: 'Jessica Martinez',
      photoUrl: 'https://ui-avatars.com/api/?name=Jessica+Martinez&background=F3F4F6&color=374151',
      position: 'Front Desk',
      locations: ['Uptown Beauty'],
      employmentType: 'Hourly',
      payRate: 18.00,
      payFrequency: 'Bi-weekly',
      bankAccount: '****7890',
      overtimeEligible: true,
      filingStatus: 'Single',
      federalAllowances: 1,
      stateAllowances: 1,
      additionalWithholding: 0,
    },
    {
      id: '6',
      name: 'Amanda White',
      photoUrl: 'https://ui-avatars.com/api/?name=Amanda+White&background=F3F4F6&color=374151',
      position: 'Aesthetician',
      locations: ['Downtown Med Spa'],
      employmentType: 'Hourly',
      payRate: 28.00,
      payFrequency: 'Bi-weekly',
      bankAccount: '****2345',
      overtimeEligible: true,
      filingStatus: 'Married',
      federalAllowances: 2,
      stateAllowances: 2,
      additionalWithholding: 0,
    },
    {
      id: '7',
      name: 'Robert Taylor',
      photoUrl: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=F3F4F6&color=374151',
      position: 'Laser Tech',
      locations: ['Westside Wellness'],
      employmentType: 'Hourly',
      payRate: 30.00,
      payFrequency: 'Bi-weekly',
      bankAccount: '****6789',
      overtimeEligible: true,
      filingStatus: 'Single',
      federalAllowances: 1,
      stateAllowances: 1,
      additionalWithholding: 0,
    },
    {
      id: '8',
      name: 'Lisa Anderson',
      photoUrl: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=F3F4F6&color=374151',
      position: 'Manager',
      locations: ['Downtown Med Spa'],
      employmentType: 'Salaried',
      payRate: 130000,
      payFrequency: 'Bi-weekly',
      bankAccount: '****0123',
      overtimeEligible: false,
      filingStatus: 'Head of Household',
      federalAllowances: 2,
      stateAllowances: 2,
      additionalWithholding: 100,
    },
  ]);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || emp.employmentType.toLowerCase() === typeFilter;
    // Handle both old mock data (locations array) and new structure (employee_locations)
    const matchesLocation = locationFilter === 'all' || 
      (emp.employee_locations?.some(el => el.location_id === locationFilter) || 
       emp.locations?.some(loc => loc.includes(locationFilter)));
    return matchesSearch && matchesType && matchesLocation;
  });

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee({ ...employee });
    setIsModalOpen(true);
  };

  const handleSaveChanges = () => {
    toast({
      title: 'Success',
      description: 'Payroll settings updated successfully',
    });
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleAddEmployee = () => {
    toast({
      title: 'Not Available',
      description: 'Please add employees in Admin portal',
      variant: 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Payroll Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage employee compensation and payroll information
          </p>
        </div>
        <Button onClick={handleAddEmployee} className="bg-gray-400 hover:bg-gray-500">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New Employee
        </Button>
      </div>

      {/* Filters */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="salaried">Salaried</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Downtown">Downtown Med Spa</SelectItem>
                <SelectItem value="Westside">Westside Wellness</SelectItem>
                <SelectItem value="Uptown">Uptown Beauty</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardContent className="p-0">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 hover:bg-gray-50">
                  <TableHead className="font-semibold">Employee</TableHead>
                  <TableHead className="font-semibold">Position</TableHead>
                  <TableHead className="font-semibold">Location(s)</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Pay Rate/Salary</TableHead>
                  <TableHead className="font-semibold">Pay Frequency</TableHead>
                  <TableHead className="font-semibold">Bank Account</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={emp.photoUrl} alt={emp.name} />
                          <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                            {emp.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{emp.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{emp.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {emp.locations.map((loc, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {loc}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={emp.employmentType === 'Hourly' 
                          ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' 
                          : 'bg-green-100 text-green-800 hover:bg-green-100'
                        }
                      >
                        {emp.employmentType}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {emp.employmentType === 'Hourly' 
                        ? `$${emp.payRate.toFixed(2)}/hr`
                        : `$${emp.payRate.toLocaleString()}/yr`
                      }
                    </TableCell>
                    <TableCell className="text-gray-600">{emp.payFrequency}</TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">{emp.bankAccount}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(emp)}
                        className="h-8"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
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
        Showing {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
      </div>

      {/* Edit Payroll Settings Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Payroll Settings</DialogTitle>
          </DialogHeader>

          {editingEmployee && (
            <div className="space-y-6 py-4">
              {/* Employee Name */}
              <div>
                <Label className="text-base font-semibold text-gray-900">
                  {editingEmployee.name}
                </Label>
                <p className="text-sm text-gray-500 mt-1">{editingEmployee.position}</p>
              </div>

              {/* Employment Type */}
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select 
                  value={editingEmployee.employmentType} 
                  onValueChange={(value) => setEditingEmployee({
                    ...editingEmployee, 
                    employmentType: value as 'Hourly' | 'Salaried'
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                    <SelectItem value="Salaried">Salaried</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Hourly Rate Section */}
              {editingEmployee.employmentType === 'Hourly' && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <Label>Hourly Rate</Label>
                    <Input
                      type="number"
                      value={editingEmployee.payRate}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        payRate: parseFloat(e.target.value)
                      })}
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Overtime Rate (1.5x)</Label>
                    <Input
                      type="text"
                      value={`$${(editingEmployee.payRate * 1.5).toFixed(2)}`}
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="overtime-eligible">Overtime Eligible</Label>
                    <Switch
                      id="overtime-eligible"
                      checked={editingEmployee.overtimeEligible}
                      onCheckedChange={(checked) => setEditingEmployee({
                        ...editingEmployee,
                        overtimeEligible: checked
                      })}
                    />
                  </div>
                </div>
              )}

              {/* Salaried Section */}
              {editingEmployee.employmentType === 'Salaried' && (
                <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="space-y-2">
                    <Label>Annual Salary</Label>
                    <Input
                      type="number"
                      value={editingEmployee.payRate}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        payRate: parseFloat(e.target.value)
                      })}
                      step="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pay Frequency</Label>
                    <Select 
                      value={editingEmployee.payFrequency}
                      onValueChange={(value) => setEditingEmployee({
                        ...editingEmployee,
                        payFrequency: value
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="exempt-overtime">Exempt from Overtime</Label>
                    <Switch
                      id="exempt-overtime"
                      checked={!editingEmployee.overtimeEligible}
                      onCheckedChange={(checked) => setEditingEmployee({
                        ...editingEmployee,
                        overtimeEligible: !checked
                      })}
                    />
                  </div>
                </div>
              )}

              {/* Bank Information */}
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900">Bank Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Account Number</Label>
                    <Input
                      type="text"
                      value={editingEmployee.bankAccount}
                      disabled
                      className="bg-gray-100 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Routing Number</Label>
                    <Input
                      type="text"
                      value="****5678"
                      disabled
                      className="bg-gray-100 font-mono"
                    />
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Update Bank Info
                </Button>
              </div>

              {/* Tax Withholding */}
              <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900">Tax Withholding</h3>
                <div className="space-y-2">
                  <Label>Filing Status</Label>
                  <Select 
                    value={editingEmployee.filingStatus}
                    onValueChange={(value) => setEditingEmployee({
                      ...editingEmployee,
                      filingStatus: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married Filing Jointly</SelectItem>
                      <SelectItem value="Head of Household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Federal Allowances</Label>
                    <Input
                      type="number"
                      value={editingEmployee.federalAllowances}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        federalAllowances: parseInt(e.target.value)
                      })}
                      min="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>State Allowances</Label>
                    <Input
                      type="number"
                      value={editingEmployee.stateAllowances}
                      onChange={(e) => setEditingEmployee({
                        ...editingEmployee,
                        stateAllowances: parseInt(e.target.value)
                      })}
                      min="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Additional Withholding</Label>
                  <Input
                    type="number"
                    value={editingEmployee.additionalWithholding}
                    onChange={(e) => setEditingEmployee({
                      ...editingEmployee,
                      additionalWithholding: parseFloat(e.target.value)
                    })}
                    step="0.01"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button 
                  onClick={handleSaveChanges}
                  className="bg-[#3498DB] hover:bg-[#2980B9] text-white flex-1"
                >
                  Save Changes
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayrollEmployees;
