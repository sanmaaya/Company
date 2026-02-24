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
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-brand-bg">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass w-full max-w-md p-8 rounded-[32px] relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="brand text-2xl font-extrabold tracking-tighter text-emerald-600 flex items-center justify-center gap-2 mb-4">
                        <div className="brand-dot"></div> LeaveSync
                    </div>
                    <h1 className="text-3xl font-syne font-extrabold text-brand-text mb-2">Welcome Back</h1>
                    <p className="text-brand-muted font-medium italic">Sign in to your workspace</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3 text-brand-muted" size={20} />
                            <input
                                type="email"
                                name="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-brand-border focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="name@company.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-muted uppercase tracking-wider ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3 text-brand-muted" size={20} />
                            <input
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white border border-brand-border focus:border-emerald-500 rounded-xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-slate-400 font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <span>Sign In</span>
                                <LogIn className="group-hover:translate-x-1 transition-transform" size={20} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-brand-muted font-medium text-sm">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-extrabold underline decoration-emerald-200 underline-offset-4 transition-all">
                        Register now
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
