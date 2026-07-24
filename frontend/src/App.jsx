import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
