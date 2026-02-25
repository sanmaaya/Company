import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Phone, Lock, Key, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP & New Password
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [demoOtp, setDemoOtp] = useState(null); // Just for demo
    const navigate = useNavigate();

    const handleRequestOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password-phone', { phoneNumber });
            if (res.data.success) {
                toast.success('Verification code sent!');
                if (res.data.demoOTP) setDemoOtp(res.data.demoOTP); // DEMO ONLY
                setStep(2);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password-phone', {
                phoneNumber,
                otp,
                password: newPassword
            });
            if (res.data.success) {
                toast.success('Password reset successful!');
                navigate('/login');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Reset failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass w-full max-w-md p-10 rounded-[2.5rem] relative z-10 border-white/50 dark:border-slate-800/50 glow-emerald"
            >
                <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors mb-8 group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Login</span>
                </Link>

                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-emerald-600/10 rounded-3xl flex items-center justify-center text-emerald-600 text-3xl mx-auto mb-6 shadow-inner ring-1 ring-emerald-500/20">
                        {step === 1 ? '📱' : '🔐'}
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">
                        {step === 1 ? 'Forgot Password?' : 'Reset Password'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                        {step === 1 ? 'Verify your identity via phone' : 'Create your new credentials'}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleRequestOTP}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="form-label ml-1">Registered Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type="tel"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="input !pl-12 !py-4"
                                        placeholder="e.g. 9999999999"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !py-4 rounded-2xl !text-base font-black tracking-tight group overflow-hidden relative"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Send Verification Code</span>
                                        <ArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" size={20} />
                                    </div>
                                )}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            onSubmit={handleResetPassword}
                            className="space-y-6"
                        >
                            {demoOtp && (
                                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6 flex items-start gap-3">
                                    <CheckCircle2 className="text-emerald-500 mt-0.5" size={18} />
                                    <div>
                                        <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Demo OTP Received</p>
                                        <p className="text-2xl font-black text-slate-800 dark:text-white tracking-[0.5em] mt-1">{demoOtp}</p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="form-label ml-1">6-Digit Verification Code</label>
                                <div className="relative group">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="input !pl-12 !py-4 tracking-[0.3em] font-black text-lg"
                                        placeholder="000000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="form-label ml-1">New Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="input !pl-12 !py-4"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary !py-4 rounded-2xl !text-base font-black tracking-tight"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin" size={24} />
                                ) : (
                                    <span>Reset & Restore Account</span>
                                )}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                        Remembered?{' '}
                        <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 transition-all ml-1">
                            Go Back
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
