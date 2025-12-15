import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
    // Check for existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const supabaseUser = session.user;
        const role = supabaseUser.user_metadata?.role as 'admin' | 'employee' | 'payroll';
        const name = supabaseUser.user_metadata?.name || supabaseUser.email || '';
        const isFirstLogin = supabaseUser.user_metadata?.is_first_login ?? false;

        setUser({
          email: supabaseUser.email || '',
          name,
          role,
          isFirstLogin
        });
      }
      setIsLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const supabaseUser = session.user;
        const role = supabaseUser.user_metadata?.role as 'admin' | 'employee' | 'payroll';
        const name = supabaseUser.user_metadata?.name || supabaseUser.email || '';
        const isFirstLogin = supabaseUser.user_metadata?.is_first_login ?? false;

        setUser({
          email: supabaseUser.email || '',
          name,
          role,
          isFirstLogin
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; role?: 'admin' | 'employee' | 'payroll'; isFirstLogin?: boolean }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error || !data.user) {
        console.error('Login error:', error);
        return { success: false };
      }

      const role = data.user.user_metadata?.role as 'admin' | 'employee' | 'payroll';
      const name = data.user.user_metadata?.name || data.user.email || '';
      const isFirstLogin = data.user.user_metadata?.is_first_login ?? false;

      setUser({
        email: data.user.email || '',
        name,
        role,
        isFirstLogin
      });

      return { success: true, role, isFirstLogin };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  };

  const updateUserFirstLogin = async (isFirstLogin: boolean) => {
    try {
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
      
      if (error || !supabaseUser) {
        console.error('Error getting user:', error);
        return;
      }

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          ...supabaseUser.user_metadata,
          is_first_login: isFirstLogin
        }
      });

      if (updateError) {
        console.error('Error updating user metadata:', updateError);
        return;
      }

      // Update local state
      if (user) {
        setUser({ ...user, isFirstLogin });
      }
    } catch (error) {
      console.error('Error updating first login status:', error);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
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
