import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            toast.success('Login Successful!');
            navigate('/dashboard');
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-md p-10 rounded-[2.5rem] relative z-10 border-white/50 dark:border-slate-800/50 glow-emerald"
            >
                <div className="text-center mb-10">
                    <div className="text-3xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20">🌿</div>
                        EmployeeSync
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Welcome Back</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">Secure Gateway Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="form-label ml-1">Work Email</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input !pl-12 !py-4"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="form-label ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input !pl-12 !py-4"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary !py-4 rounded-2xl !text-base font-black tracking-tight group overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <div className="flex items-center gap-2">
                                <span>Access Workspace</span>
                                <LogIn className="group-hover:translate-x-1 transition-transform" size={20} />
                            </div>
                        )}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                        New team member?{' '}
                        <Link to="/register" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all ml-1">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
