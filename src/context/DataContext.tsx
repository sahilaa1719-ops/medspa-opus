import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, Location, License, Document } from '@/types';
import { mockEmployees, mockLocations, mockLicenses, mockDocuments } from '@/data/mockData';

interface DataContextType {
  employees: Employee[];
  locations: Location[];
  licenses: License[];
  documents: Document[];
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  addLocation: (location: Omit<Location, 'id' | 'createdAt'>) => void;
  updateLocation: (id: string, location: Partial<Location>) => void;
  deleteLocation: (id: string) => void;
  addLicense: (license: Omit<License, 'id' | 'createdAt'>) => void;
  updateLicense: (id: string, license: Partial<License>) => void;
  deleteLicense: (id: string) => void;
  addDocument: (document: Omit<Document, 'id' | 'uploadedAt'>) => void;
  deleteDocument: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [licenses, setLicenses] = useState<License[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const storedEmployees = localStorage.getItem('medspa_employees');
    const storedLocations = localStorage.getItem('medspa_locations');
    const storedLicenses = localStorage.getItem('medspa_licenses');
    const storedDocuments = localStorage.getItem('medspa_documents');

    setEmployees(storedEmployees ? JSON.parse(storedEmployees) : mockEmployees);
    setLocations(storedLocations ? JSON.parse(storedLocations) : mockLocations);
    setLicenses(storedLicenses ? JSON.parse(storedLicenses) : mockLicenses);
    setDocuments(storedDocuments ? JSON.parse(storedDocuments) : mockDocuments);
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem('medspa_employees', JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    if (locations.length > 0) {
      localStorage.setItem('medspa_locations', JSON.stringify(locations));
    }
  }, [locations]);

  useEffect(() => {
    if (licenses.length > 0) {
      localStorage.setItem('medspa_licenses', JSON.stringify(licenses));
    }
  }, [licenses]);

  useEffect(() => {
    if (documents.length > 0) {
      localStorage.setItem('medspa_documents', JSON.stringify(documents));
    }
  }, [documents]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addEmployee = (employee: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...employee,
      id: generateId(),
      createdAt: new Date(),
    };
    setEmployees((prev) => [...prev, newEmployee]);
  };

  const updateEmployee = (id: string, employee: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...employee } : emp))
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    setLicenses((prev) => prev.filter((lic) => lic.employeeId !== id));
    setDocuments((prev) => prev.filter((doc) => doc.employeeId !== id));
  };

  const addLocation = (location: Omit<Location, 'id' | 'createdAt'>) => {
    const newLocation: Location = {
      ...location,
      id: generateId(),
      createdAt: new Date(),
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const updateLocation = (id: string, location: Partial<Location>) => {
    setLocations((prev) =>
      prev.map((loc) => (loc.id === id ? { ...loc, ...location } : loc))
    );
  };

  const deleteLocation = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const addLicense = (license: Omit<License, 'id' | 'createdAt'>) => {
    const newLicense: License = {
      ...license,
      id: generateId(),
      createdAt: new Date(),
    };
    setLicenses((prev) => [...prev, newLicense]);
  };

  const updateLicense = (id: string, license: Partial<License>) => {
    setLicenses((prev) =>
      prev.map((lic) => (lic.id === id ? { ...lic, ...license } : lic))
    );
  };

  const deleteLicense = (id: string) => {
    setLicenses((prev) => prev.filter((lic) => lic.id !== id));
  };

  const addDocument = (document: Omit<Document, 'id' | 'uploadedAt'>) => {
    const newDocument: Document = {
      ...document,
      id: generateId(),
      uploadedAt: new Date(),
    };
    setDocuments((prev) => [...prev, newDocument]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
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
