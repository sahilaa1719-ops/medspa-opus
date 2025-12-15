import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  email: string;
  name: string;
  role: 'admin' | 'employee' | 'payroll';
  isFirstLogin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: 'admin' | 'employee' | 'payroll'; isFirstLogin?: boolean }>
  logout: () => void;
  isLoading: boolean;
  updateUserFirstLogin: (isFirstLogin: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('medspa_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('medspa_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; role?: 'admin' | 'employee' | 'payroll'; isFirstLogin?: boolean }> => {
    try {
      // Query the users table directly (simple table-based auth for demo/MVP)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password_hash', password)
        .single();

      if (userError || !userData) {
        console.error('Login error:', userError);
        return { success: false };
      }

      const user: User = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        isFirstLogin: userData.is_first_login ?? true
      };

      setUser(user);
      localStorage.setItem('medspa_user', JSON.stringify(user));

      return { success: true, role: userData.role, isFirstLogin: userData.is_first_login ?? true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const updateUserFirstLogin = (isFirstLogin: boolean) => {
    if (user) {
      const updatedUser = { ...user, isFirstLogin };
      setUser(updatedUser);
      localStorage.setItem('medspa_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medspa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUserFirstLogin }}>
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
