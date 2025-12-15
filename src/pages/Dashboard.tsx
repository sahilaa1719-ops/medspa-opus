import { useEffect, useState } from 'react';
import { Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/ui/stats-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentEmployees, setRecentEmployees] = useState<any[]>([]);
  const [upcomingExpirations, setUpcomingExpirations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeLicenses: 0,
    expiringSoon: 0,
    expired: 0
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch recent employees
      const { data: employeesData, error: empError } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (empError) throw empError;
      setRecentEmployees(employeesData || []);
      
      // Fetch licenses with expiration soon
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const { data: licensesData, error: licError } = await supabase
        .from('licenses')
        .select(`
          *,
          employees (
            id,
            full_name,
            photo_url,
            position
          )
        `)
        .gte('expiry_date', today)
        .lte('expiry_date', thirtyDaysLater)
        .order('expiry_date', { ascending: true })
        .limit(10);
      
      if (licError) throw licError;
      setUpcomingExpirations(licensesData || []);
      
      // Fetch counts for stats
      const { count: totalEmployees } = await supabase
        .from('employees')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      
      const { count: activeLicenses } = await supabase
        .from('licenses')
        .select('*', { count: 'exact', head: true })
        .gte('expiry_date', today);
      
      const { count: expiringSoon } = await supabase
        .from('licenses')
        .select('*', { count: 'exact', head: true })
        .gte('expiry_date', today)
        .lte('expiry_date', thirtyDaysLater);
      
      const { count: expired } = await supabase
        .from('licenses')
        .select('*', { count: 'exact', head: true })
        .lt('expiry_date', today);
      
      setStats({
        totalEmployees: totalEmployees || 0,
        activeLicenses: activeLicenses || 0,
        expiringSoon: expiringSoon || 0,
        expired: expired || 0
      });
      
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (expiryDate: string) => {
    return Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const getLicenseStatus = (expiryDate: string) => {
    const days = getDaysRemaining(expiryDate);
    if (days < 0) return 'expired';
    if (days <= 7) return 'critical';
    if (days <= 30) return 'warning';
    return 'active';
  };

  const getExpirationText = (expiryDate: string) => {
    const days = getDaysRemaining(expiryDate);
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `${days} days`;
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Dashboard" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header title="Dashboard" />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />
      
      <div className="p-4 lg:p-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Active Licenses"
            value={stats.activeLicenses}
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiringSoon}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Expired Licenses"
            value={stats.expired}
            icon={XCircle}
            variant="danger"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Employees</h2>
            <div className="mt-4 space-y-4">
              {recentEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No recent employees</p>
                </div>
              ) : (
                recentEmployees.map((employee) => {
                  const initials = employee.full_name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase() || 'NA';
                  
                  return (
                    <div key={employee.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={employee.photo_url} alt={employee.full_name} />
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {employee.full_name}
                        </p>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                      <StatusBadge status={employee.status}>
                        {employee.status}
                      </StatusBadge>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Expirations */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground">Upcoming Expirations</h2>
            <div className="mt-4 space-y-4">
              {upcomingExpirations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No licenses expiring soon</p>
                </div>
              ) : (
                upcomingExpirations.map((license) => {
                  const employee = license.employees;
                  const status = getLicenseStatus(license.expiry_date);
                  const daysRemaining = getDaysRemaining(license.expiry_date);
                  const initials = employee?.full_name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase() || 'NA';

                  return (
                    <div key={license.id} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee?.photo_url} alt={employee?.full_name} />
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {employee?.full_name || 'Unknown Employee'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {license.license_type} • {employee?.position || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={status}>
                          {getExpirationText(license.expiry_date)}
                        </StatusBadge>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(license.expiry_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
