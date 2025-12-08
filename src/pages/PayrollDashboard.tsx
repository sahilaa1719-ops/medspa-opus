import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  DollarSign, 
  FileText, 
  Clock, 
  Play,
  Upload,
  CheckCircle,
  FileCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';

const PayrollDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Current Pay Period Banner */}
      <Card className="border-2 border-[#3498DB] bg-gradient-to-r from-white to-blue-50 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Current Pay Period: November 16 - 30, 2024</h2>
                <Badge className="bg-[#F39C12] text-white hover:bg-[#F39C12]">
                  In Progress
                </Badge>
              </div>
              <p className="text-lg text-gray-700 mb-4">
                Pay Date: <span className="font-semibold">December 5, 2024</span>
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Processing Status</span>
                  <span className="font-semibold text-gray-900">7 of 47 employees processed</span>
                </div>
                <Progress value={15} className="h-3" />
              </div>
            </div>

            <div className="ml-6">
              <Button 
                size="lg"
                className="bg-[#3498DB] hover:bg-[#2980B9] text-white text-lg px-8 py-6 h-auto"
              >
                <Play className="h-6 w-6 mr-2" />
                Continue Payroll Run
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">47</p>
                <p className="text-xs text-gray-500 mt-1">Active employees</p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                <Users className="h-6 w-6 text-[#3498DB]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Payroll Amount */}
        <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Payroll Amount</p>
                <p className="text-3xl font-bold text-[#27AE60]">$156,240</p>
                <p className="text-xs text-gray-500 mt-1">For current period</p>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <DollarSign className="h-6 w-6 text-[#27AE60]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pay Stubs Generated */}
        <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pay Stubs Generated</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-gray-900">7</p>
                  <span className="text-xl text-gray-400">/ 47</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">35 remaining</p>
                  <Badge className="bg-[#F39C12] text-white hover:bg-[#F39C12] text-xs px-1.5 py-0">
                    Incomplete
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
                <FileText className="h-6 w-6 text-[#F39C12]" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hours Pending Review */}
        <Card className="border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Hours Pending Review</p>
                <p className="text-3xl font-bold text-[#E74C3C]">12</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">Need approval</p>
                  <Badge className="bg-[#E74C3C] text-white hover:bg-[#E74C3C] text-xs px-1.5 py-0">
                    Urgent
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Clock className="h-6 w-6 text-[#E74C3C]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Process Payroll */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Process Payroll</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start h-12 bg-[#3498DB] hover:bg-[#2980B9] text-white text-base"
              size="lg"
            >
              <Play className="h-5 w-5 mr-3" />
              Start New Payroll Run
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-gray-300 text-base"
              size="lg"
            >
              <Upload className="h-5 w-5 mr-3 text-gray-600" />
              Import Time Data
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-gray-300 text-base"
              size="lg"
            >
              <CheckCircle className="h-5 w-5 mr-3 text-gray-600" />
              Review & Approve Hours
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start h-12 border-gray-300 text-base"
              size="lg"
            >
              <FileCheck className="h-5 w-5 mr-3 text-gray-600" />
              Generate All Pay Stubs
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 flex-shrink-0 mt-0.5">
                  <FileText className="h-4 w-4 text-[#27AE60]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Pay stub generated for Sarah Johnson</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-[#3498DB]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Overtime approved for Michael Chen</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 flex-shrink-0 mt-0.5">
                  <Upload className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Tax document uploaded</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 flex-shrink-0 mt-0.5">
                  <Clock className="h-4 w-4 text-[#F39C12]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Hours imported from timesheet</p>
                  <p className="text-xs text-gray-500">Yesterday</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-green-100 flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-4 w-4 text-[#27AE60]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Payroll run completed for Nov 1-15</p>
                  <p className="text-xs text-gray-500">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Tasks and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#F39C12]" />
              <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Alert className="bg-red-50 border-red-200">
              <AlertDescription className="flex items-center gap-2 text-sm">
                <span className="text-lg">🔴</span>
                <span className="text-red-900">
                  <strong>Review 12 overtime hours</strong> (Due today)
                </span>
              </AlertDescription>
            </Alert>

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertDescription className="flex items-center gap-2 text-sm">
                <span className="text-lg">🟡</span>
                <span className="text-yellow-900">
                  <strong>Generate remaining 35 pay stubs</strong> (Due Dec 3)
                </span>
              </AlertDescription>
            </Alert>

            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="flex items-center gap-2 text-sm">
                <span className="text-lg">🟢</span>
                <span className="text-green-900">
                  <strong>Upload W-2 forms</strong> (Due Jan 31, 2025)
                </span>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Payroll Calendar */}
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#3498DB]" />
              <CardTitle className="text-lg font-semibold">Payroll Calendar</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-l-4 border-[#3498DB] rounded">
                <p className="text-sm font-semibold text-gray-900">Current Pay Period</p>
                <p className="text-sm text-gray-700 mt-1">November 16 - 30, 2024</p>
              </div>

              <div className="p-4 bg-green-50 border-l-4 border-[#27AE60] rounded">
                <p className="text-sm font-semibold text-gray-900">Next Pay Date</p>
                <p className="text-sm text-gray-700 mt-1">December 5, 2024</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-900">Upcoming Deadlines</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Overtime approval</span>
                    <span className="text-red-600 font-medium">Today</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Pay stub generation</span>
                    <span className="text-orange-600 font-medium">Dec 3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Next payroll run</span>
                    <span className="text-gray-600 font-medium">Dec 16</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollDashboard;
