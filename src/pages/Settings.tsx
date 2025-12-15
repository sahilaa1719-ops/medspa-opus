import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Plus, Trash2, FileText, Check, X, Eye, EyeOff, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Settings = () => {
  const { user } = useAuth();
  const [documentTypes, setDocumentTypes] = useState<string[]>([]);
  const [newDocType, setNewDocType] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState('');
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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

  // Load document types from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customDocumentTypes');
    if (saved) {
      setDocumentTypes(JSON.parse(saved));
    } else {
      // Default document types
      const defaults = [
        'Contract',
        'License Copy',
        'ID Copy',
        'Insurance',
        'Certification',
        'Policy',
        'Other',
      ];
      setDocumentTypes(defaults);
      localStorage.setItem('customDocumentTypes', JSON.stringify(defaults));
    }
  }, []);

  const saveDocumentTypes = (types: string[]) => {
    localStorage.setItem('customDocumentTypes', JSON.stringify(types));
    setDocumentTypes(types);
  };

  const handleAddDocType = () => {
    if (!newDocType.trim()) {
      toast.error('Please enter a document type name');
      return;
    }

    if (documentTypes.includes(newDocType.trim())) {
      toast.error('This document type already exists');
      return;
    }

    const updated = [...documentTypes, newDocType.trim()];
    saveDocumentTypes(updated);
    setNewDocType('');
    toast.success('Document type added successfully');
  };

  const handleDeleteClick = (type: string) => {
    setTypeToDelete(type);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    const updated = documentTypes.filter(t => t !== typeToDelete);
    saveDocumentTypes(updated);
    setDeleteConfirmOpen(false);
    setTypeToDelete('');
    toast.success('Document type removed successfully');
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Verify current password
      const { data: userData, error: verifyError } = await supabase
        .from('users')
        .select('password_hash')
        .eq('email', user?.email)
        .single();

      if (verifyError || !userData) {
        toast.error('Failed to verify current password');
        setIsChangingPassword(false);
        return;
      }

      if (userData.password_hash !== currentPassword) {
        toast.error('Current password is incorrect');
        setIsChangingPassword(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase
        .from('users')
        .update({ password_hash: newPassword })
        .eq('email', user?.email);

      if (updateError) {
        toast.error('Failed to update password');
      } else {
        toast.success('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (error) {
      toast.error('An error occurred while changing password');
    } finally {
      setIsChangingPassword(false);
    }
  };

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
          {/* Document Types Management */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Types Management
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Manage the document types available when adding employee documents
              </p>
            </CardHeader>
            <CardContent>
              {/* Add new document type */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter new document type..."
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDocType()}
                />
                <Button onClick={handleAddDocType}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {/* Document types list */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Current Document Types:</Label>
                {documentTypes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No document types configured</p>
                ) : (
                  <div className="border border-gray-200 rounded-lg divide-y">
                    {documentTypes.map((type) => (
                      <div
                        key={type}
                        className="flex items-center justify-between p-3 hover:bg-gray-50"
                      >
                        <span className="text-sm font-medium">{type}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(type)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

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

          {/* Change Password */}
          <Card className="border border-gray-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Change Password
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Update your account password
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                </div>
              </div>

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
                disabled={!isPasswordValid || isChangingPassword}
                className="w-full"
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </Button>
            </CardContent>
          </Card>

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document Type</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "<strong>{typeToDelete}</strong>"?
              <br /><br />
              This will remove it from the document type dropdown in the employee form.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
