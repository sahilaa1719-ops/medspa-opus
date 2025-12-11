import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Location, License, Document } from '@/types';
import { supabase } from '../lib/supabase';

interface DataContextType {
  employees: Employee[];
  locations: Location[];
  licenses: License[];
  documents: Document[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => Promise<string>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<{ deletedDocuments: number; deletedLicenses: number }>;
  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => Promise<void>;
  updateLocation: (id: string, location: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
  addLicense: (license: Omit<License, 'id' | 'createdAt'>) => Promise<void>;
  updateLicense: (id: string, license: Partial<License>) => Promise<void>;
  deleteLicense: (id: string) => Promise<void>;
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  getEmployeeDocuments: (employeeId: string) => Document[];
  getEmployeeLicenses: (employeeId: string) => License[];
  getEmployeeById: (id: string) => Employee | undefined;
  getEmployeeDeletionInfo: (id: string) => { employee: Employee | undefined; documentCount: number; licenseCount: number };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  // Fetch all data on mount
  useEffect(() => {
    fetchEmployees();
    fetchLocations();
    fetchLicenses();
    fetchDocuments();

    // Set up real-time subscriptions
    const employeesSubscription = supabase
      .channel('employees-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employees' }, () => {
        fetchEmployees();
      })
      .subscribe();

    const locationsSubscription = supabase
      .channel('locations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, () => {
        fetchLocations();
      })
      .subscribe();

    const licensesSubscription = supabase
      .channel('licenses-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'licenses' }, () => {
        fetchLicenses();
      })
      .subscribe();

    const documentsSubscription = supabase
      .channel('documents-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'documents' }, () => {
        fetchDocuments();
      })
      .subscribe();

    return () => {
      employeesSubscription.unsubscribe();
      locationsSubscription.unsubscribe();
      licensesSubscription.unsubscribe();
      documentsSubscription.unsubscribe();
    };
  }, []);

  const fetchEmployees = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select(`
        *,
        employee_locations (
          location_id,
          locations (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setEmployees(data.map(emp => ({
        id: emp.id,
        fullName: emp.full_name,
        email: emp.email,
        phone: emp.phone,
        position: emp.position,
        hireDate: new Date(emp.hire_date),
        photoUrl: emp.photo_url,
        status: emp.status,
        emergencyContactName: emp.emergency_contact_name,
        emergencyContactPhone: emp.emergency_contact_phone,
        emergencyContactRelationship: emp.emergency_contact_relationship,
        employeeType: emp.employment_type,
        hourlyRate: emp.hourly_rate,
        overtimeRate: emp.overtime_rate,
        annualSalary: emp.annual_salary,
        payFrequency: emp.pay_frequency,
        bankAccountLast4: emp.bank_account_last4,
        employee_locations: emp.employee_locations,
        createdAt: new Date(emp.created_at)
      })));
    }
  };

  const fetchLocations = async () => {
    const { data, error } = await supabase.from('locations').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setLocations(data.map(loc => ({
        ...loc,
        createdAt: new Date(loc.created_at)
      })));
    }
  };

  const fetchLicenses = async () => {
    const { data, error } = await supabase.from('licenses').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setLicenses(data.map(lic => ({
        ...lic,
        createdAt: new Date(lic.created_at),
        issueDate: new Date(lic.issue_date),
        expiryDate: new Date(lic.expiry_date)
      })));
    }
  };

  const fetchDocuments = async () => {
    const { data, error } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
    if (!error && data) {
      setDocuments(data.map(doc => ({
        id: doc.id,
        employeeId: doc.employee_id,
        title: doc.title,
        documentType: doc.type,
        fileUrl: doc.file_url,
        fileSize: doc.file_size,
        uploadedBy: doc.uploaded_by,
        uploadedAt: new Date(doc.uploaded_at)
      })));
    }
  };

  const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('employees')
      .insert([{
        full_name: employee.fullName,
        email: employee.email,
        phone: employee.phone || '',
        position: employee.position,
        hire_date: employee.hireDate,
        photo_url: employee.photoUrl,
        status: employee.status,
        emergency_contact_name: employee.emergencyContactName,
        emergency_contact_phone: employee.emergencyContactPhone,
        emergency_contact_relationship: employee.emergencyContactRelationship,
        employment_type: employee.employeeType,
        hourly_rate: employee.hourlyRate,
        overtime_rate: employee.overtimeRate,
        annual_salary: employee.annualSalary,
        pay_frequency: employee.payFrequency,
        bank_account_last4: employee.bankAccountLast4
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding employee:', error);
      return '';
    }

    // Handle location assignments if provided
    if (employee.locationIds && employee.locationIds.length > 0) {
      const locationLinks = employee.locationIds.map(locId => ({
        employee_id: data.id,
        location_id: locId
      }));
      
      const { error: linkError } = await supabase
        .from('employee_locations')
        .insert(locationLinks);
      
      if (linkError) {
        console.error('Error linking employee to locations:', linkError);
      }
    }

    await fetchEmployees();
    return data.id;
  };

  const updateEmployee = async (id: string, employee: Partial<Employee>) => {
    const updateData: any = {};
    if (employee.fullName !== undefined) updateData.full_name = employee.fullName;
    if (employee.email !== undefined) updateData.email = employee.email;
    if (employee.phone !== undefined) updateData.phone = employee.phone;
    if (employee.position !== undefined) updateData.position = employee.position;
    if (employee.hireDate !== undefined) updateData.hire_date = employee.hireDate;
    if (employee.photoUrl !== undefined) updateData.photo_url = employee.photoUrl;
    if (employee.status !== undefined) updateData.status = employee.status;
    if (employee.emergencyContactName !== undefined) updateData.emergency_contact_name = employee.emergencyContactName;
    if (employee.emergencyContactPhone !== undefined) updateData.emergency_contact_phone = employee.emergencyContactPhone;
    if (employee.emergencyContactRelationship !== undefined) updateData.emergency_contact_relationship = employee.emergencyContactRelationship;
    if (employee.employeeType !== undefined) updateData.employment_type = employee.employeeType;
    if (employee.hourlyRate !== undefined) updateData.hourly_rate = employee.hourlyRate;
    if (employee.overtimeRate !== undefined) updateData.overtime_rate = employee.overtimeRate;
    if (employee.annualSalary !== undefined) updateData.annual_salary = employee.annualSalary;
    if (employee.payFrequency !== undefined) updateData.pay_frequency = employee.payFrequency;
    if (employee.bankAccountLast4 !== undefined) updateData.bank_account_last4 = employee.bankAccountLast4;

    const { error } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating employee:', error);
      return;
    }

    // Handle location assignments if provided
    if (employee.locationIds !== undefined) {
      // Delete existing location links
      await supabase
        .from('employee_locations')
        .delete()
        .eq('employee_id', id);
      
      // Insert new location links
      if (employee.locationIds.length > 0) {
        const locationLinks = employee.locationIds.map(locId => ({
          employee_id: id,
          location_id: locId
        }));
        
        const { error: linkError } = await supabase
          .from('employee_locations')
          .insert(locationLinks);
        
        if (linkError) {
          console.error('Error linking employee to locations:', linkError);
        }
      }
    }

    await fetchEmployees();
  };

  const deleteEmployee = async (id: string) => {
    // Count items to be deleted for confirmation message
    const employeeDocuments = documents.filter((doc) => doc.employeeId === id);
    const employeeLicenses = licenses.filter((lic) => lic.employeeId === id);
    
    // Delete employee (cascade will handle related records if configured in DB)
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      return {
        deletedDocuments: 0,
        deletedLicenses: 0,
      };
    }

    await fetchEmployees();
    await fetchLicenses();
    await fetchDocuments();
    
    return {
      deletedDocuments: employeeDocuments.length,
      deletedLicenses: employeeLicenses.length,
    };
  };

  const addLocation = async (location: Omit<Location, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('locations')
      .insert([location]);

    if (error) {
      console.error('Error adding location:', error);
      return;
    }

    await fetchLocations();
  };

  const updateLocation = async (id: string, location: Partial<Location>) => {
    const { error } = await supabase
      .from('locations')
      .update(location)
      .eq('id', id);

    if (error) {
      console.error('Error updating location:', error);
      return;
    }

    await fetchLocations();
  };

  const deleteLocation = async (id: string) => {
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting location:', error);
      return;
    }

    await fetchLocations();
  };

  const addLicense = async (license: Omit<License, 'id' | 'createdAt'>) => {
    const { error } = await supabase
      .from('licenses')
      .insert([{
        employee_id: license.employeeId,
        license_type: license.licenseType,
        license_number: license.licenseNumber,
        issuing_authority: license.issuingAuthority,
        issue_date: license.issueDate,
        expiry_date: license.expiryDate,
        status: license.status,
        file_url: license.fileUrl
      }]);

    if (error) {
      console.error('Error adding license:', error);
      return;
    }

    await fetchLicenses();
  };

  const updateLicense = async (id: string, license: Partial<License>) => {
    const updateData: any = {};
    if (license.employeeId !== undefined) updateData.employee_id = license.employeeId;
    if (license.licenseType !== undefined) updateData.license_type = license.licenseType;
    if (license.licenseNumber !== undefined) updateData.license_number = license.licenseNumber;
    if (license.issuingAuthority !== undefined) updateData.issuing_authority = license.issuingAuthority;
    if (license.issueDate !== undefined) updateData.issue_date = license.issueDate;
    if (license.expiryDate !== undefined) updateData.expiry_date = license.expiryDate;
    if (license.status !== undefined) updateData.status = license.status;
    if (license.fileUrl !== undefined) updateData.file_url = license.fileUrl;

    const { error } = await supabase
      .from('licenses')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Error updating license:', error);
      return;
    }

    await fetchLicenses();
  };

  const deleteLicense = async (id: string) => {
    const { error } = await supabase
      .from('licenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting license:', error);
      return;
    }

    await fetchLicenses();
  };

  const addDocument = async (document: Omit<Document, 'id' | 'uploadedAt'>) => {
    const { error } = await supabase
      .from('documents')
      .insert([{
        employee_id: document.employeeId,
        title: document.title,
        type: document.type,
        file_url: document.fileUrl,
        file_size: document.fileSize,
        uploaded_by: document.uploadedBy
      }]);

    if (error) {
      console.error('Error adding document:', error);
      return;
    }

    await fetchDocuments();
  };

  const deleteDocument = async (id: string) => {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting document:', error);
      return;
    }

    await fetchDocuments();
  };

  const getEmployeeDocuments = (employeeId: string) => {
    return documents.filter((doc) => doc.employeeId === employeeId);
  };

  const getEmployeeLicenses = (employeeId: string) => {
    return licenses.filter((lic) => lic.employeeId === employeeId);
  };

  const getEmployeeById = (id: string) => {
    return employees.find((emp) => emp.id === id);
  };

  const getEmployeeDeletionInfo = (id: string) => {
    const employee = getEmployeeById(id);
    const employeeDocuments = getEmployeeDocuments(id);
    const employeeLicenses = getEmployeeLicenses(id);

    return {
      employee,
      documentCount: employeeDocuments.length,
      licenseCount: employeeLicenses.length,
    };
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        locations,
        licenses,
        documents,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addLocation,
        updateLocation,
        deleteLocation,
        addLicense,
        updateLicense,
        deleteLicense,
        addDocument,
        deleteDocument,
        getEmployeeDocuments,
        getEmployeeLicenses,
        getEmployeeById,
        getEmployeeDeletionInfo,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
