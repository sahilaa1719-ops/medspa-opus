export interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt: Date;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  hireDate: Date;
  photoUrl: string;
  status: 'active' | 'inactive';
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelationship: string;
  employeeType?: 'full-time' | 'part-time' | 'contract';
  hourlyRate?: number;
  overtimeRate?: number;
  annualSalary?: number;
  payFrequency?: 'hourly' | 'weekly' | 'bi-weekly' | 'monthly' | 'annually';
  bankAccountLast4?: string;
  locationIds?: string[]; // For form submission and backward compatibility
  employee_locations?: Array<{ // From Supabase join
    location_id: string;
    locations?: {
      id: string;
      name: string;
    };
  }>;
  createdAt: Date;
}

export interface Document {
  id: string;
  employeeId: string;
  title: string;
  documentType: string; // Maps to 'type' in database
  fileUrl: string; // Maps to 'file_url' in database
  fileName?: string; // For display purposes
  fileSize?: number; // Maps to 'file_size' in database
  uploadedBy?: string; // Maps to 'uploaded_by' in database
  notes?: string; // Not in current schema
  uploadedAt: Date; // Maps to 'uploaded_at' in database
}

export interface License {
  id: string;
  employeeId: string;
  licenseType: string;
  licenseNumber: string;
  issueDate: Date;
  expiryDate: Date;
  documentUrl: string;
  createdAt: Date;
}

export type Position = 
  | 'RN'
  | 'LPN'
  | 'Aesthetician'
  | 'Medical Director'
  | 'Laser Technician'
  | 'Front Desk'
  | 'Manager'
  | 'Other';

export type LicenseType =
  | 'RN License'
  | 'LPN License'
  | 'Aesthetician License'
  | 'Medical Director License'
  | 'Botox Certification'
  | 'Dermal Filler Certification'
  | 'Laser Operator Certification'
  | 'CPR Certification'
  | 'First Aid Certification'
  | 'Other';

export type DocumentType =
  | 'Contract'
  | 'License Copy'
  | 'ID Copy'
  | 'Insurance'
  | 'Certification'
  | 'Policy'
  | 'Other'
  | 'Employment Contract'
  | 'Medical License'
  | 'Professional License Copy'
  | 'Government ID Copy'
  | 'Insurance Documents'
  | 'Background Check'
  | 'Certifications'
  | 'Other Documents';
