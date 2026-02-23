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
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl"
            >
                <div className="glass p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Join ELMS</h1>
                        <p className="text-slate-400">Create your account to start managing leaves</p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3.5 text-slate-500" size={20} />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-primary-500 rounded-xl py-3 pl-11 pr-4 outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3.5 text-slate-500" size={20} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-primary-500 rounded-xl py-3 pl-11 pr-4 outline-none transition-all"
                                    placeholder="john@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3.5 text-slate-500" size={20} />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-primary-500 rounded-xl py-3 pl-11 pr-4 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2 md:col-span-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">Department</label>
                            <div className="relative group">
                                <Briefcase className="absolute left-3 top-3.5 text-slate-500" size={20} />
                                <input
                                    name="department"
                                    type="text"
                                    required
                                    value={formData.department}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-800 focus:border-primary-500 rounded-xl py-3 pl-11 pr-4 outline-none transition-all"
                                    placeholder="Engineering"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-slate-900/50 border border-slate-800 focus:border-primary-500 rounded-xl py-3 px-4 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="employee">Employee</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full col-span-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-70 mt-4"
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

                    <p className="text-center mt-8 text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold underline decoration-primary-900 underline-offset-4">
                            Log in instead
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
