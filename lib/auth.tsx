'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  id: string;
  name: string;
  email: string;
  profile_pic: string;
  city?: string;
  lat?: number;
  lng?: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check localStorage for mock session
    const storedUser = localStorage.getItem('collabmap_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    // Mock login - in a real app, this would hit an API
    // For now, we'll fetch the user from our API based on email to simulate a real user
    try {
      const res = await fetch(`/api/users?email=${email}`);
      const users = await res.json();
      if (users && users.length > 0) {
        const userData = users[0];
        setUser(userData);
        localStorage.setItem('collabmap_user', JSON.stringify(userData));
        router.push('/');
      } else {
        alert('User not found. Try seeded emails like amit@example.com');
      }
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('collabmap_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
