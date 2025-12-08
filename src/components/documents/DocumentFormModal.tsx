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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';

const documentTypes = [
  'Contract',
  'License Copy',
  'ID Copy',
  'Insurance',
  'Certification',
  'Policy',
  'Other',
];

const formSchema = z.object({
  title: z.string().min(1, 'Document title is required'),
  documentType: z.string().min(1, 'Document type is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface DocumentFormModalProps {
  open: boolean;
  onClose: () => void;
  employeeId: string;
}

export const DocumentFormModal = ({
  open,
  onClose,
  employeeId,
}: DocumentFormModalProps) => {
  const { addDocument } = useData();

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

  const onSubmit = (data: FormData) => {
    addDocument({
      employeeId,
      title: data.title,
      documentType: data.documentType,
      fileUrl: '',
      fileName: `${data.title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      notes: data.notes || '',
    });
    
    toast.success('Document added successfully');
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
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
                {documentTypes.map((type) => (
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
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Upload Document</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
