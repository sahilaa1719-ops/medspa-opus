import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { DOCUMENT_TYPES } from '@/lib/constants';

const formSchema = z.object({
  title: z.string().min(1, 'Document title is required'),
  documentType: z.string().min(1, 'Document type is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DocumentFormModalProps {
  document?: any | null;
  open?: boolean;
  onClose: () => void;
  employeeId?: string;
}

export const DocumentFormModal = ({
  document,
  open,
  onClose,
  employeeId,
}: DocumentFormModalProps) => {
  const [saving, setSaving] = useState(false);

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
      title: '',
      documentType: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (document) {
      reset({
        title: document.title || '',
        documentType: document.document_type || '',
        notes: document.notes || '',
      });
    } else {
      reset({
        title: '',
        documentType: '',
        notes: '',
      });
    }
  }, [document, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      setSaving(true);

      const documentData = {
        title: data.title,
        document_type: data.documentType,
        notes: data.notes || '',
      };

      if (document) {
        // Edit existing document
        const { error } = await supabase
          .from('documents')
          .update(documentData)
          .eq('id', document.id);

        if (error) throw error;
        toast.success('Document updated successfully');
      } else if (employeeId) {
        // Add new document (simplified - just metadata, no file upload here)
        const { error } = await supabase
          .from('documents')
          .insert({
            ...documentData,
            employee_id: employeeId,
            uploaded_by: employeeId,
          });

        if (error) throw error;
        toast.success('Document added successfully');
      }

      onClose();
    } catch (error: any) {
      console.error('Error saving document:', error);
      toast.error(error.message || 'Failed to save document');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open !== undefined ? open : !!document} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{document ? 'Edit Document' : 'Upload Document'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input id="title" {...register('title')} />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type *</Label>
            <Select
              value={watch('documentType')}
              onValueChange={(value) => setValue('documentType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.documentType && (
              <p className="text-xs text-destructive">{errors.documentType.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Optional notes about this document"
              {...register('notes')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (document ? 'Updating...' : 'Adding...') : (document ? 'Update Document' : 'Add Document')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
