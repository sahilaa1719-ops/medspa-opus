import { Users, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/ui/stats-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { useData } from '@/context/DataContext';
import { useLicenseStatus } from '@/hooks/useLicenseStatus';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const { employees, licenses, locations } = useData();
  const { getLicenseStatus, getExpirationText, getDaysRemaining } = useLicenseStatus();

  const activeEmployees = employees.filter((e) => e.status === 'active');
  const today = new Date();
  
  const activeLicenses = licenses.filter((l) => new Date(l.expiryDate) > today);
  const expiringLicenses = licenses.filter((l) => {
    const days = getDaysRemaining(new Date(l.expiryDate));
    return days >= 0 && days <= 30;
  });
  const expiredLicenses = licenses.filter((l) => new Date(l.expiryDate) < today);

  const upcomingExpirations = licenses
    .filter((l) => getDaysRemaining(new Date(l.expiryDate)) <= 30)
    .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
    .slice(0, 5);

  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getEmployeeById = (id: string) => employees.find((e) => e.id === id);
  const getLocationById = (id: string) => locations.find((l) => l.id === id);

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />
      
      <div className="p-4 lg:p-6">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Employees"
            value={activeEmployees.length}
            icon={Users}
            variant="default"
          />
          <StatsCard
            title="Active Licenses"
            value={activeLicenses.length}
            icon={CheckCircle}
            variant="success"
          />
          <StatsCard
            title="Expiring Soon"
            value={expiringLicenses.length}
            icon={AlertTriangle}
            variant="warning"
          />
          <StatsCard
            title="Expired Licenses"
            value={expiredLicenses.length}
            icon={XCircle}
            variant="danger"
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Recent Activity */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground">Recent Employees</h2>
            <div className="mt-4 space-y-4">
              {recentEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={employee.photoUrl} alt={employee.fullName} />
                    <AvatarFallback className="bg-gray-100 text-gray-700">
                      {employee.fullName.split(' ').map((n) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {employee.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">{employee.position}</p>
                  </div>
                  <StatusBadge status={employee.status}>
                    {employee.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Expirations */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground">Upcoming Expirations</h2>
            <div className="mt-4 space-y-4">
              {upcomingExpirations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No licenses expiring soon</p>
              ) : (
                upcomingExpirations.map((license) => {
                  const employee = getEmployeeById(license.employeeId);
                  const status = getLicenseStatus(new Date(license.expiryDate));

                  return (
                    <div key={license.id} className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={employee?.photoUrl} alt={employee?.fullName} />
                        <AvatarFallback className="bg-gray-100 text-gray-700">
                          {employee?.fullName?.split(' ').map((n) => n[0]).join('') || 'NA'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {employee?.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {license.licenseType} • {employee?.position || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={status}>
                          {getExpirationText(new Date(license.expiryDate))}
                        </StatusBadge>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {format(new Date(license.expiryDate), 'MMM d, yyyy')}
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
