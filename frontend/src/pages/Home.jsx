import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import Footer from '../components/layout/Footer';

const Home = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
        }, { threshold: 0.08 });
        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, []);

    return (
        <div className="bg-brand-bg font-sans text-brand-text">
            {/* NAV */}
            <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-14 h-[68px] bg-white/90 backdrop-blur-xl border-b border-brand-border shadow-sm">
                <div className="text-[1.35rem] font-extrabold tracking-tighter text-emerald-600 flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-600 rounded-full shadow-lg shadow-emerald-200"></div> EmployeeSync
                </div>
                <ul className="hidden md:flex gap-8 list-none">
                    <li><a href="#features" className="text-brand-muted hover:text-emerald-600 font-medium text-sm transition-colors">Features</a></li>
                    <li><a href="#dashboard" className="text-brand-muted hover:text-emerald-600 font-medium text-sm transition-colors">Dashboard</a></li>
                    <li><a href="#how" className="text-brand-muted hover:text-emerald-600 font-medium text-sm transition-colors">How it works</a></li>
                    <li><a href="#pricing" className="text-brand-muted hover:text-emerald-600 font-medium text-sm transition-colors">Pricing</a></li>
                </ul>
                <div className="flex gap-4 items-center">
                    <Link to="/login" className="px-5 py-2 border-1.5 border-emerald-100 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 font-medium text-sm rounded-lg transition-all">Sign In</Link>
                    <Link to="/register" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg shadow-lg shadow-emerald-200 transition-all">Get Started</Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative overflow-hidden bg-brand-bg">
                <div className="absolute w-[700px] h-[700px] bg-[radial-gradient(ellipse,_rgba(74,222,128,0.18)_0%,_transparent_70%)] top-[-100px] right-[-100px] rounded-full animate-pulse"></div>
                <div className="absolute w-[500px] h-[500px] bg-[radial-gradient(ellipse,_rgba(22,163,74,0.1)_0%,_transparent_70%)] bottom-[-50px] left-[-100px] rounded-full animate-pulse"></div>
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_#d1fae5_1.5px,_transparent_1.5px)] bg-[length:40px_40px] opacity-70"></div>

                <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center text-center lg:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[0.78rem] font-bold text-emerald-600 mb-7">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            Trusted by 5,000+ companies worldwide
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-[-0.05em] mb-6 text-brand-text">
                            Workforce Management<br />Made <span className="text-emerald-600 relative">Effortless</span>
                        </h1>
                        <p className="text-[1.05rem] text-brand-muted mb-9 leading-relaxed max-w-[440px] mx-auto lg:mx-0">
                            Empower your team with EmployeeSync. Streamline leave requests, approvals, and tracking for your entire workforce — in one modern platform.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                            <button onClick={() => navigate('/register')} className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                                Start Free Trial →
                            </button>
                            <button onClick={() => navigate('/login')} className="px-8 py-3.5 bg-white border border-emerald-100 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 font-bold text-base rounded-xl shadow-sm transition-all">
                                View Demo
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute top-[-20px] right-[-28px] min-w-[148px] glass p-4 rounded-xl shadow-xl z-20 hidden md:block">
                            <div className="text-[0.67rem] text-brand-muted font-bold uppercase tracking-wider mb-1">Pending Today</div>
                            <div className="font-syne text-2xl font-extrabold text-emerald-600">3 <span className="font-sans text-sm font-normal text-brand-muted">requests</span></div>
                            <div className="text-[0.68rem] text-brand-muted mt-0.5">⚡ 2 need your approval</div>
                        </div>

                        <div className="bg-white rounded-[20px] p-6 shadow-2xl border border-brand-border relative z-10 transition-transform hover:scale-[1.02] duration-500">
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-syne text-sm font-bold">Employee Dashboard</h3>
                                <button className="px-3 py-1.5 bg-emerald-600 text-white text-[0.76rem] font-bold rounded-lg">+ Apply Leave</button>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                                    <div className="font-syne text-2xl font-extrabold text-emerald-600">2</div>
                                    <div className="text-[0.68rem] text-brand-muted font-bold mt-1 uppercase">Pending</div>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                                    <div className="font-syne text-2xl font-extrabold text-emerald-600">5</div>
                                    <div className="text-[0.68rem] text-brand-muted font-bold mt-1 uppercase">Approved</div>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                                    <div className="font-syne text-2xl font-extrabold text-emerald-600">12</div>
                                    <div className="text-[0.68rem] text-brand-muted font-bold mt-1 uppercase">Days Left</div>
                                </div>
                            </div>
                            <table className="w-full text-left text-[0.78rem]">
                                <thead>
                                    <tr>
                                        <th className="text-[0.66rem] text-brand-muted uppercase font-bold py-2 border-b border-brand-border">Type</th>
                                        <th className="text-[0.66rem] text-brand-muted uppercase font-bold py-2 border-b border-brand-border">Date</th>
                                        <th className="text-[0.66rem] text-brand-muted uppercase font-bold py-2 border-b border-brand-border">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="py-2.5 border-b border-brand-border">Sick Leave</td><td className="py-2.5 border-b border-brand-border">Jun 23</td><td className="py-2.5 border-b border-brand-border"><span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-[0.67rem] font-bold rounded-full">Pending</span></td></tr>
                                    <tr><td className="py-2.5 border-b border-brand-border">Casual</td><td className="py-2.5 border-b border-brand-border">Jun 18</td><td className="py-2.5 border-b border-brand-border"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[0.67rem] font-bold rounded-full">Approved</span></td></tr>
                                    <tr><td className="py-2.5">Earned</td><td className="py-2.5">Jun 10</td><td className="py-2.5"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[0.67rem] font-bold rounded-full">Approved</span></td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="absolute bottom-[-20px] left-[-28px] min-w-[165px] glass p-4 rounded-xl shadow-xl z-20 hidden md:block">
                            <div className="text-[0.67rem] text-brand-muted font-bold uppercase tracking-wider mb-1">Approval Rate</div>
                            <div className="font-syne text-2xl font-extrabold text-emerald-600">94%</div>
                            <div className="text-[0.68rem] text-brand-muted mt-0.5">✅ Above company average</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES */}
            <section id="features" className="py-24 px-6 md:px-14 bg-white">
                <div className="max-w-7xl mx-auto reveal">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-14">
                        <div className="max-w-xl text-center md:text-left">
                            <div className="inline-block text-[0.72rem] font-bold tracking-[0.2em] uppercase text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full mb-4">Features</div>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-brand-text mb-4">Built for modern HR teams</h2>
                        </div>
                        <p className="text-brand-muted text-base max-w-[480px] leading-relaxed text-center md:text-left">
                            Everything from application to approval — automated, tracked, and beautifully presented.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <FeatureCard icon="📋" title="Quick Leave Application" desc="Apply for any leave type in under 30 seconds. Date picker, leave type selector, and reason field — simple as that." />
                        <FeatureCard icon="⚡" title="Instant Approvals" desc="Managers get real-time notifications and can approve or reject with one click — from desktop or mobile." />
                        <FeatureCard icon="📊" title="Live Balance Tracking" desc="Sick, casual, earned — all leave balances update in real time. No spreadsheets, no manual counting ever again." />
                        <FeatureCard icon="📅" title="Team Calendar" desc="See your whole team's availability at a glance. Plan projects and meetings without surprise absences." />
                        <FeatureCard icon="🔐" title="Role-Based Access" desc="Employee, Manager, and Admin dashboards. Everyone sees exactly what they need — nothing more, nothing less." />
                        <FeatureCard icon="📈" title="Reports & Analytics" desc="Generate leave reports by team, employee, or date. Export as PDF or CSV for payroll and compliance needs." />
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 px-6 md:px-14 text-center bg-emerald-900 relative overflow-hidden reveal">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.06)_1px,_transparent_1px)] bg-[length:30px_30px]"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-white mb-6">Ready to simplify your<br />team's time off?</h2>
                    <p className="text-white/75 text-lg max-w-[450px] mx-auto mb-10 leading-relaxed">Join thousands of companies managing leaves the modern way. Get started in minutes — completely free.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate('/register')} className="px-8 py-4 bg-white text-emerald-800 font-bold rounded-xl shadow-xl hover:translate-y-[-2px] transition-all">
                            Start for Free — No Credit Card
                        </button>
                        <button className="px-8 py-4 bg-transparent border-1.5 border-white/50 text-white font-bold rounded-xl hover:bg-white/10 transition-all">
                            Schedule a Demo
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-brand-bg border border-brand-border rounded-2xl p-8 group hover:translate-y-[-4px] hover:shadow-xl hover:border-emerald-200 hover:bg-white transition-all duration-300 relative overflow-hidden">
        <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-xl mb-5">{icon}</div>
        <h3 className="text-[0.97rem] font-bold text-brand-text mb-2.5">{title}</h3>
        <p className="text-brand-muted text-[0.86rem] leading-relaxed">{desc}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
    </div>
);

export default Home;
