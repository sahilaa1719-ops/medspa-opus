import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, FileText, Plus, Camera, User } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useData } from '@/context/DataContext';
import { toast } from 'sonner';
import { Position, LicenseType, DocumentType } from '@/types';

const positions: Position[] = [
  'RN',
  'LPN',
  'Aesthetician',
  'Medical Director',
  'Laser Technician',
  'Front Desk',
  'Manager',
  'Other',
];

const licenseTypes: LicenseType[] = [
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

const documentTypes: DocumentType[] = [
  'Contract',
  'License Copy',
  'ID Copy',
  'Insurance',
  'Certification',
  'Policy',
  'Other',
];

interface DocumentUpload {
  id: string;
  documentType: string;
  title: string;
  file: File | null;
  preview: string;
  isExisting?: boolean;
}

interface LicenseEntry {
  id: string;
  licenseType: string;
  licenseNumber: string;
  issueDate: string;
  expiryDate: string;
  file: File | null;
  notes: string;
  isExisting?: boolean;
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

const formSchema = z.object({
  // Basic Information
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  position: z.string().min(1, 'Position is required'),
  hireDate: z.string().optional(),
  status: z.boolean(),
  locationIds: z.array(z.string()).min(1, 'At least one location is required'),
  profilePhoto: z.any().optional(),
  
  // Emergency Contacts
  emergencyContact1: z.object({
    name: z.string().min(1, 'Primary emergency contact name is required'),
    phone: z.string().min(1, 'Primary emergency contact phone is required'),
    relationship: z.string().min(1, 'Relationship is required'),
  }),
  emergencyContact2: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    relationship: z.string().optional(),
  }).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EmployeeFormModalProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string | null;
}

export const EmployeeFormModal = ({ open, onClose, employeeId }: EmployeeFormModalProps) => {
  const { 
    employees, 
    locations, 
    addEmployee, 
    updateEmployee, 
    addDocument, 
    addLicense,
    getEmployeeDocuments,
    getEmployeeLicenses,
    deleteDocument,
    deleteLicense 
  } = useData();
  const employee = employeeId ? employees.find((e) => e.id === employeeId) : null;
  
  const [activeTab, setActiveTab] = useState('basic');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string>('');
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [licenses, setLicenses] = useState<LicenseEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      emergencyContact1: {
        name: '',
        phone: '',
        relationship: '',
      },
      emergencyContact2: {
        name: '',
        phone: '',
        relationship: '',
      },
    },
  });

  const watchedLocations = watch('locationIds');
  const watchedStatus = watch('status');
  const watchedName = watch('fullName');

  useEffect(() => {
    if (employee && employeeId) {
      // Load employee data for editing
      reset({
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position,
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
        status: employee.status === 'active',
        locationIds: employee.locationIds,
        emergencyContact1: {
          name: employee.emergencyContactName || '',
          phone: employee.emergencyContactPhone || '',
          relationship: employee.emergencyContactRelationship || '',
        },
        emergencyContact2: {
          name: '',
          phone: '',
          relationship: '',
        },
      });
      
      if (employee.photoUrl && !employee.photoUrl.includes('ui-avatars.com')) {
        setProfilePhotoPreview(employee.photoUrl);
      }

      // Load existing documents
      const existingDocuments = getEmployeeDocuments(employeeId).map(doc => ({
        id: doc.id,
        documentType: doc.documentType,
        title: doc.title,
        file: null, // Can't load existing file objects
        preview: doc.fileName,
        isExisting: true,
      }));
      setDocuments(existingDocuments);

      // Load existing licenses
      const existingLicenses = getEmployeeLicenses(employeeId).map(license => ({
        id: license.id,
        licenseType: license.licenseType,
        licenseNumber: license.licenseNumber,
        issueDate: license.issueDate ? new Date(license.issueDate).toISOString().split('T')[0] : '',
        expiryDate: new Date(license.expiryDate).toISOString().split('T')[0],
        file: null, // Can't load existing file objects
        notes: '',
        isExisting: true,
      }));
      setLicenses(existingLicenses);
    } else {
      // Reset form and state for new employee
      reset({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        hireDate: '',
        status: true,
        locationIds: [],
        emergencyContact1: {
          name: '',
          phone: '',
          relationship: '',
        },
        emergencyContact2: {
          name: '',
          phone: '',
          relationship: '',
        },
      });
      setProfilePhoto(null);
      setProfilePhotoPreview('');
      setDocuments([]);
      setLicenses([]);
      setActiveTab('basic');
    }
  }, [employee, employeeId, reset, open, getEmployeeDocuments, getEmployeeLicenses]);

  const handleLocationChange = (locationId: string, checked: boolean) => {
    const current = watchedLocations || [];
    if (checked) {
      setValue('locationIds', [...current, locationId]);
    } else {
      setValue('locationIds', current.filter((id) => id !== locationId));
    }
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addDocumentForm = () => {
    const newDoc: DocumentUpload = {
      id: Math.random().toString(36).substr(2, 9),
      documentType: '',
      title: '',
      file: null,
      preview: '',
    };
    setDocuments([...documents, newDoc]);
  };

  const updateDocument = (id: string, field: keyof DocumentUpload, value: any) => {
    setDocuments(docs => docs.map(doc => 
      doc.id === id ? { ...doc, [field]: value } : doc
    ));
  };

  const removeDocument = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc?.isExisting) {
      // Delete existing document from the database
      deleteDocument(id);
    }
    setDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const handleDocumentFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a PDF, JPG, or PNG file');
        return;
      }
      
      updateDocument(id, 'file', file);
      updateDocument(id, 'preview', file.name);
    }
  };

  const addLicenseForm = () => {
    const newLicense: LicenseEntry = {
      id: Math.random().toString(36).substr(2, 9),
      licenseType: '',
      licenseNumber: '',
      issueDate: '',
      expiryDate: '',
      file: null,
      notes: '',
    };
    setLicenses([...licenses, newLicense]);
  };

  const updateLicenseEntry = (id: string, field: keyof LicenseEntry, value: any) => {
    setLicenses(licenses => licenses.map(license => 
      license.id === id ? { ...license, [field]: value } : license
    ));
  };

  const removeLicense = (id: string) => {
    const license = licenses.find(l => l.id === id);
    if (license?.isExisting) {
      // Delete existing license from the database
      deleteLicense(id);
    }
    setLicenses(licenses => licenses.filter(license => license.id !== id));
  };

  const handleLicenseFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a PDF, JPG, or PNG file');
        return;
      }
      
      updateLicenseEntry(id, 'file', file);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Create employee data
      const status: 'active' | 'inactive' = data.status ? 'active' : 'inactive';
      let photoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.fullName)}&background=F3F4F6&color=374151`;
      
      // In a real app, you would upload the profile photo to a server/cloud storage
      if (profilePhoto) {
        photoUrl = profilePhotoPreview; // For demo, use the preview URL
      }
      
      const employeeData = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        position: data.position,
        hireDate: data.hireDate ? new Date(data.hireDate) : new Date(),
        photoUrl,
        status,
        locationIds: data.locationIds,
        emergencyContactName: data.emergencyContact1.name,
        emergencyContactPhone: data.emergencyContact1.phone,
        emergencyContactRelationship: data.emergencyContact1.relationship,
      };

      let newEmployeeId: string;
      
      if (employeeId) {
        await updateEmployee(employeeId, employeeData);
        newEmployeeId = employeeId;
        toast.success('Employee updated successfully');
      } else {
        // For new employees, add the employee and get the generated ID
        newEmployeeId = await addEmployee(employeeData);
      }

      // Handle documents
      for (const doc of documents) {
        if (!doc.isExisting && doc.documentType && doc.title && doc.file) {
          // Add new document
          const documentData = {
            employeeId: newEmployeeId,
            title: doc.title,
            documentType: doc.documentType,
            fileUrl: '', // In real app, upload file and get URL
            fileName: doc.file.name,
            notes: '',
          };
          await addDocument(documentData);
        }
        // Existing documents don't need to be re-added, they're already in the system
      }

      // Handle licenses
      for (const license of licenses) {
        if (!license.isExisting && license.licenseType && license.expiryDate) {
          // Add new license
          const licenseData = {
            employeeId: newEmployeeId,
            licenseType: license.licenseType,
            licenseNumber: license.licenseNumber,
            issueDate: license.issueDate ? new Date(license.issueDate) : new Date(),
            expiryDate: new Date(license.expiryDate),
            documentUrl: '', // In real app, upload file and get URL
          };
          await addLicense(licenseData);
        }
        // Existing licenses don't need to be re-added, they're already in the system
      }

      if (!employeeId) {
        toast.success('Employee onboarding completed successfully');
      }
      
      onClose();
    } catch (error) {
      toast.error('Error saving employee data');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employeeId ? 'Edit Employee' : 'Employee Onboarding'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="licenses">Licenses</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>

            {/* TAB 1 - BASIC INFORMATION */}
            <TabsContent value="basic" className="space-y-6">
              {/* Profile Photo Section */}
              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    {profilePhotoPreview ? (
                      <AvatarImage src={profilePhotoPreview} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-lg">
                        {watchedName ? watchedName.split(' ').map(n => n[0]).join('').toUpperCase() : <User className="h-8 w-8" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button
                    type="button"
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                    onClick={() => document.getElementById('profile-photo')?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePhotoChange}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Profile Photo</h3>
                  <p className="text-sm text-gray-600">Upload a professional photo (optional)</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 10MB</p>
                </div>
              </div>

              {/* Basic Information Form */}
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
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...register('phone')} placeholder="(555) 123-4567" />
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

              {/* Location Assignment */}
              <div className="space-y-3">
                <Label>Assign to Locations *</Label>
                <div className="grid gap-3 md:grid-cols-2 p-4 border border-gray-200 rounded-lg">
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
            </TabsContent>

            {/* TAB 2 - DOCUMENTS */}
            <TabsContent value="documents" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Document Uploads</h3>
                  <p className="text-sm text-gray-600">Upload required documents for employee records</p>
                </div>
                <Button type="button" onClick={addDocumentForm} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Document
                </Button>
              </div>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">Document #{doc.id.slice(-4)}</h4>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Document Type *</Label>
                        <Select
                          value={doc.documentType}
                          onValueChange={(value) => updateDocument(doc.id, 'documentType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Contract">Employment Contract</SelectItem>
                            <SelectItem value="License Copy">Medical License</SelectItem>
                            <SelectItem value="License Copy">Professional License Copy</SelectItem>
                            <SelectItem value="ID Copy">Government ID Copy</SelectItem>
                            <SelectItem value="Insurance">Insurance Documents</SelectItem>
                            <SelectItem value="Certification">Background Check</SelectItem>
                            <SelectItem value="Certification">Certifications</SelectItem>
                            <SelectItem value="Other">Other Documents</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Document Title/Name *</Label>
                        <Input
                          value={doc.title}
                          onChange={(e) => updateDocument(doc.id, 'title', e.target.value)}
                          placeholder="e.g., Employment Contract - John Doe"
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label>Upload File</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`doc-${doc.id}`)?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          {doc.preview && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="h-4 w-4" />
                              {doc.preview}
                            </div>
                          )}
                        </div>
                        <input
                          id={`doc-${doc.id}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleDocumentFileChange(doc.id, e)}
                        />
                        <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {documents.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No documents added yet</p>
                    <p className="text-sm">Click "Add Document" to upload employee documents</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 3 - LICENSES & CERTIFICATIONS */}
            <TabsContent value="licenses" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Licenses & Certifications</h3>
                  <p className="text-sm text-gray-600">Add professional licenses and certifications</p>
                </div>
                <Button type="button" onClick={addLicenseForm} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add License
                </Button>
              </div>

              <div className="space-y-4">
                {licenses.map((license) => (
                  <div key={license.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900">License #{license.id.slice(-4)}</h4>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeLicense(license.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>License Type *</Label>
                        <Select
                          value={license.licenseType}
                          onValueChange={(value) => updateLicenseEntry(license.id, 'licenseType', value)}
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
                      </div>
                      
                      <div className="space-y-2">
                        <Label>License Number</Label>
                        <Input
                          value={license.licenseNumber}
                          onChange={(e) => updateLicenseEntry(license.id, 'licenseNumber', e.target.value)}
                          placeholder="e.g., RN-2024-001"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Issue Date</Label>
                        <Input
                          type="date"
                          value={license.issueDate}
                          onChange={(e) => updateLicenseEntry(license.id, 'issueDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Expiration Date *</Label>
                        <Input
                          type="date"
                          value={license.expiryDate}
                          onChange={(e) => updateLicenseEntry(license.id, 'expiryDate', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label>Upload License Copy (Optional)</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`license-${license.id}`)?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Choose File
                          </Button>
                          {license.file && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <FileText className="h-4 w-4" />
                              {license.file.name}
                            </div>
                          )}
                        </div>
                        <input
                          id={`license-${license.id}`}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleLicenseFileChange(license.id, e)}
                        />
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <Label>Notes</Label>
                        <Textarea
                          value={license.notes}
                          onChange={(e) => updateLicenseEntry(license.id, 'notes', e.target.value)}
                          placeholder="Additional notes about this license..."
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {licenses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No licenses added yet</p>
                    <p className="text-sm">Click "Add License" to add professional licenses</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* TAB 4 - EMERGENCY CONTACT */}
            <TabsContent value="emergency" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Emergency Contacts</h3>
                <p className="text-sm text-gray-600">Provide emergency contact information for this employee</p>
              </div>

              {/* Primary Emergency Contact */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Primary Emergency Contact *</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Contact Name *</Label>
                    <Input {...register('emergencyContact1.name')} placeholder="Full Name" />
                    {errors.emergencyContact1?.name && (
                      <p className="text-xs text-destructive">{errors.emergencyContact1.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input {...register('emergencyContact1.phone')} placeholder="(555) 123-4567" />
                    {errors.emergencyContact1?.phone && (
                      <p className="text-xs text-destructive">{errors.emergencyContact1.phone.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Relationship *</Label>
                    <Input {...register('emergencyContact1.relationship')} placeholder="e.g., Spouse, Parent" />
                    {errors.emergencyContact1?.relationship && (
                      <p className="text-xs text-destructive">{errors.emergencyContact1.relationship.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Secondary Emergency Contact */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Secondary Emergency Contact (Optional)</h4>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Contact Name</Label>
                    <Input {...register('emergencyContact2.name')} placeholder="Full Name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input {...register('emergencyContact2.phone')} placeholder="(555) 123-4567" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Input {...register('emergencyContact2.relationship')} placeholder="e.g., Sibling, Friend" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-between items-center border-t border-border pt-6">
            <div className="text-sm text-gray-600">
              {activeTab === 'basic' && 'Complete basic employee information'}
              {activeTab === 'documents' && 'Upload important employee documents'}
              {activeTab === 'licenses' && 'Add professional licenses and certifications'}
              {activeTab === 'emergency' && 'Provide emergency contact details'}
            </div>
            
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Saving...</>
                ) : employeeId ? (
                  'Update Employee'
                ) : (
                  'Complete Onboarding'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
