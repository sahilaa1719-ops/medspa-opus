import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  FileText, 
  Award, 
  Settings, 
  LogOut,
  Sparkles,
  Receipt
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/locations', icon: MapPin, label: 'Locations' },
  { to: '/documents', icon: FileText, label: 'Documents' },
  { to: '/licenses', icon: Award, label: 'Licenses' },
  { to: '/taxes', icon: Receipt, label: 'Taxes' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const { logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-[#F7F7F7] lg:block hidden">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100">
            <Sparkles className="h-5 w-5 text-[#6B7280]" />
          </div>
          <span className="text-lg font-bold text-foreground">MedSpa Pro</span>
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
                    ? 'bg-white text-gray-900 border-l-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-200'
                )
              }
            >
              <item.icon className="h-5 w-5 text-[#6B7280]" />
              {item.label}
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
