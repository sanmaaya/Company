import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, User, Briefcase, Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
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
        <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden bg-brand-bg">
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-30 translate-y-1/2 translate-x-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-2xl p-8 md:p-12 rounded-[32px] relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="brand text-2xl font-extrabold tracking-tighter text-emerald-600 flex items-center justify-center gap-2 mb-4">
                        <div className="brand-dot"></div> LeaveSync
                    </div>
                    <h1 className="text-4xl font-syne font-extrabold text-brand-text mb-2">Create Account</h1>
                    <p className="text-brand-muted font-medium italic">Join the modern way of leave management</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3 text-brand-muted" size={20} />
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-white border border-brand-border focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3 text-brand-muted" size={20} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white border border-brand-border focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-brand-muted" size={20} />
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white border border-brand-border focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Department</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-3 text-brand-muted" size={20} />
                            <input
                                name="department"
                                type="text"
                                required
                                value={formData.department}
                                onChange={handleChange}
                                className="w-full bg-white border border-brand-border focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="Engineering"
                            />
                        </div>
                    </div>

                    <div className="space-y-2 col-span-2">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-white border border-brand-border focus:border-emerald-500 rounded-xl py-3 px-4 outline-none transition-all appearance-none cursor-pointer text-brand-text font-medium"
                        >
                            <option value="employee">Employee</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full col-span-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Create Account</span>
                                <Plus className="group-hover:rotate-90 transition-transform" size={20} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-brand-muted font-medium text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-extrabold underline decoration-emerald-200 underline-offset-4 transition-all">
                        Log in instead
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
