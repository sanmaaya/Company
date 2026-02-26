import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast(`Welcome back, ${user.name}!`, 'success');
      navigate(from, { replace: true });
    } catch (err) {
      toast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role) => {
    const creds = {
      admin: { email: 'admin@leavesync.com', password: 'password123' },
      manager: { email: 'manager@leavesync.com', password: 'password123' },
      employee: { email: 'employee@leavesync.com', password: 'password123' }
    };
    setForm(creds[role]);
    setLoading(true);
    try {
      const user = await login(creds[role].email, creds[role].password);
      toast(`Logged in as ${user.name}!`, 'success');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast(err.response?.data?.message || 'Demo login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">LeaveSync</h1>
          <p className="text-gray-500 mt-1">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition`}
                placeholder="you@company.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition`}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <LoadingSpinner size="sm" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">Register here</Link>
          </p>

          {/* Demo Logins */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center mb-3 font-medium uppercase tracking-wide">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {['admin', 'manager', 'employee'].map(role => (
                <button
                  key={role}
                  onClick={() => demoLogin(role)}
                  disabled={loading}
                  className="py-2 px-2 text-xs font-semibold rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition capitalize disabled:opacity-60"
                >
                  {role === 'admin' ? '🛡️' : role === 'manager' ? '👔' : '👤'} {role}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
