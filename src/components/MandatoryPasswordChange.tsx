import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export const MandatoryPasswordChange = () => {
  const { user, updateUserFirstLogin } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  // Password validation
  const hasConsecutiveNumbers = (str: string) => {
    for (let i = 0; i < str.length - 2; i++) {
      const char1 = str[i];
      const char2 = str[i + 1];
      const char3 = str[i + 2];
      
      if (/\d/.test(char1) && /\d/.test(char2) && /\d/.test(char3)) {
        const num1 = parseInt(char1);
        const num2 = parseInt(char2);
        const num3 = parseInt(char3);
        
        // Check for ascending sequence (123, 234, etc.)
        if (num2 === num1 + 1 && num3 === num2 + 1) return true;
        // Check for descending sequence (321, 432, etc.)
        if (num2 === num1 - 1 && num3 === num2 - 1) return true;
      }
    }
    return false;
  };

  const passwordValidation = {
    minLength: newPassword.length >= 8,
    maxLength: newPassword.length <= 16,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    noConsecutiveNumbers: !hasConsecutiveNumbers(newPassword),
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean) && newPassword === confirmPassword && newPassword.length > 0;

  const handleChangePassword = async () => {
    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    setIsChanging(true);
    try {
      console.log('Attempting to update password for:', user?.email);
      
      // Update password and user metadata using Supabase Auth
      const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
        data: {
          role: user?.role,
          name: user?.name,
          is_first_login: false
        }
      });

      console.log('Password update result:', { data: updateData, error: updateError });

      if (updateError) {
        console.error('Password update error:', updateError);
        toast.error(`Failed to update password: ${updateError.message}`);
        setIsChanging(false);
        return;
      }

      console.log('Password updated successfully');
      toast.success('Password changed successfully! You can now access your account.');
      updateUserFirstLogin(false);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An error occurred while changing password');
    } finally {
      setIsChanging(false);
    }
  };

  // Only show if user is logged in and it's their first login
  if (!user || !user.isFirstLogin) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-xl">Mandatory Password Change</DialogTitle>
          <DialogDescription>
            For security reasons, you must change your password before accessing your account.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Requirements Checklist */}
            {newPassword && (
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  {passwordValidation.minLength ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className={passwordValidation.minLength ? "text-green-600" : "text-red-600"}>
                    Minimum 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.maxLength ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className={passwordValidation.maxLength ? "text-green-600" : "text-red-600"}>
                    Maximum 16 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasUpperCase ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className={passwordValidation.hasUpperCase ? "text-green-600" : "text-red-600"}>
                    At least 1 uppercase letter
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.hasSpecialChar ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className={passwordValidation.hasSpecialChar ? "text-green-600" : "text-red-600"}>
                    At least 1 special character
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {passwordValidation.noConsecutiveNumbers ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <X className="h-4 w-4 text-red-600" />
                  )}
                  <span className={passwordValidation.noConsecutiveNumbers ? "text-green-600" : "text-red-600"}>
                    No sequential numbers (e.g., 123, 456, 321)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <X className="h-4 w-4" />
                Passwords do not match
              </p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <Check className="h-4 w-4" />
                Passwords match
              </p>
            )}
          </div>

          <Button 
            onClick={handleChangePassword}
            disabled={!isPasswordValid || isChanging}
            className="w-full"
          >
            {isChanging ? 'Changing Password...' : 'Change Password & Continue'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
