'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface SupabaseContextType {
  currentPackage: string | null;
  authToken: string | null;
  login: (packageName: string, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [currentPackage, setCurrentPackage] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage
    const savedPackage = localStorage.getItem('remote_logger_package');
    const savedToken = localStorage.getItem('remote_logger_token');
    if (savedPackage && savedToken) {
      setCurrentPackage(savedPackage);
      setAuthToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = (packageName: string, token: string) => {
    setCurrentPackage(packageName);
    setAuthToken(token);
    localStorage.setItem('remote_logger_package', packageName);
    localStorage.setItem('remote_logger_token', token);
  };

  const logout = () => {
    setCurrentPackage(null);
    setAuthToken(null);
    localStorage.removeItem('remote_logger_package');
    localStorage.removeItem('remote_logger_token');
  };

  return (
    <SupabaseContext.Provider value={{ currentPackage, authToken, login, logout, isLoading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
