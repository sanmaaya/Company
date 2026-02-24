import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeaveProvider } from './context/LeaveContext';
import { ToastProvider } from './components/common/Toast';
import ProtectedRoute from './components/common/ProtectedRoute';
import { PageLoader } from './components/common/LoadingSpinner';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Shared Pages
import Dashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import MyLeaves from './pages/employee/MyLeaves';
import Profile from './pages/employee/Profile';
import Approvals from './pages/manager/Approvals';
import Team from './pages/manager/Team';

// Admin Pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminLeaves from './pages/admin/AdminLeaves';

import Unauthorized from './pages/Unauthorized';

const RoleRedirect = () => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  return <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  const { loading } = useAuth();
  if (loading) return <PageLoader />;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Default redirect */}
      <Route path="/" element={<RoleRedirect />} />

      {/* Protected - All authenticated users */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/apply-leave" element={
        <ProtectedRoute>
          <ApplyLeave />
        </ProtectedRoute>
      } />
      <Route path="/my-leaves" element={
        <ProtectedRoute>
          <MyLeaves />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Manager + Admin routes */}
      <Route path="/approvals" element={
        <ProtectedRoute roles={['manager', 'admin']}>
          <Approvals />
        </ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute roles={['manager', 'admin']}>
          <Team />
        </ProtectedRoute>
      } />

      {/* Admin-only routes */}
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <AdminUsers />
        </ProtectedRoute>
      } />
      <Route path="/admin/leaves" element={
        <ProtectedRoute roles={['admin']}>
          <AdminLeaves />
        </ProtectedRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <LeaveProvider>
            <AppRoutes />
          </LeaveProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
