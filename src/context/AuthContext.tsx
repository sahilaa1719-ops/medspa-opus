import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'employee' | 'payroll';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: 'admin' | 'employee' | 'payroll' }>
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('medspa_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      // Handle backward compatibility for users without role
      if (!parsedUser.role) {
        // Default existing users to admin role (preserves existing behavior)
        parsedUser.role = 'admin';
        localStorage.setItem('medspa_user', JSON.stringify(parsedUser));
      }
      
      setUser(parsedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; role?: 'admin' | 'employee' | 'payroll' }> => {
    // Demo credentials for admin
    if (email === 'admin@medspa.com' && password === 'admin123') {
      const userData = { email, name: 'Admin User', role: 'admin' as const };
      setUser(userData);
      localStorage.setItem('medspa_user', JSON.stringify(userData));
      return { success: true, role: 'admin' };
    }
    
    // Demo credentials for payroll manager
    if (email === 'payroll@medspa.com' && password === 'payroll123') {
      const userData = { email, name: 'Payroll Manager', role: 'payroll' as const };
      setUser(userData);
      localStorage.setItem('medspa_user', JSON.stringify(userData));
      return { success: true, role: 'payroll' };
    }
    
    // Demo credentials for employee
    if (email === 'employee@medspa.com' && password === 'employee123') {
      const userData = { email, name: 'Employee User', role: 'employee' as const };
      setUser(userData);
      localStorage.setItem('medspa_user', JSON.stringify(userData));
      return { success: true, role: 'employee' };
    }
    
    return { success: false };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medspa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
