import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users,
  FileText, 
  Clock, 
  Receipt,
  BarChart,
  Settings, 
  LogOut,
  Sparkles,
  Play,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const navItems = [
  { to: '/payroll-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/payroll-run', icon: Play, label: 'Run Payroll' },
  { to: '/payroll-employees', icon: Users, label: 'Employees' },
  { to: '/payroll-paystubs', icon: FileText, label: 'Pay Stubs' },
  { to: '/payroll-timeentry', icon: Clock, label: 'Time Entry' },
  { to: '/payroll-taxes', icon: Receipt, label: 'Tax Documents' },
  { to: '/payroll-reports', icon: BarChart, label: 'Reports' },
  { to: '/payroll-settings', icon: Settings, label: 'Settings' },
];

const PayrollSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-[#1A252F] bg-[#2C3E50] lg:block hidden">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 flex-col justify-center border-b border-[#1A252F] px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#34495E]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">MedSpa Pro</span>
              <span className="text-xs text-gray-300">Payroll Manager</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-[#34495E] text-white border-l-4 border-[#3498DB]'
                    : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-[#3498DB]" : "text-gray-400"
                  )} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-[#1A252F] p-3">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-gray-300 hover:bg-[#34495E] hover:text-white"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  );
};

const PayrollHeader = () => {
  const { user } = useAuth();
  const [payPeriod, setPayPeriod] = useState('nov-16-30-2024');

  const payPeriods = [
    { value: 'nov-16-30-2024', label: 'Nov 16 - Nov 30, 2024' },
    { value: 'nov-1-15-2024', label: 'Nov 1 - Nov 15, 2024' },
    { value: 'oct-16-31-2024', label: 'Oct 16 - Oct 31, 2024' },
    { value: 'oct-1-15-2024', label: 'Oct 1 - Oct 15, 2024' },
  ];

  return (
    <header className="fixed left-60 right-0 top-0 z-30 h-16 border-b border-[#E5E7EB] bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Page Title - will be overridden by page content */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">Payroll Dashboard</h1>
        </div>

        {/* Center: Pay Period Selector */}
        <div className="flex-1 flex justify-center">
          <div className="w-64">
            <Select value={payPeriod} onValueChange={setPayPeriod}>
              <SelectTrigger className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {payPeriods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right: User Profile */}
        <div className="flex-1 flex justify-end">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || 'Payroll Manager'}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <Avatar className="h-10 w-10 bg-[#3498DB] border-2 border-[#3498DB]">
              <AvatarFallback className="bg-[#3498DB] text-white font-semibold">
                PM
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};

export const PayrollLayout = () => {
  return (
    <div className="min-h-screen bg-[#ECF0F1]">
      <PayrollSidebar />
      <PayrollHeader />
      <main className="ml-60 mt-16 p-6">
        <Outlet />
      </main>
    </div>
  );
};
