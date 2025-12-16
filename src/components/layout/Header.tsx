import { Bell, User, Menu, AlertTriangle, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

interface ExpiringLicense {
  id: string;
  license_type: string;
  license_number: string;
  expiry_date: string;
  daysUntilExpiry: number;
  employees: {
    first_name: string;
    last_name: string;
  };
}

export const Header = ({ title }: HeaderProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [expiringLicenses, setExpiringLicenses] = useState<ExpiringLicense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch for admin/payroll users
    if (user?.role === 'admin' || user?.role === 'payroll') {
      fetchExpiringLicenses();
    }
  }, [user?.role]);

  const fetchExpiringLicenses = async () => {
    try {
      setLoading(true);
      const today = new Date();
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(today.getDate() + 30);

      const { data, error } = await supabase
        .from('licenses')
        .select('*, employees(first_name, last_name)')
        .lte('expiry_date', thirtyDaysFromNow.toISOString())
        .order('expiry_date', { ascending: true });

      if (error) throw error;

      // Calculate days until expiry and filter out far past expired licenses
      const licensesWithDays = (data || []).map((license: any) => {
        const expiryDate = new Date(license.expiry_date);
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return {
          ...license,
          daysUntilExpiry
        };
      }).filter((license: any) => license.daysUntilExpiry >= -7); // Show expired within last 7 days

      setExpiringLicenses(licensesWithDays);
    } catch (error) {
      console.error('Error fetching expiring licenses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return 'text-red-600 bg-red-50'; // Expired
    if (daysUntilExpiry <= 7) return 'text-orange-600 bg-orange-50'; // Urgent
    if (daysUntilExpiry <= 30) return 'text-yellow-600 bg-yellow-50'; // Warning
    return 'text-gray-600 bg-gray-50';
  };

  const getUrgencyBadge = (daysUntilExpiry: number) => {
    if (daysUntilExpiry < 0) return <Badge variant="destructive" className="text-xs">Expired</Badge>;
    if (daysUntilExpiry <= 7) return <Badge className="text-xs bg-orange-500">Urgent</Badge>;
    if (daysUntilExpiry <= 30) return <Badge className="text-xs bg-yellow-500">Warning</Badge>;
    return null;
  };

  const formatDaysText = (days: number) => {
    if (days < 0) return `Expired ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
    if (days === 0) return 'Expires today';
    if (days === 1) return 'Expires tomorrow';
    return `Expires in ${days} days`;
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
        {(user?.role === 'admin' || user?.role === 'payroll') && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {expiringLicenses.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                    {expiringLicenses.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
              <div className="px-3 py-2 font-semibold text-sm border-b">
                License Expiry Notifications
              </div>
              {loading ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  Loading...
                </div>
              ) : expiringLicenses.length === 0 ? (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                  No expiring licenses
                </div>
              ) : (
                <>
                  {expiringLicenses.map((license) => (
                    <DropdownMenuItem 
                      key={license.id}
                      className={`px-3 py-3 cursor-pointer ${getUrgencyColor(license.daysUntilExpiry)}`}
                      onClick={() => navigate('/licenses')}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-sm">
                            {license.employees.first_name} {license.employees.last_name}
                          </span>
                          {getUrgencyBadge(license.daysUntilExpiry)}
                        </div>
                        <div className="text-xs opacity-90">
                          {license.license_type} • #{license.license_number}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium mt-1">
                          <Clock className="h-3 w-3" />
                          {formatDaysText(license.daysUntilExpiry)}
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(license.expiry_date).toLocaleDateString()}
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="px-3 py-2 cursor-pointer justify-center font-medium text-primary"
                    onClick={() => navigate('/licenses')}
                  >
                    View All Licenses
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">{user?.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
