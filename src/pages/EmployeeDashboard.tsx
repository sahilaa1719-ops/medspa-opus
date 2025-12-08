import { FileText, Award, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { StatsCard } from '@/components/ui/stats-card';

const EmployeeDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name || 'Employee User'}!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Here's a quick overview of your employee information and status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Documents Uploaded"
          value={8}
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="Active Licenses"
          value={3}
          icon={Award}
          variant="success"
        />
        <StatsCard
          title="Profile Completion"
          value="85%"
          icon={CheckCircle}
          variant="success"
        />
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Items Needing Attention</p>
              <p className="mt-1 text-3xl font-bold text-red-600">2</p>
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
