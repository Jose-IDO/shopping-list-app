import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

import bcrypt from 'bcryptjs';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cellNumber: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cellNumber: string;
}

interface StoredUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  cellNumber: string;
  hashedPassword: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      const userExists = existingUsers.find(u => u.email === userData.email);
      
      if (userExists) {
        return { success: false, error: 'User with this email already exists' };
      }


      const hashedPassword = await bcrypt.hash(userData.password, 10);
      

      const newUser: StoredUser = {
        id: Date.now().toString(), 
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        cellNumber: userData.cellNumber,
        hashedPassword
      };


      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      const foundUser = existingUsers.find(u => u.email === email);
      
      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }


      const passwordMatch = await bcrypt.compare(password, foundUser.hashedPassword);
      
      if (!passwordMatch) {
        return { success: false, error: 'Invalid email or password' };
      }


      const authenticatedUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        cellNumber: foundUser.cellNumber
      };

      setUser(authenticatedUser);
      setIsAuthenticated(true);
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = async (profileData: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    try {
      if (!user) {
        return { success: false, error: 'No user logged in' };
      }


      const updatedUser = { ...user, ...profileData };
      

      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
      const userIndex = existingUsers.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        existingUsers[userIndex] = { ...existingUsers[userIndex], ...profileData };
        localStorage.setItem('users', JSON.stringify(existingUsers));
      }


      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Profile update failed. Please try again.' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};