import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user from cached localStorage for instant flicker-free load
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('adminUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loginTime, setLoginTime] = useState(localStorage.getItem('adminLoginTime') || null);
  const [loading, setLoading] = useState(true);

  // Restore and verify active session on mount
  useEffect(() => {
    const verifySession = async () => {
      if (token) {
        try {
          // Fetch authenticated admin session data
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('adminUser', JSON.stringify(res.data));
        } catch (err) {
          console.warn('Session verification failed or expired:', err.message);
          logout();
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    verifySession();
  }, [token]);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: newToken, ...userData } = res.data;

    const timestamp = new Date().toISOString();

    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    localStorage.setItem('adminLoginTime', timestamp);

    setToken(newToken);
    setUser(userData);
    setLoginTime(timestamp);

    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminLoginTime');
    setToken(null);
    setUser(null);
    setLoginTime(null);
  };

  const updateProfileData = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    // Refresh user state
    setUser((prev) => ({ ...prev, ...res.data }));
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginTime,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        logout,
        updateProfileData,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
