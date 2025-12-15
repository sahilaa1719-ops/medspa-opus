// Centralized constants for the application

// Document types available for upload
// These are used in both admin and employee portals
export const DOCUMENT_TYPES = [
  'Resume',
  'Contract',
  'Certificate',
  'License Copy',
  'ID Copy',
  'Insurance',
  'Policy',
  'W-4 Form',
  'I-9 Form',
  'Direct Deposit Form',
  'Other',
] as const;

// License types available
export const LICENSE_TYPES = [
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
] as const;

// TODO: In the future, these can be fetched from a database table
// to allow admins to configure them in the Settings page
