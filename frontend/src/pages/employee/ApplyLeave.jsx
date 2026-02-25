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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { type: 'casual', icon: '🏖️', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20' },
            { type: 'sick', icon: '🏥', color: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20' },
            { type: 'earned', icon: '⭐', color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' },
            { type: 'unpaid', icon: '💼', color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700' }
          ].map(item => (
            <div key={item.type} className={`rounded-3xl border p-5 text-center transition-all hover:shadow-lg dark:hover:bg-slate-800/50 ${item.color}`}>
              <div className="text-2xl mb-2">{item.icon}</div>
              <div className="text-3xl font-black">{item.type === 'unpaid' ? '∞' : (balance[item.type] ?? 0)}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest mt-1">{item.type}</div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="card p-8">
          <h2 className="section-title mb-6 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            New Leave Request
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Leave Type */}
            <div>
              <label className="form-label">Leave Type</label>
              <div className="grid grid-cols-2 gap-3">
                {leaveTypes.map(lt => (
                  <button
                    key={lt.value}
                    type="button"
                    onClick={() => f('leaveType', lt.value)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${form.leaveType === lt.value
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center text-xl">
                        {lt.icon}
                      </div>
                      <div>
                        <div className={`text-sm font-extrabold ${form.leaveType === lt.value ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}`}>{lt.label}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium line-clamp-1">{lt.desc}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.leaveType && <p className="form-error">{errors.leaveType}</p>}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="form-label">From</label>
                <input
                  type="date"
                  min={today}
                  value={form.startDate}
                  onChange={e => f('startDate', e.target.value)}
                  className={`input ${errors.startDate ? 'input-error' : ''}`}
                />
                {errors.startDate && <p className="form-error">{errors.startDate}</p>}
              </div>
              <div>
                <label className="form-label">Until</label>
                <input
                  type="date"
                  min={form.startDate || today}
                  value={form.endDate}
                  onChange={e => f('endDate', e.target.value)}
                  className={`input ${errors.endDate ? 'input-error' : ''}`}
                />
                {errors.endDate && <p className="form-error">{errors.endDate}</p>}
              </div>
            </div>

            {/* Days preview */}
            {totalDays > 0 && (
              <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl px-5 py-4 flex items-center gap-3 text-emerald-700 dark:text-emerald-400">
                <div className="text-2xl">⏳</div>
                <div className="text-sm">
                  <span className="font-bold opacity-70 block uppercase tracking-tighter text-[10px] mb-0.5">Calculated Duration</span>
                  <span className="font-black text-lg">{totalDays} working day{totalDays !== 1 ? 's' : ''}</span>
                </div>
              </div>
            )}

            {/* Reason */}
            <div>
              <label className="form-label">Reason for Request</label>
              <textarea
                rows={4}
                value={form.reason}
                onChange={e => f('reason', e.target.value)}
                className={`input resize-none ${errors.reason ? 'input-error' : ''}`}
                placeholder="Briefly explain the purpose of this leave..."
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-2 px-1">
                {errors.reason ? <p className="form-error !mt-0">{errors.reason}</p> : <span />}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{form.reason.length} / 500</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex-1 px-8"
              >
                Go Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-[2]"
              >
                {loading && <LoadingSpinner size="sm" />}
                {loading ? 'Submitting request...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLeave;
