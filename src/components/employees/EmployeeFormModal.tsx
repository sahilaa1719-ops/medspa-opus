import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Upload, X, FileText, Plus, Camera, User, Eye, Trash2, Download } from 'lucide-react';
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
import { supabase } from '@/lib/supabase';

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

// Function to get document types from localStorage
const getDocumentTypes = (): DocumentType[] => {
  const saved = localStorage.getItem('customDocumentTypes');
  if (saved) {
    return JSON.parse(saved);
  }
  // Default document types if none are saved
  return [
    'Contract',
    'License Copy',
    'ID Copy',
    'Insurance',
    'Certification',
    'Policy',
    'Other',
  ];
};

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
  const [showAddDocumentForm, setShowAddDocumentForm] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>(getDocumentTypes());

  // Refresh document types when modal opens
  useEffect(() => {
    if (open) {
      setDocumentTypes(getDocumentTypes());
    }
  }, [open]);

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
      // Extract location IDs from employee_locations join or fall back to locationIds
      const locationIds = employee.employee_locations?.map(el => el.location_id) || employee.locationIds || [];
      
      reset({
        fullName: employee.fullName,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position,
        hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
        status: employee.status === 'active',
        locationIds: locationIds,
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

  // Function to generate random password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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
      let generatedPassword = '';
      
      if (employeeId) {
        await updateEmployee(employeeId, employeeData);
        newEmployeeId = employeeId;
        toast.success('Employee updated successfully');
      } else {
        // For new employees, add the employee and get the generated ID
        newEmployeeId = await addEmployee(employeeData);
        console.log('New employee created with ID:', newEmployeeId);
        
        // Generate login credentials for new employee
        generatedPassword = generatePassword();
        
        try {
          // Create user account in users table
          const { error: userError } = await supabase
            .from('users')
            .insert([{
              email: data.email,
              password_hash: generatedPassword, // In production, this should be hashed
              name: data.fullName,
              role: 'employee'
            }]);
          
          if (userError) {
            console.error('Error creating user account:', userError);
            console.error('Error details:', JSON.stringify(userError, null, 2));
            alert(`Login account creation failed: ${userError.message}\n\nError code: ${userError.code}`);
            toast.error('Employee created but login account failed. Please create manually.');
          } else {
            // Show credentials to admin
            toast.success(
              `Employee created successfully!\n\nLogin Credentials:\nEmail: ${data.email}\nPassword: ${generatedPassword}\n\nPlease save these credentials and share with the employee.`,
              { duration: 15000 }
            );
            
            // Also log to console for admin to copy
            console.log('=== NEW EMPLOYEE LOGIN CREDENTIALS ===');
            console.log('Email:', data.email);
            console.log('Password:', generatedPassword);
            console.log('=====================================');
          }
        } catch (error) {
          console.error('Error creating login credentials:', error);
        }
      }

      // Handle documents - upload files to Supabase Storage
      console.log('Documents to upload:', documents);
      console.log('Number of documents:', documents.length);
      
      for (const doc of documents) {
        console.log('Processing document:', doc);
        console.log('Is existing?', doc.isExisting);
        console.log('Has documentType?', doc.documentType);
        console.log('Has title?', doc.title);
        console.log('Has file?', doc.file);
        
        if (!doc.isExisting && doc.documentType && doc.title && doc.file) {
          try {
            console.log('Starting upload for:', doc.title);
            // Upload file to Supabase Storage
            const fileExt = doc.file.name.split('.').pop();
            const fileName = `${newEmployeeId}-${doc.documentType}-${Date.now()}.${fileExt}`;
            const filePath = `documents/${fileName}`;
            
            console.log('Uploading to path:', filePath);
            const { error: uploadError } = await supabase.storage
              .from('employee-files')
              .upload(filePath, doc.file);
            
            if (uploadError) {
              console.error('File upload error:', uploadError);
              toast.error(`Failed to upload ${doc.file.name}`);
              continue;
            }
            
            console.log('File uploaded successfully, getting public URL...');
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('employee-files')
              .getPublicUrl(filePath);
            
            console.log('Public URL:', publicUrl);
            
            // Insert document record
            const docInsert = {
              employee_id: newEmployeeId,
              title: doc.title,
              document_type: doc.documentType,
              file_url: publicUrl,
              file_size: doc.file.size
            };
            
            console.log('Inserting document record:', docInsert);
            const { data: insertedDoc, error: insertError } = await supabase
              .from('documents')
              .insert([docInsert])
              .select();
            
            if (insertError) {
              console.error('Document insert error:', insertError);
              toast.error(`Failed to save document: ${doc.title}`);
            } else {
              console.log('Document inserted successfully:', insertedDoc);
              toast.success(`Document uploaded: ${doc.title}`);
            }
            
          } catch (error) {
            console.error('Error uploading document:', error);
            toast.error(`Failed to upload document: ${doc.title}`);
          }
        } else {
          console.log('Skipping document (existing or incomplete):', {
            isExisting: doc.isExisting,
            documentType: doc.documentType,
            title: doc.title,
            hasFile: !!doc.file
          });
        }
        // Existing documents don't need to be re-added, they're already in the system
      }

      // Upload licenses
      console.log('Licenses to upload:', licenses);
      console.log('Number of licenses:', licenses.length);

      for (const license of licenses) {
        if (!license.isExisting && license.licenseType && license.expiryDate) {
          console.log('Processing license:', license);
          
          // If license has a file, upload it
          let licenseFileUrl = license.documentUrl || null;
          
          if (license.file) {
            console.log('Uploading license file:', license.file.name);
            
            const fileExt = license.file.name.split('.').pop();
            const fileName = `${newEmployeeId}-${license.licenseType.replace(/\s+/g, '-')}-${Date.now()}.${fileExt}`;
            const filePath = `licenses/${fileName}`;

            console.log('Uploading to path:', filePath);

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('employee-files')
              .upload(filePath, license.file);

            if (uploadError) {
              console.error('License file upload error:', uploadError);
              toast.error(`Failed to upload license file for ${license.licenseType}`);
              continue;
            }

            console.log('License file uploaded successfully');

            const { data: { publicUrl } } = supabase.storage
              .from('employee-files')
              .getPublicUrl(filePath);

            licenseFileUrl = publicUrl;
            console.log('License public URL:', licenseFileUrl);
            toast.success(`License file uploaded: ${license.licenseType}`);
          }

          // Insert license record
          const licenseInsert = {
            employee_id: newEmployeeId,
            license_type: license.licenseType,
            license_number: license.licenseNumber || null,
            issue_date: license.issueDate || null,
            expiry_date: license.expiryDate,
            document_url: licenseFileUrl
          };

          console.log('Inserting license record:', licenseInsert);

          const { data: insertedLicense, error: licenseError } = await supabase
            .from('licenses')
            .insert([licenseInsert])
            .select();

          if (licenseError) {
            console.error('License insert error:', licenseError);
            toast.error(`Failed to save license: ${license.licenseType}`);
          } else {
            console.log('License inserted successfully:', insertedLicense);
            toast.success(`License saved: ${license.licenseType}`);
          }
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
                <Button 
                  type="button" 
                  onClick={() => {
                    if (!showAddDocumentForm) {
                      addDocumentForm();
                      setShowAddDocumentForm(true);
                    }
                  }} 
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Document
                </Button>
              </div>

              {/* Existing Documents List */}
              {documents.filter(doc => doc.isExisting).length > 0 && (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900">Uploaded Documents</h4>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {documents.filter(doc => doc.isExisting).map((doc) => (
                      <div key={doc.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">{doc.title}</p>
                              <p className="text-sm text-gray-500">{doc.documentType}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {doc.preview && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(doc.preview, '_blank')}
                                className="h-8"
                              >
                                <Eye className="h-3.5 w-3.5 mr-1" />
                                View
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeDocument(doc.id)}
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Documents Form */}
              {documents.filter(doc => !doc.isExisting).length > 0 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 px-4 py-3 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900">New Documents to Upload</h4>
                  </div>
                  {documents.filter(doc => !doc.isExisting).map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Document #{doc.id.slice(-4)}</h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            removeDocument(doc.id);
                            if (documents.filter(d => !d.isExisting).length === 1) {
                              setShowAddDocumentForm(false);
                            }
                          }}
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
                </div>
              )}
              
              {documents.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-900 font-medium mb-1">No documents uploaded yet</p>
                  <p className="text-sm text-gray-500">Click "Add New Document" to upload employee documents</p>
                </div>
              )}
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
