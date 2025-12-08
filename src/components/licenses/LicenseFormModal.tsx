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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

const licenseTypes = [
  'RN License',
  'LPN License',
  'Aesthetician License',
  'Medical Director License',
  'Botox Certification',
  'Dermal Filler Certification',
  'Laser Operator Certification',
  'CPR Certification',
  'First Aid Certification',
  'Other',
];

const formSchema = z.object({
  licenseType: z.string().min(1, 'License type is required'),
  licenseNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().min(1, 'Expiry date is required'),
});

type FormData = z.infer<typeof formSchema>;

interface LicenseFormModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
  licenseId?: string | null;
}

export const LicenseFormModal = ({
  open,
  onClose,
  employeeId,
  licenseId,
}: LicenseFormModalProps) => {
  const { licenses, addLicense, updateLicense } = useData();
  const license = licenseId ? licenses.find((l) => l.id === licenseId) : null;

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
      licenseType: '',
      licenseNumber: '',
      issueDate: '',
      expiryDate: '',
    },
  });

  useEffect(() => {
    if (license) {
      reset({
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber || '',
        issueDate: license.issueDate
          ? new Date(license.issueDate).toISOString().split('T')[0]
          : '',
        expiryDate: license.expiryDate
          ? new Date(license.expiryDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      reset({
        licenseType: '',
        licenseNumber: '',
        issueDate: '',
        expiryDate: '',
      });
    }
  }, [license, reset]);

  const onSubmit = (data: FormData) => {
    const licenseData = {
      employeeId,
      licenseType: data.licenseType,
      licenseNumber: data.licenseNumber || '',
      issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
      expiryDate: new Date(data.expiryDate),
      documentUrl: '',
    };

    if (licenseId) {
      updateLicense(licenseId, licenseData);
      toast.success('License updated successfully');
    } else {
      addLicense(licenseData);
      toast.success('License added successfully');
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{licenseId ? 'Edit License' : 'Add License'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licenseType">License Type *</Label>
            <Select
              value={watch('licenseType')}
              onValueChange={(value) => setValue('licenseType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select license type" />
              </SelectTrigger>
              <SelectContent>
                {licenseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.licenseType && (
              <p className="text-xs text-destructive">{errors.licenseType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseNumber">License Number</Label>
            <Input id="licenseNumber" {...register('licenseNumber')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issueDate">Issue Date</Label>
            <Input id="issueDate" type="date" {...register('issueDate')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input id="expiryDate" type="date" {...register('expiryDate')} />
            {errors.expiryDate && (
              <p className="text-xs text-destructive">{errors.expiryDate.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {licenseId ? 'Update License' : 'Add License'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
