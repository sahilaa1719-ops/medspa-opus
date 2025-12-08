import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success && result.role) {
        toast.success('Welcome back!');
        
        // Redirect based on user role
        if (result.role === 'admin') {
          navigate('/dashboard'); // Admin portal
        } else if (result.role === 'payroll') {
          navigate('/payroll-dashboard'); // Payroll portal
        } else if (result.role === 'employee') {
          navigate('/employee-dashboard'); // Employee portal
        }
      } else {
        toast.error('Invalid email or password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg border border-[#E5E7EB] bg-white p-8 shadow-sm">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gray-100">
              <Sparkles className="h-7 w-7 text-[#6B7280]" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-card-foreground">MedSpa Pro</h1>
            <p className="mt-1 text-sm text-muted-foreground">Employee Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@medspa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                Remember me
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 rounded-lg bg-muted/50 p-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Admin Portal:</p>
                <p className="text-sm text-card-foreground">
                  <span className="font-mono">admin@medspa.com</span> / <span className="font-mono">admin123</span>
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground">Payroll Portal:</p>
                <p className="text-sm text-card-foreground">
                  <span className="font-mono">payroll@medspa.com</span> / <span className="font-mono">payroll123</span>
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-muted-foreground">Employee Portal:</p>
                <p className="text-sm text-card-foreground">
                  <span className="font-mono">employee@medspa.com</span> / <span className="font-mono">employee123</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
