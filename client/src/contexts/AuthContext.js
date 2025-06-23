import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demo purposes, use localStorage to simulate authentication persistence
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (user) {
      setCurrentUser(user);
    }
    
    setLoading(false);
  }, []);

  // Register a new user
  const register = async (userData) => {
    try {
      // In a real app, this would call your API
      // const response = await axios.post('/api/auth/register', userData);
      
      // For demo, simulate a successful registration
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        role: userData.role || 'client',
        avatar: null
      };
      
      // Set current user
      setCurrentUser(mockUser);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { user: mockUser };
    } catch (error) {
      throw error;
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      // In a real app, this would call your API
      // const response = await axios.post('/api/auth/login', { email, password });
      
      // For demo, simulate a successful login
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        role: 'client', // Default role
        avatar: null
      };
      
      // Set current user
      setCurrentUser(mockUser);
      
      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      return { user: mockUser };
    } catch (error) {
      throw error;
    }
  };

  // Logout user
  const logout = async () => {
    // In a real app, this would call your API
    // await axios.post('/api/auth/logout');
    
    // Clear current user
    setCurrentUser(null);
    
    // Remove from localStorage
    localStorage.removeItem('user');
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
    