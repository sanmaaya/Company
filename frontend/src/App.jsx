import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LeaveProvider } from './context/LeaveContext';
import { ReimbursementProvider } from './context/ReimbursementContext';
import { ToastProvider } from './components/common/Toast';
import { ThemeProvider } from './context/ThemeContext';

// ── Auth Pages ──────────────────────────────────────────────
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import LandingPage from './pages/Home';
import NotFound from './pages/NotFound';

// ── App Pages ───────────────────────────────────────────────
import EmployeeDashboard from './pages/employee/Dashboard';
import ApplyLeave from './pages/employee/ApplyLeave';
import MyLeaves from './pages/employee/MyLeaves';
import Profile from './pages/employee/Profile';
import Contacts from './pages/employee/Contacts';
import Projects from './pages/Projects';
import MyReimbursements from './pages/employee/MyReimbursements';

// ── Manager/Admin Pages ─────────────────────────────────────
import Approvals from './pages/manager/Approvals';
import ReimbursementApprovals from './pages/manager/ReimbursementApprovals';
import Team from './pages/manager/Team';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLeaves from './pages/admin/AdminLeaves';

// ── Shared Components ───────────────────────────────────────
import LoadingSpinner from './components/common/LoadingSpinner';

// ── Protected Route ─────────────────────────────────────────
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return (
    <LeaveProvider>
      <ReimbursementProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ReimbursementProvider>
    </LeaveProvider>
  );
};

// ── Public Route ─────────────────────────────────────────────
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

// ── Role-based Dashboard Redirect ────────────────────────────
const DashboardRedirect = () => {
  const { user } = useAuth();
  if (user?.role === 'admin') return <Navigate to="/admin/users" replace />;
  return <Navigate to="/employee" replace />;
};

// ── App Routes ───────────────────────────────────────────────
const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
    <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
    <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />

    {/* Smart redirect */}
    <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />

    {/* Protected routes */}
    <Route path="/employee" element={<ProtectedRoute><EmployeeDashboard /></ProtectedRoute>} />
    <Route path="/apply-leave" element={<ProtectedRoute roles={['employee', 'manager']}><ApplyLeave /></ProtectedRoute>} />
    <Route path="/my-leaves" element={<ProtectedRoute roles={['employee', 'manager']}><MyLeaves /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
    <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
    <Route path="/reimbursements" element={<ProtectedRoute roles={['employee', 'manager', 'admin']}><MyReimbursements /></ProtectedRoute>} />

    {/* Manager/Admin routes */}
    <Route path="/approvals" element={<ProtectedRoute roles={['manager', 'admin']}><Approvals /></ProtectedRoute>} />
    <Route path="/reimbursement-approvals" element={<ProtectedRoute roles={['manager', 'admin']}><ReimbursementApprovals /></ProtectedRoute>} />
    <Route path="/team" element={<ProtectedRoute roles={['admin']}><Team /></ProtectedRoute>} />
    <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
    <Route path="/admin/leaves" element={<ProtectedRoute roles={['admin']}><AdminLeaves /></ProtectedRoute>} />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

// ── Root App ─────────────────────────────────────────────────
const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#fff',
              color: '#111827',
              fontSize: '14px',
              borderRadius: '10px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            },
            success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
            error: { iconTheme: { primary: '#dc2626', secondary: '#fff' } },
          }}
        />
      </Router>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
