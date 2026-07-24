import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data);
        } catch (err) {
          console.error('Failed to load profile:', err);
          // Clear invalid token
          localStorage.removeItem('adminToken');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [token]);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: newToken, ...userData } = res.data;
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUser(null);
  };

  const updateProfileData = async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateProfileData, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
