import { useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Phone, Users } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
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
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { LocationFormModal } from '@/components/locations/LocationFormModal';

const Locations = () => {
  const { locations, employees, deleteLocation } = useData();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);

  const getEmployeeCount = (locationId: string) => {
    return employees.filter((e) => e.locationIds.includes(locationId)).length;
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteLocation(deleteId);
      toast.success('Location deleted successfully');
      setDeleteId(null);
    }
  };

  const handleEdit = (id: string) => {
    setEditingLocationId(id);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLocationId(null);
  };

  return (
    <div className="min-h-screen">
      <Header title="Locations" />

      <div className="p-6">
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-card-foreground">
                {location.name}
              </h3>
              
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{location.address || 'No address provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{location.phone || 'No phone provided'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{getEmployeeCount(location.id)} employees</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2 border-t border-border pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(location.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteId(location.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">No locations found</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this location? Employees assigned to this location will not be deleted but will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Location Form Modal */}
      <LocationFormModal
        open={isFormOpen}
        onClose={handleCloseForm}
        locationId={editingLocationId}
      />
    </div>
  );
};

export default Locations;
