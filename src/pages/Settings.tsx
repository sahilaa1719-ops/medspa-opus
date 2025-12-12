import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Plus, Trash2, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
