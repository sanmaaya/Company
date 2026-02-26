import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', department: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await register(form);
      toast('Account created! Welcome to LeaveSync.', 'success');
      navigate('/dashboard');
    } catch (err) {
      toast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const f = (field, value) => { setForm({ ...form, [field]: value }); setErrors({ ...errors, [field]: '' }); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-1">Join your team on LeaveSync</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', field: 'name', type: 'text', placeholder: 'John Doe' },
              { label: 'Email Address', field: 'email', type: 'email', placeholder: 'you@company.com' },
              { label: 'Password', field: 'password', type: 'password', placeholder: '••••••••' },
              { label: 'Department (Optional)', field: 'department', type: 'text', placeholder: 'Engineering' }
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                <input
                  type={type}
                  value={form[field]}
                  onChange={e => f(field, e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition`}
                  placeholder={placeholder}
                />
                {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
              </div>
            ))}

            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 border border-blue-100">
              📋 New accounts are created as <strong>Employee</strong>. Contact your admin to update your role.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
            >
              {loading ? <LoadingSpinner size="sm" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
