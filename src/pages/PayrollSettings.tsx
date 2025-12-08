import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
  Building2, 
  Calendar, 
  Receipt, 
  DollarSign, 
  Clock, 
  CreditCard,
  Bell,
  Link2,
  Shield,
  Database,
  Plus,
  Edit,
  Trash2,
  Save,
  ExternalLink,
  FileSpreadsheet,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const PayrollSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('company');
  
  // Company Info
  const [street, setStreet] = useState('123 Main Street');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zip, setZip] = useState('10001');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [email, setEmail] = useState('payroll@medspa.com');

  // Pay Schedule
  const [payFrequency, setPayFrequency] = useState('bi-weekly');
  const [defaultPayDay, setDefaultPayDay] = useState('5');

  // Tax Settings
  const [primaryState, setPrimaryState] = useState('NY');
  const [stateTaxRate, setStateTaxRate] = useState('6.5');

  // Deductions
  const [healthInsurance, setHealthInsurance] = useState('150.00');
  const [enable401k, setEnable401k] = useState(true);
  const [contribution401k, setContribution401k] = useState('5');
  const [companyMatch, setCompanyMatch] = useState('3');

  const [deductions] = useState([
    { id: '1', name: 'Dental Insurance', amount: '$25.00', frequency: 'Per pay period', active: true },
    { id: '2', name: 'Vision Insurance', amount: '$10.00', frequency: 'Per pay period', active: true },
    { id: '3', name: 'HSA Contribution', amount: 'Variable', frequency: 'Per pay period', active: true },
    { id: '4', name: 'Parking Fee', amount: '$50.00', frequency: 'Monthly', active: false },
  ]);

  // Overtime
  const [dailyOT, setDailyOT] = useState('8');
  const [weeklyOT, setWeeklyOT] = useState('40');
  const [doubleTimeDaily, setDoubleTimeDaily] = useState('12');
  const [otRate, setOtRate] = useState('1.5');
  const [doubleTimeRate, setDoubleTimeRate] = useState('2.0');

  // Direct Deposit
  const [enableDirectDeposit, setEnableDirectDeposit] = useState(true);
  const [requireBankVerification, setRequireBankVerification] = useState(true);
  const [allowEmployeeUpdate, setAllowEmployeeUpdate] = useState(false);

  // Notifications
  const [notifyPayStub, setNotifyPayStub] = useState(true);
  const [notifyPayrollProcessed, setNotifyPayrollProcessed] = useState(true);
  const [notifyOvertime, setNotifyOvertime] = useState(true);
  const [notifyMissingTimesheet, setNotifyMissingTimesheet] = useState(true);
  const [notifyTaxDeadline, setNotifyTaxDeadline] = useState(true);
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState(false);

  // Security
  const [passwordExpiry, setPasswordExpiry] = useState('90');
  const [minPasswordLength, setMinPasswordLength] = useState('8');
  const [require2FA, setRequire2FA] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const auditLog = [
    { action: 'Pay stubs generated for 8 employees', time: '2 hours ago', user: 'payroll@medspa.com' },
    { action: 'Employee pay rate updated', time: 'Yesterday', user: 'payroll@medspa.com' },
    { action: 'Tax document uploaded', time: '2 days ago', user: 'payroll@medspa.com' },
  ];

  const handleUpdateCompanyInfo = () => {
    toast({
      title: 'Company Info Updated',
      description: 'Company information has been saved successfully',
    });
  };

  const handleUpdatePaySchedule = () => {
    toast({
      title: 'Pay Schedule Updated',
      description: 'Pay schedule settings have been saved',
    });
  };

  const handleUpdateTaxSettings = () => {
    toast({
      title: 'Tax Settings Updated',
      description: 'Tax configuration has been saved',
    });
  };

  const handleUpdateDeductions = () => {
    toast({
      title: 'Deductions Updated',
      description: 'Deduction settings have been saved',
    });
  };

  const handleUpdateOTRules = () => {
    toast({
      title: 'Overtime Rules Updated',
      description: 'Overtime calculation settings have been saved',
    });
  };

  const handleUpdateDirectDeposit = () => {
    toast({
      title: 'Direct Deposit Updated',
      description: 'Direct deposit settings have been saved',
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: 'Notifications Saved',
      description: 'Email notification preferences have been updated',
    });
  };

  const handleBackupNow = () => {
    toast({
      title: 'Backup Started',
      description: 'Creating backup of payroll data...',
    });
  };

  const handleExportData = () => {
    toast({
      title: 'Exporting Data',
      description: 'Preparing payroll data export...',
    });
  };

  const handleConnect = (service: string) => {
    toast({
      title: 'Coming Soon',
      description: `${service} integration will be available soon`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payroll Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure payroll system settings and preferences
        </p>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="company" className="text-xs">Company</TabsTrigger>
          <TabsTrigger value="schedule" className="text-xs">Schedule</TabsTrigger>
          <TabsTrigger value="tax" className="text-xs">Tax</TabsTrigger>
          <TabsTrigger value="deductions" className="text-xs">Deductions</TabsTrigger>
          <TabsTrigger value="overtime" className="text-xs">Overtime</TabsTrigger>
          <TabsTrigger value="deposit" className="text-xs">Deposit</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">Alerts</TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs">Connect</TabsTrigger>
          <TabsTrigger value="security" className="text-xs">Security</TabsTrigger>
          <TabsTrigger value="data" className="text-xs">Data</TabsTrigger>
        </TabsList>

        {/* COMPANY INFORMATION */}
        <TabsContent value="company" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-[#3498DB]" />
                <CardTitle>Company Information</CardTitle>
              </div>
              <CardDescription>Basic company details for payroll processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <Input value="MedSpa Pro" disabled className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Tax ID (EIN)</label>
                  <Input value="**-*****234" disabled className="bg-gray-50 font-mono" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Street Address</label>
                <Input value={street} onChange={(e) => setStreet(e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State</label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ZIP Code</label>
                  <Input value={zip} onChange={(e) => setZip(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleUpdateCompanyInfo} className="bg-[#3498DB] hover:bg-[#2980B9] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Update Company Info
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PAY SCHEDULE */}
        <TabsContent value="schedule" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#27AE60]" />
                <CardTitle>Pay Schedule</CardTitle>
              </div>
              <CardDescription>Configure default pay periods and schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Default Pay Frequency</label>
                <Select value={payFrequency} onValueChange={setPayFrequency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="bi-weekly">Bi-Weekly</SelectItem>
                    <SelectItem value="semi-monthly">Semi-Monthly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Current Pay Period</p>
                  <p className="text-base font-semibold text-gray-900">Nov 16-30, 2024</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Pay Period</p>
                  <p className="text-base font-semibold text-gray-900">Dec 1-15, 2024</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Default Pay Day</label>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={defaultPayDay} 
                    onChange={(e) => setDefaultPayDay(e.target.value)}
                    className="w-20"
                  />
                  <span className="text-sm text-gray-600">days after period end</span>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Payroll Calendar</p>
                <p className="text-sm text-gray-500">Calendar view showing all pay periods and holidays for the year</p>
                <div className="mt-3 text-center py-8 bg-gray-50 rounded">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Calendar view coming soon</p>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleUpdatePaySchedule} className="bg-[#27AE60] hover:bg-[#229954] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Update Pay Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAX SETTINGS */}
        <TabsContent value="tax" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Receipt className="h-5 w-5 text-[#9B59B6]" />
                <CardTitle>Tax Settings</CardTitle>
              </div>
              <CardDescription>Configure federal, state, and local tax rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Federal Tax Rates</p>
                    <p className="text-xs text-gray-600 mt-1">Current federal tax brackets are set by IRS</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1">
                    IRS Resources
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">State Tax Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Primary State</label>
                      <Select value={primaryState} onValueChange={setPrimaryState}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State Tax Rate (%)</label>
                      <Input value={stateTaxRate} onChange={(e) => setStateTaxRate(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State Unemployment Tax</label>
                      <Input value="2.1%" disabled className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">State Disability Insurance</label>
                      <Input value="0.5%" disabled className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Local Taxes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Local Jurisdiction</label>
                    <Input placeholder="Enter if applicable" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Local Tax Rate (%)</label>
                    <Input placeholder="0.0" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleUpdateTaxSettings} className="bg-[#9B59B6] hover:bg-[#8E44AD] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Update Tax Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEDUCTIONS & BENEFITS */}
        <TabsContent value="deductions" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[#F39C12]" />
                <CardTitle>Deductions & Benefits</CardTitle>
              </div>
              <CardDescription>Configure standard deductions and retirement benefits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Health Insurance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Default Deduction</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">$</span>
                      <Input value={healthInsurance} onChange={(e) => setHealthInsurance(e.target.value)} />
                      <span className="text-sm text-gray-600">per pay period</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Apply to</label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All employees</SelectItem>
                        <SelectItem value="specific">Specific employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Retirement (401k)</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Enable 401k deductions</label>
                    <Switch checked={enable401k} onCheckedChange={setEnable401k} />
                  </div>
                  {enable401k && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Default Contribution (%)</label>
                        <Input value={contribution401k} onChange={(e) => setContribution401k(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Company Match (%)</label>
                        <Input value={companyMatch} onChange={(e) => setCompanyMatch(e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Other Deductions</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add New Deduction
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Frequency</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deductions.map((deduction) => (
                      <TableRow key={deduction.id}>
                        <TableCell className="font-medium">{deduction.name}</TableCell>
                        <TableCell>{deduction.amount}</TableCell>
                        <TableCell className="text-gray-600">{deduction.frequency}</TableCell>
                        <TableCell>
                          <Badge className={cn(deduction.active ? 'bg-[#27AE60] text-white hover:bg-[#27AE60]' : 'bg-gray-300 text-gray-700 hover:bg-gray-300')}>
                            {deduction.active ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Edit className="h-4 w-4 text-[#3498DB]" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <Trash2 className="h-4 w-4 text-[#E74C3C]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="pt-4">
                <Button onClick={handleUpdateDeductions} className="bg-[#F39C12] hover:bg-[#E67E22] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Update Deductions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* OVERTIME RULES */}
        <TabsContent value="overtime" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#E74C3C]" />
                <CardTitle>Overtime Rules</CardTitle>
              </div>
              <CardDescription>Configure overtime calculation thresholds and rates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Overtime Threshold</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Daily OT (hours)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">After</span>
                      <Input value={dailyOT} onChange={(e) => setDailyOT(e.target.value)} className="w-20" />
                      <span className="text-sm text-gray-600">hours</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Weekly OT (hours)</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">After</span>
                      <Input value={weeklyOT} onChange={(e) => setWeeklyOT(e.target.value)} className="w-20" />
                      <span className="text-sm text-gray-600">hours</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Double Time</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">After</span>
                      <Input value={doubleTimeDaily} onChange={(e) => setDoubleTimeDaily(e.target.value)} className="w-20" />
                      <span className="text-sm text-gray-600">hours</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Overtime Rates</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Regular OT Rate</label>
                    <div className="flex items-center gap-2">
                      <Input value={otRate} onChange={(e) => setOtRate(e.target.value)} className="w-20" />
                      <span className="text-sm text-gray-600">× (time and a half)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Double Time Rate</label>
                    <div className="flex items-center gap-2">
                      <Input value={doubleTimeRate} onChange={(e) => setDoubleTimeRate(e.target.value)} className="w-20" />
                      <span className="text-sm text-gray-600">×</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Weekend/Holiday Rates</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Saturday</span>
                    <span className="text-sm font-semibold text-gray-900">1.0× (regular)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Sunday</span>
                    <span className="text-sm font-semibold text-gray-900">1.5×</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Holidays</span>
                    <span className="text-sm font-semibold text-gray-900">2.0×</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleUpdateOTRules} className="bg-[#E74C3C] hover:bg-[#C0392B] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Update OT Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DIRECT DEPOSIT */}
        <TabsContent value="deposit" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#16A085]" />
                <CardTitle>Direct Deposit</CardTitle>
              </div>
              <CardDescription>Configure direct deposit and payment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Default Processing</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Enable Direct Deposit</label>
                    <Switch checked={enableDirectDeposit} onCheckedChange={setEnableDirectDeposit} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Backup Payment Method</label>
                      <Select defaultValue="check">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="check">Paper Check</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Direct Deposit Cut-off</label>
                      <Input value="2 days before payday" disabled className="bg-gray-50" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Bank Information Verification</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Require employees to verify bank info</label>
                    <Switch checked={requireBankVerification} onCheckedChange={setRequireBankVerification} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Allow employees to update bank info</label>
                    <Switch checked={allowEmployeeUpdate} onCheckedChange={setAllowEmployeeUpdate} />
                  </div>
                  {allowEmployeeUpdate && (
                    <p className="text-xs text-gray-500 italic">Updates require admin approval</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">ACH Settings (Read-Only)</h3>
                <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Bank Name</span>
                    <span className="text-sm font-medium text-gray-900">First National Bank</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Routing Transit Number</span>
                    <span className="text-sm font-mono font-medium text-gray-900">*****5678</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Company Account</span>
                    <span className="text-sm font-mono font-medium text-gray-900">******1234</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleUpdateDirectDeposit} className="bg-[#16A085] hover:bg-[#138D75] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Update Direct Deposit Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS */}
        <TabsContent value="notifications" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#F39C12]" />
                <CardTitle>Notifications</CardTitle>
              </div>
              <CardDescription>Configure email alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Email Notifications</h3>
                <p className="text-sm text-gray-600 mb-4">Send automatic emails for:</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={notifyPayStub} onCheckedChange={(checked) => setNotifyPayStub(checked as boolean)} />
                    <label className="text-sm text-gray-700">Pay stub available (to employees)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={notifyPayrollProcessed} onCheckedChange={(checked) => setNotifyPayrollProcessed(checked as boolean)} />
                    <label className="text-sm text-gray-700">Payroll processed (to admin)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={notifyOvertime} onCheckedChange={(checked) => setNotifyOvertime(checked as boolean)} />
                    <label className="text-sm text-gray-700">Overtime hours detected (to manager)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={notifyMissingTimesheet} onCheckedChange={(checked) => setNotifyMissingTimesheet(checked as boolean)} />
                    <label className="text-sm text-gray-700">Missing timesheet (to employees)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={notifyTaxDeadline} onCheckedChange={(checked) => setNotifyTaxDeadline(checked as boolean)} />
                    <label className="text-sm text-gray-700">Tax deadline reminders (to payroll manager)</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox checked={notifyWeeklySummary} onCheckedChange={(checked) => setNotifyWeeklySummary(checked as boolean)} />
                    <label className="text-sm text-gray-700">Weekly payroll summary (to admin)</label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Email Recipients</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Payroll Manager</label>
                    <Input value="payroll@medspa.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Admin</label>
                    <Input value="admin@medspa.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Accounting (Optional)</label>
                    <Input placeholder="accounting@medspa.com" type="email" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleSaveNotifications} className="bg-[#F39C12] hover:bg-[#E67E22] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* INTEGRATIONS */}
        <TabsContent value="integrations" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Link2 className="h-5 w-5 text-[#3498DB]" />
                <CardTitle>Integrations</CardTitle>
              </div>
              <CardDescription>Connect to external accounting and time tracking systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <FileSpreadsheet className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">QuickBooks</p>
                      <p className="text-sm text-gray-600">Status: Not Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">Coming Soon</Badge>
                    <Button variant="outline" onClick={() => handleConnect('QuickBooks')}>
                      Connect to QuickBooks
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">ADP</p>
                      <p className="text-sm text-gray-600">Status: Not Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">Coming Soon</Badge>
                    <Button variant="outline" onClick={() => handleConnect('ADP')}>
                      Connect to ADP
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Time Tracking</p>
                      <p className="text-sm text-gray-600">Status: Not Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gray-200 text-gray-700 hover:bg-gray-200">Coming Soon</Badge>
                    <Button variant="outline" onClick={() => handleConnect('Time Tracker')}>
                      Connect Time Tracker
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SECURITY */}
        <TabsContent value="security" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#E74C3C]" />
                <CardTitle>Security</CardTitle>
              </div>
              <CardDescription>Security settings for payroll access and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Password Policy</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Require password change every</label>
                      <div className="flex items-center gap-2">
                        <Input value={passwordExpiry} onChange={(e) => setPasswordExpiry(e.target.value)} className="w-20" />
                        <span className="text-sm text-gray-600">days</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Minimum password length</label>
                      <div className="flex items-center gap-2">
                        <Input value={minPasswordLength} onChange={(e) => setMinPasswordLength(e.target.value)} className="w-20" />
                        <span className="text-sm text-gray-600">characters</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Require 2-factor authentication</label>
                    <Switch checked={require2FA} onCheckedChange={setRequire2FA} />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Session Timeout</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Auto-logout after</label>
                  <div className="flex items-center gap-2">
                    <Input value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} className="w-20" />
                    <span className="text-sm text-gray-600">minutes of inactivity</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Audit Log</h3>
                  <Button variant="link" className="text-[#3498DB] p-0 h-auto">
                    View Full Audit Log →
                  </Button>
                </div>
                <div className="space-y-2">
                  {auditLog.map((log, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-900">{log.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.time} by {log.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* DATA & BACKUP */}
        <TabsContent value="data" className="space-y-4">
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-[#27AE60]" />
                <CardTitle>Data & Backup</CardTitle>
              </div>
              <CardDescription>Manage data exports, backups, and retention policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Export Data</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export All Payroll Data (CSV/Excel)
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Tax Documents (ZIP)
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Backup Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Backup</span>
                      <span className="text-sm font-medium text-gray-900">Dec 7, 2024 11:45 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Backup Frequency</span>
                      <span className="text-sm font-medium text-gray-900">Daily</span>
                    </div>
                  </div>
                  <Button onClick={handleBackupNow} className="bg-[#27AE60] hover:bg-[#229954] text-white">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Now
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Data Retention</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Keep payroll records for</label>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="5">5 years</SelectItem>
                        <SelectItem value="7">7 years (default)</SelectItem>
                        <SelectItem value="10">10 years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Archive old records automatically</label>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-[#3498DB] hover:bg-[#2980B9] text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollSettings;
