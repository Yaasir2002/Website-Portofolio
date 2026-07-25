import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminPortfolios from './pages/AdminPortfolios';
import AdminCategories from './pages/AdminCategories';
import AdminProfile from './pages/AdminProfile';
import AdminMessages from './pages/AdminMessages';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#F8FAFC',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '16px',
              padding: '12px 18px',
              fontSize: '13px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 182, 212, 0.2)',
              fontFamily: 'Inter, sans-serif',
            },
            success: {
              iconTheme: {
                primary: '#06B6D4',
                secondary: '#0F172A',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#0F172A',
              },
            },
          }}
        />

        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Admin Auth Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="portfolios" element={<AdminPortfolios />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Route>

          {/* Fallback wildcard route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
