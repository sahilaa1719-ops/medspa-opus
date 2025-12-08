import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();

  const handleClearData = () => {
    localStorage.removeItem('medspa_employees');
    localStorage.removeItem('medspa_locations');
    localStorage.removeItem('medspa_licenses');
    localStorage.removeItem('medspa_documents');
    toast.success('Data reset to defaults. Refresh to see changes.');
  };

  return (
    <div className="min-h-screen">
      <Header title="Settings" />

      <div className="p-4 lg:p-6">
        <div className="max-w-2xl space-y-6">
          {/* Profile Settings */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground">Profile Settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your account settings and preferences
            </p>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email || ''} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={user?.name || ''} disabled />
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="rounded-lg border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-card-foreground">Data Management</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your application data
            </p>

            <div className="mt-6">
              <Button variant="outline" onClick={handleClearData} className="text-destructive hover:text-destructive">
                Reset to Default Data
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">
                This will clear all custom data and restore the default sample data.
              </p>
            </div>
          </div>

          {/* About */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-card-foreground">About</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              MedSpa Pro Employee Management System
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
