import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LocationFormModalProps {
  open: boolean;
  onClose: () => void;
  locationId?: string | null;
}

export const LocationFormModal = ({
  open,
  onClose,
  locationId,
}: LocationFormModalProps) => {
  const { locations, addLocation, updateLocation } = useData();
  const location = locationId ? locations.find((l) => l.id === locationId) : null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (location) {
      reset({
        name: location.name,
        address: location.address || '',
        phone: location.phone || '',
      });
    } else {
      reset({
        name: '',
        address: '',
        phone: '',
      });
    }
  }, [location, reset]);

  const onSubmit = (data: FormData) => {
    const locationData = {
      name: data.name,
      address: data.address || '',
      phone: data.phone || '',
    };

    if (locationId) {
      updateLocation(locationId, locationData);
      toast.success('Location updated successfully');
    } else {
      addLocation(locationData);
      toast.success('Location added successfully');
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{locationId ? 'Edit Location' : 'Add Location'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Location Name *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register('address')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" {...register('phone')} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {locationId ? 'Update Location' : 'Add Location'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
