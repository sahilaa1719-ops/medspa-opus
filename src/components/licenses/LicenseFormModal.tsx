import { useEffect, useState } from 'react';
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
import { supabase } from '@/lib/supabase';

interface TypeItem {
  id: string;
  name: string;
}

const formSchema = z.object({
  licenseType: z.string().min(1, 'License type is required'),
  licenseNumber: z.string().optional(),
  issueDate: z.string().optional(),
  expiryDate: z.string().min(1, 'Expiry date is required'),
});

type FormData = z.infer<typeof formSchema>;

interface LicenseFormModalProps {
  license?: any | null;
  open?: boolean;
  onClose: () => void;
  employeeId?: string;
  licenseId?: string | null;
}

export const LicenseFormModal = ({
  license,
  open,
  onClose,
  employeeId,
  licenseId,
}: LicenseFormModalProps) => {
  const [saving, setSaving] = useState(false);
  const [licenseTypes, setLicenseTypes] = useState<TypeItem[]>([]);

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
    loadLicenseTypes();
  }, []);

  useEffect(() => {
    if (license) {
      reset({
        licenseType: license.license_type,
        licenseNumber: license.license_number || '',
        issueDate: license.issue_date
          ? new Date(license.issue_date).toISOString().split('T')[0]
          : '',
        expiryDate: license.expiry_date
          ? new Date(license.expiry_date).toISOString().split('T')[0]
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

  const loadLicenseTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('license_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setLicenseTypes(data || []);
    } catch (error) {
      console.error('Error loading license types:', error);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setSaving(true);

      // Calculate status based on expiry date
      const expiryDate = new Date(data.expiryDate);
      const today = new Date();
      const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      let status = 'active';
      if (daysRemaining < 0) status = 'expired';
      else if (daysRemaining <= 30) status = 'pending';

      const licenseData = {
        license_type: data.licenseType,
        license_number: data.licenseNumber || '',
        issue_date: data.issueDate ? data.issueDate : new Date().toISOString().split('T')[0],
        expiry_date: data.expiryDate,
        status: status,
      };

      if (license || licenseId) {
        // Edit existing license
        const id = license?.id || licenseId;
        const { error } = await supabase
          .from('licenses')
          .update(licenseData)
          .eq('id', id);

        if (error) throw error;
        toast.success('License updated successfully');
      } else if (employeeId) {
        // Add new license
        const { error } = await supabase
          .from('licenses')
          .insert({
            ...licenseData,
            employee_id: employeeId,
          });

        if (error) throw error;
        toast.success('License added successfully');
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving license:', error);
      toast.error(error.message || 'Failed to save license');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open !== undefined ? open : !!license} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{license || licenseId ? 'Edit License' : 'Add License'}</DialogTitle>
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
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
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
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? ((license || licenseId) ? 'Updating...' : 'Adding...') : ((license || licenseId) ? 'Update License' : 'Add License')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
