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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

const positions = [
  'RN',
  'LPN',
  'Aesthetician',
  'Medical Director',
  'Laser Technician',
  'Front Desk',
  'Manager',
  'Other',
];

const formSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  hireDate: z.string().optional(),
  status: z.boolean(),
  locationIds: z.array(z.string()).min(1, 'At least one location is required'),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string | null;
}

export const EmployeeFormModal = ({ open, onClose, employeeId }: EmployeeFormModalProps) => {
  const { employees, locations, addEmployee, updateEmployee } = useData();
  const employee = employeeId ? employees.find((e) => e.id === employeeId) : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      position: '',
      hireDate: '',
      status: true,
      locationIds: [],
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelationship: '',
    },
  });

  const watchedLocations = watch('locationIds');
  const watchedStatus = watch('status');

  useEffect(() => {
    if (employee) {
      reset({
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position,
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
        status: employee.status === 'active',
        locationIds: employee.locationIds,
        emergencyContactName: employee.emergencyContactName || '',
        emergencyContactPhone: employee.emergencyContactPhone || '',
        emergencyContactRelationship: employee.emergencyContactRelationship || '',
      });
    } else {
      reset({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        hireDate: '',
        status: true,
        locationIds: [],
        emergencyContactName: '',
        emergencyContactPhone: '',
        emergencyContactRelationship: '',
      });
    }
  }, [employee, reset]);

  const onSubmit = (data: FormData) => {
    const status: 'active' | 'inactive' = data.status ? 'active' : 'inactive';
    const employeeData = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone || '',
      position: data.position,
      hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
      photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=2563eb&color=fff`,
      status,
      locationIds: data.locationIds,
      emergencyContactName: data.emergencyContactName || '',
      emergencyContactPhone: data.emergencyContactPhone || '',
      emergencyContactRelationship: data.emergencyContactRelationship || '',
    };

    if (employeeId) {
      updateEmployee(employeeId, employeeData);
      toast.success('Employee updated successfully');
    } else {
      addEmployee(employeeData);
      toast.success('Employee added successfully');
    }
    onClose();
  };

  const handleLocationChange = (locationId: string, checked: boolean) => {
    const current = watchedLocations || [];
    if (checked) {
      setValue('locationIds', [...current, locationId]);
    } else {
      setValue('locationIds', current.filter((id) => id !== locationId));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{employeeId ? 'Edit Employee' : 'Add Employee'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" {...register('fullName')} />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register('phone')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Select
                value={watch('position')}
                onValueChange={(value) => setValue('position', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((pos) => (
                    <SelectItem key={pos} value={pos}>
                      {pos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.position && (
                <p className="text-xs text-destructive">{errors.position.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date</Label>
              <Input id="hireDate" type="date" {...register('hireDate')} />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <Switch
                checked={watchedStatus}
                onCheckedChange={(checked) => setValue('status', checked)}
              />
              <Label>Active Employee</Label>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Assign Locations *</Label>
            <div className="grid gap-2 md:grid-cols-2">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`loc-${location.id}`}
                    checked={watchedLocations?.includes(location.id)}
                    onCheckedChange={(checked) =>
                      handleLocationChange(location.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={`loc-${location.id}`} className="cursor-pointer">
                    {location.name}
                  </Label>
                </div>
              ))}
            </div>
            {errors.locationIds && (
              <p className="text-xs text-destructive">{errors.locationIds.message}</p>
            )}
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="mb-4 font-medium text-card-foreground">Emergency Contact</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Name</Label>
                <Input id="emergencyContactName" {...register('emergencyContactName')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Phone</Label>
                <Input id="emergencyContactPhone" {...register('emergencyContactPhone')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelationship">Relationship</Label>
                <Input
                  id="emergencyContactRelationship"
                  {...register('emergencyContactRelationship')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {employeeId ? 'Update Employee' : 'Add Employee'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
