import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, Phone, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'employee',
        department: '',
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await register(formData);
        setLoading(false);

        if (result.success) {
            toast.success('Registration Successful!');
            navigate('/');
        } else {
            toast.error(result.message);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-2xl p-8 md:p-12 rounded-[2.5rem] relative z-10 border-white/50 dark:border-slate-800/50 glow-emerald"
            >
                <div className="text-center mb-10">
                    <div className="text-2xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2 mb-4">
                        <div className="w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-[10px] shadow-lg shadow-emerald-500/20">🌿</div>
                        EmployeeSync
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Create Account</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Start your modern workspace journey</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="form-label ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="input !pl-12 !py-3.5"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="form-label ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="input !pl-12 !py-3.5"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="form-label ml-1">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="tel"
                                name="phoneNumber"
                                required
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="input !pl-12 !py-3.5"
                                placeholder="e.g. 9999999999"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="form-label ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="input !pl-12 !py-3.5"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="form-label ml-1">Department</label>
                        <div className="relative group">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                name="department"
                                type="text"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                className="input !pl-12 !py-3.5"
                                placeholder="Engineering"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="form-label ml-1">Onboarding Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="input !py-[13px] cursor-pointer"
                        >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full col-span-2 btn-primary !py-4 rounded-2xl !text-base font-black tracking-tight group overflow-hidden relative mt-4"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <div className="flex items-center justify-center gap-2">
                                <span>Create Workspace Account</span>
                                <Plus className="group-hover:rotate-90 transition-transform" size={20} />
                            </div>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                        Already have access?{' '}
                        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all ml-1">
                            Go to Login
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
