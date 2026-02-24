import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeave } from '../../context/LeaveContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const leaveTypes = [
  { value: 'casual', label: 'Casual Leave', icon: '🏖️', desc: 'For personal needs and short breaks' },
  { value: 'sick', label: 'Sick Leave', icon: '🏥', desc: 'For illness and medical appointments' },
  { value: 'earned', label: 'Earned Leave', icon: '⭐', desc: 'Accrued annual leave entitlement' },
  { value: 'unpaid', label: 'Unpaid Leave', icon: '💼', desc: 'Leave without pay when balance is exhausted' }
];

const ApplyLeave = () => {
  const [form, setForm] = useState({ leaveType: '', startDate: '', endDate: '', reason: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { applyLeave } = useLeave();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const balance = user?.leaveBalance || {};
  const today = new Date().toISOString().split('T')[0];

  const totalDays = form.startDate && form.endDate
    ? Math.max(0, Math.round((new Date(form.endDate) - new Date(form.startDate)) / (1000 * 60 * 60 * 24)) + 1)
    : 0;

  const validate = () => {
    const errs = {};
    if (!form.leaveType) errs.leaveType = 'Select leave type';
    if (!form.startDate) errs.startDate = 'Start date required';
    if (!form.endDate) errs.endDate = 'End date required';
    if (form.endDate < form.startDate) errs.endDate = 'End date must be after start date';
    if (!form.reason || form.reason.length < 5) errs.reason = 'Reason must be at least 5 characters';
    if (form.leaveType && form.leaveType !== 'unpaid' && totalDays > (balance[form.leaveType] || 0)) {
      errs.leaveType = `Insufficient balance. Available: ${balance[form.leaveType]} days`;
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await applyLeave(form);
      toast('Leave applied successfully! ✅', 'success');
      navigate('/my-leaves');
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to apply leave', 'error');
    } finally {
      setLoading(false);
    }
  };

  const f = (field, val) => { setForm({ ...form, [field]: val }); setErrors({ ...errors, [field]: '' }); };

  return (
    <DashboardLayout title="Apply for Leave">
      <div className="max-w-2xl mx-auto">
        {/* Balance Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { type: 'casual', icon: '🏖️', color: 'bg-sky-50 border-sky-100 text-sky-700' },
            { type: 'sick', icon: '🏥', color: 'bg-orange-50 border-orange-100 text-orange-700' },
            { type: 'earned', icon: '⭐', color: 'bg-teal-50 border-teal-100 text-teal-700' },
            { type: 'unpaid', icon: '💼', color: 'bg-gray-50 border-gray-200 text-gray-600' }
          ].map(item => (
            <div key={item.type} className={`rounded-lg border p-3 text-center ${item.color}`}>
              <div className="text-lg mb-1">{item.icon}</div>
              <div className="text-xl font-bold">{item.type === 'unpaid' ? '∞' : (balance[item.type] ?? 0)}</div>
              <div className="text-xs font-medium capitalize">{item.type}</div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 text-lg mb-5">New Leave Request</h2>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Leave Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type</label>
              <div className="grid grid-cols-2 gap-2">
                {leaveTypes.map(lt => (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => f('leaveType', lt.value)}
                    className={`p-3 rounded-lg border-2 text-left transition ${
                      form.leaveType === lt.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{lt.icon}</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{lt.label}</div>
                        <div className="text-xs text-gray-400">{lt.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.leaveType && <p className="text-red-500 text-xs mt-1">{errors.leaveType}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  min={today}
                  value={form.startDate}
                  onChange={e => f('startDate', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.startDate ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500 text-sm`}
                />
                {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  min={form.startDate || today}
                  value={form.endDate}
                  onChange={e => f('endDate', e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.endDate ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500 text-sm`}
                />
                {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
              </div>
            </div>

            {/* Days preview */}
            {totalDays > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-center gap-2 text-green-700 text-sm">
                <span>📅</span>
                <span>This leave spans <strong>{totalDays} day{totalDays !== 1 ? 's' : ''}</strong></span>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason</label>
              <textarea
                rows={3}
                value={form.reason}
                onChange={e => f('reason', e.target.value)}
                className={`w-full px-4 py-2.5 rounded-lg border ${errors.reason ? 'border-red-300' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none`}
                placeholder="Briefly describe the reason for your leave request..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.reason ? <p className="text-red-500 text-xs">{errors.reason}</p> : <span />}
                <p className="text-xs text-gray-400">{form.reason.length}/500</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60 text-sm"
              >
                {loading ? <LoadingSpinner size="sm" /> : null}
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;
