import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User,
  FileText, 
  Award, 
  Bell,
  DollarSign,
  Receipt,
  Settings, 
  LogOut,
  Sparkles,
  Menu
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  { to: '/employee-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employee-profile', icon: User, label: 'My Profile' },
  { to: '/employee-documents', icon: FileText, label: 'My Documents' },
  { to: '/employee-licenses', icon: Award, label: 'My Licenses' },
  { to: '/employee-announcements', icon: Bell, label: 'Announcements' },
  { to: '/employee-payroll', icon: DollarSign, label: 'Payroll Info' },
  { to: '/employee-taxes', icon: Receipt, label: 'Taxes' },
  { to: '/employee-settings', icon: Settings, label: 'Settings' },
];

const EmployeeSidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-[#F7F7F7] lg:block hidden">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 flex-col justify-center border-b border-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
              <Sparkles className="h-5 w-5 text-[#6B7280]" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground">MedSpa Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              Employee Portal
            </Badge>
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
                    ? 'bg-white text-gray-900 border-l-4 border-blue-500 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-200'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-blue-500" : "text-[#6B7280]"
                  )} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-300 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 text-[#6B7280]" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

const EmployeeHeader = ({ title }: { title: string }) => {
  const { user, logout } = useAuth();

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#E5E7EB] bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5 text-[#6B7280]" />
        </Button>
        <h1 className="text-lg lg:text-xl font-bold text-foreground">{title}</h1>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold text-sm">
              {user?.name ? getInitials(user.name) : 'EU'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-medium text-foreground">{user?.name || 'Employee User'}</span>
            <span className="text-xs text-muted-foreground">Employee</span>
          </div>
        </div>
      </div>
    </header>
  );
};

interface EmployeeLayoutProps {
  title?: string;
}

export const EmployeeLayout = ({ title = 'Dashboard' }: EmployeeLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <EmployeeSidebar />
      <main className="lg:ml-64">
        <EmployeeHeader title={title} />
        <div className="p-4 lg:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
