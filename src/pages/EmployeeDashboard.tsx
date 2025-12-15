import { useState, useEffect } from 'react';
import { FileText, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/ui/stats-card';
import { supabase } from '@/lib/supabase';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documentsCount: 0,
    licensesCount: 0,
    expiringLicenses: 0,
    profileCompletion: 0,
  });
  const [employeeData, setEmployeeData] = useState<any>(null);

  useEffect(() => {
    if (user?.email) {
      fetchDashboardData();
    }
  }, [user?.email]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch employee data by email
      const { data: employee, error: empError } = await supabase
        .from('employees')
        .select('*')
        .eq('email', user?.email)
        .single();

      if (empError) {
        console.error('Error fetching employee:', empError);
        setLoading(false);
        return;
      }

      setEmployeeData(employee);

      // Fetch documents count
      const { count: docsCount, error: docsError } = await supabase
        .from('documents')
        .select('*', { count: 'exact', head: true })
        .eq('employee_id', employee.id);

      // Fetch licenses count
      const { count: licensesCount, error: licensesError } = await supabase
        .from('licenses')
        .select('*', { count: 'exact', head: true })
        .eq('employee_id', employee.id);

      // Fetch expiring licenses (within 30 days)
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const { data: expiringLicenses, error: expiringError } = await supabase
        .from('licenses')
        .select('*')
        .eq('employee_id', employee.id)
        .gte('expiry_date', today.toISOString())
        .lte('expiry_date', thirtyDaysFromNow.toISOString());

      // Calculate profile completion percentage
      const requiredFields = [
        employee.full_name,
        employee.email,
        employee.phone,
        employee.position,
        employee.hire_date,
        employee.emergency_contact_name,
        employee.emergency_contact_phone,
        employee.emergency_contact_relationship,
      ];
      const filledFields = requiredFields.filter(field => field && field.toString().trim() !== '').length;
      const completionPercentage = Math.round((filledFields / requiredFields.length) * 100);

      setStats({
        documentsCount: docsCount || 0,
        licensesCount: licensesCount || 0,
        expiringLicenses: expiringLicenses?.length || 0,
        profileCompletion: completionPercentage,
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {employeeData?.full_name || user?.name || 'Employee User'}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's a quick overview of your employee information and status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Documents Uploaded"
          value={loading ? '...' : stats.documentsCount}
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Active Licenses"
          value={loading ? '...' : stats.licensesCount}
          icon={Award}
          variant="success"
        />
        <StatsCard
          title="Profile Completion"
          value={loading ? '...' : `${stats.profileCompletion}%`}
          icon={CheckCircle}
          variant="success"
        />
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Licenses Expiring Soon</p>
              <p className="mt-1 text-3xl font-bold text-red-600">
                {loading ? '...' : stats.expiringLicenses}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
