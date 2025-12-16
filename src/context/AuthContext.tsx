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

        // Check if session has expired based on Remember Me setting
        const rememberMe = localStorage.getItem('rememberMe') === 'true';
        const lastActivity = localStorage.getItem('lastActivity');
        const loginTime = localStorage.getItem('loginTime');
        
        if (lastActivity && loginTime) {
          const now = Date.now();
          const lastActivityTime = parseInt(lastActivity);
          const loginTimeStamp = parseInt(loginTime);
          
          // If Remember Me: logout after 24 hours from login
          // If not Remember Me: logout after 12 hours of inactivity
          const shouldLogout = rememberMe
            ? (now - loginTimeStamp > 24 * 60 * 60 * 1000) // 24 hours from login
            : (now - lastActivityTime > 12 * 60 * 60 * 1000); // 12 hours of inactivity
          
          if (shouldLogout) {
            supabase.auth.signOut();
            localStorage.removeItem('lastActivity');
            localStorage.removeItem('loginTime');
            setUser(null);
            setIsLoading(false);
            return;
          }
        }

        setUser({
          email: supabaseUser.email || '',
          name,
          role,
          isFirstLogin
        });
        
        // Update last activity
        localStorage.setItem('lastActivity', Date.now().toString());
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
        localStorage.removeItem('lastActivity');
        localStorage.removeItem('loginTime');
      }
      setIsLoading(false);
    });

    // Track user activity to update lastActivity timestamp
    const updateActivity = () => {
      if (user) {
        localStorage.setItem('lastActivity', Date.now().toString());
      }
    };

    // Listen for user activity
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);
    window.addEventListener('scroll', updateActivity);

    // Check session validity every minute
    const sessionCheckInterval = setInterval(() => {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const lastActivity = localStorage.getItem('lastActivity');
      const loginTime = localStorage.getItem('loginTime');
      
      if (user && lastActivity && loginTime) {
        const now = Date.now();
        const lastActivityTime = parseInt(lastActivity);
        const loginTimeStamp = parseInt(loginTime);
        
        const shouldLogout = rememberMe
          ? (now - loginTimeStamp > 24 * 60 * 60 * 1000) // 24 hours from login
          : (now - lastActivityTime > 12 * 60 * 60 * 1000); // 12 hours of inactivity
        
        if (shouldLogout) {
          supabase.auth.signOut();
          localStorage.removeItem('lastActivity');
          localStorage.removeItem('loginTime');
          setUser(null);
        }
      }
    }, 60000); // Check every minute

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(sessionCheckInterval);
    };
  }, [user]);

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

      // Set login time and last activity
      localStorage.setItem('loginTime', Date.now().toString());
      localStorage.setItem('lastActivity', Date.now().toString());

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
      localStorage.removeItem('lastActivity');
      localStorage.removeItem('loginTime');
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
