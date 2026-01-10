'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/lib/types';
import { mockUsers } from '@/lib/data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, role: 'citizen' | 'official' | 'contractor') => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('smartpark-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user from localStorage', error);
      localStorage.removeItem('smartpark-user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (email: string) => {
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      localStorage.setItem('smartpark-user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('smartpark-user');
    setUser(null);
    router.push('/auth');
  };

  const signup = (name: string, email: string, role: 'citizen' | 'official' | 'contractor') => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false; // User already exists
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      role,
      avatarUrl: 'https://picsum.photos/seed/newuser/100/100'
    };
    mockUsers.push(newUser); // In a real app, this would be an API call
    localStorage.setItem('smartpark-user', JSON.stringify(newUser));
    setUser(newUser);
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
