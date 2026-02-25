import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Monitor, Zap, Shield, BarChart3, Clock, CheckCircle2, ChevronRight, PlayCircle } from 'lucide-react';

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

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'Dashboard', href: '#dashboard' },
        { name: 'How it works', href: '#how' },
        { name: 'Pricing', href: '#pricing' }
    ];

    return (
        <div className="bg-slate-50 font-sans text-slate-900 scroll-smooth">
            {/* NAV */}
            <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-14 h-[72px] bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm transition-all duration-300">
                <div className="text-[1.4rem] font-black tracking-tighter text-emerald-600 flex items-center gap-2.5">
                    <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg shadow-emerald-500/20">🌿</div>
                    EmployeeSync
                </div>
                <ul className="hidden lg:flex gap-10 list-none">
                    {navLinks.map(link => (
                        <li key={link.name}>
                            <a href={link.href} className="text-slate-500 hover:text-emerald-600 font-bold text-sm tracking-tight transition-colors">
                                {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex gap-4 items-center">
                    <Link to="/login" className="px-5 py-2.5 text-slate-600 hover:text-emerald-600 font-bold text-sm transition-all">Sign In</Link>
                    <Link to="/register" className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="min-h-screen flex items-center justify-center pt-32 pb-20 px-6 relative overflow-hidden bg-slate-50">
                <div className="absolute w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] top-[-200px] right-[-200px]"></div>
                <div className="absolute w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] bottom-[-100px] left-[-150px]"></div>

                <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/50 text-[0.75rem] font-black text-emerald-600 mb-8 uppercase tracking-widest">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                            Trusted by 10,000+ Enterprises
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tight mb-8 text-slate-900">
                            The Elite Way to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Manage People.</span>
                        </h1>
                        <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-[500px] mx-auto lg:mx-0 font-medium">
                            Step into the future of HR. Automate leave cycles, track performance in real-time, and empower your workforce with EmployeeSync's next-gen platform.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <button onClick={() => navigate('/register')} className="px-10 py-4.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-[1.4rem] shadow-2xl shadow-emerald-500/30 transition-all flex items-center gap-3 group">
                                Start Your Journey
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => navigate('/login')} className="px-10 py-4.5 bg-white border border-slate-200 hover:border-emerald-600 hover:bg-emerald-50 text-slate-700 font-black text-base rounded-[1.4rem] shadow-sm transition-all flex items-center gap-3">
                                <PlayCircle className="text-emerald-500" />
                                Interactive Demo
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative"
                    >
                        {/* Floating elements for premium feel */}
                        <div className="absolute -top-10 -right-10 bg-white p-6 rounded-3xl shadow-2xl z-20 border border-slate-100 hidden md:block animate-bounce-slow">
                            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">LIVE FEED</div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-xs">🦁</div>
                                <div>
                                    <p className="text-xs font-black">Leave Approved</p>
                                    <p className="text-[10px] text-slate-400">John Doe (Senior Dev)</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 relative z-10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-lg font-black tracking-tight">Main Dashboard</h3>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { lab: 'SICK', val: '2', col: 'bg-emerald-50 text-emerald-600' },
                                    { lab: 'CASUAL', val: '5', col: 'bg-blue-50 text-blue-600' },
                                    { lab: 'EARNED', val: '12', col: 'bg-amber-50 text-amber-600' }
                                ].map(st => (
                                    <div key={st.lab} className={`${st.col} rounded-2xl p-4 text-center border border-current shadow-sm`}>
                                        <div className="text-2xl font-black">{st.val}</div>
                                        <div className="text-[9px] font-black uppercase tracking-wider mt-1">{st.lab}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                {[
                                    { type: 'Backend Overhaul', date: 'Jul 24 - 28', status: 'Pending', sCol: 'text-amber-600' },
                                    { type: 'Family Vacation', date: 'Aug 01 - 10', status: 'Approved', sCol: 'text-emerald-600' }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-tight">{row.type}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{row.date}</p>
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-widest ${row.sCol}`}>{row.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-32 px-6 md:px-14 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto reveal opacity-0 transition-all duration-1000 translate-y-10">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                        <div className="max-w-2xl text-center md:text-left">
                            <div className="inline-block text-[10px] font-black tracking-[0.3em] uppercase text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full mb-6 italic">Engineering Excellence</div>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Designed to replace your entire legacy HR stack.</h2>
                        </div>
                        <p className="text-slate-500 text-lg max-w-[450px] leading-relaxed text-center md:text-left font-medium">
                            Stop fighting with spreadsheets. Start winning with a unified platform for every human interaction.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap className="text-emerald-600" size={24} />}
                            title="Instant Leave Cycles"
                            desc="One-click applications with ML-powered approval suggestions based on team workload."
                        />
                        <FeatureCard
                            icon={<Shield className="text-emerald-600" size={24} />}
                            title="Advanced RBAC"
                            desc="Enterprise-grade security with granular permissions for employees, managers, and system admins."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-emerald-600" size={24} />}
                            title="Analytics Engine"
                            desc="Stunning data visualizations of workforce attendance, productivity trends, and department heatmaps."
                        />
                        <FeatureCard
                            icon={<Clock className="text-emerald-600" size={24} />}
                            title="Real-time Tracking"
                            desc="Live status updates and presence indicators. Know exactly who's in or out at any given moment."
                        />
                        <FeatureCard
                            icon={<CheckCircle2 className="text-emerald-600" size={24} />}
                            title="Compliance Ready"
                            desc="Automated audit logs and tax-ready reports built directly into every transaction."
                        />
                        <FeatureCard
                            icon={<Monitor className="text-emerald-600" size={24} />}
                            title="Omni-Channel Access"
                            desc="A flawless experience across high-res displays, tablets, and mobile devices."
                        />
                    </div>
                </div>
            </section>

            {/* DASHBOARD SHOWCASE SECTION */}
            <section id="dashboard" className="py-32 px-6 md:px-14 bg-slate-50">
                <div className="max-w-7xl mx-auto reveal opacity-0 transition-all duration-1000 translate-y-10 text-center mb-20">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Visual Command Center</h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Experience the interface that your team will actually love to use every day.</p>
                </div>

                <div className="max-w-6xl mx-auto reveal opacity-0 transition-all duration-1000 translate-y-10">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-emerald-600/20 blur-[100px] rounded-full scale-75 group-hover:scale-100 transition-transform duration-700"></div>
                        <div className="relative bg-slate-900 rounded-[3rem] p-4 shadow-3xl border-8 border-slate-800">
                            <div className="bg-slate-800 h-8 rounded-t-[2.5rem] flex items-center px-6 gap-2">
                                <div className="w-2.5 h-2.5 bg-red-400/50 rounded-full"></div>
                                <div className="w-2.5 h-2.5 bg-amber-400/50 rounded-full"></div>
                                <div className="w-2.5 h-2.5 bg-emerald-400/50 rounded-full"></div>
                            </div>
                            <img
                                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
                                alt="Dashboard Interface"
                                className="w-full rounded-b-[2.5rem] grayscale-[0.2] opacity-90"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how" className="py-32 px-6 md:px-14 bg-white relative">
                <div className="max-w-7xl mx-auto reveal opacity-0 transition-all duration-1000 translate-y-10">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Three Steps to Modernity</h2>
                        <p className="text-slate-500 text-lg max-w-xl mx-auto font-medium">Onboarding has never been this fast or this beautiful.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-100 -translate-y-1/2 z-0"></div>

                        {[
                            { step: '01', title: 'System Onboarding', desc: 'Sync your organizational structure and departments in minutes via CSV or direct API integration.' },
                            { step: '02', title: 'Define Leave Policies', desc: 'Granular control over sick, casual, and earned leave quotas. Customize approval chains for every team.' },
                            { step: '03', title: 'Empower Your Team', desc: 'Invite employees to their personal dashboard. Start approving requests and monitoring productivity instantly.' }
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group text-center">
                                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black mx-auto mb-8 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">{item.step}</div>
                                <h3 className="text-xl font-black mb-4">{item.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING SECTION */}
            <section id="pricing" className="py-32 px-6 md:px-14 bg-slate-50">
                <div className="max-w-7xl mx-auto reveal opacity-0 transition-all duration-1000 translate-y-10 text-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">Simple, Scalable Pricing</h2>
                    <p className="text-slate-500 text-lg font-medium">Choose the plan that fits your growth trajectory.</p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 reveal opacity-0 transition-all duration-1000 translate-y-10">
                    {/* Free Plan */}
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group">
                        <div className="text-sm font-black text-emerald-600 mb-2 uppercase tracking-widest italic">Startup</div>
                        <h3 className="text-3xl font-black mb-6">Standard</h3>
                        <div className="mb-8">
                            <span className="text-5xl font-black">$0</span>
                            <span className="text-slate-400 font-bold ml-2">/ month</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-10 font-bold">Perfect for teams up to 10 members looking for essential tools.</p>
                        <ul className="space-y-4 mb-10 text-sm font-bold text-slate-600">
                            {['Up to 10 Employees', 'Basic Leave Tracking', 'Employee Dashboard', 'Email Support'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-emerald-500" size={18} /> {f}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => navigate('/register')} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-2xl transition-all">Get Started Free</button>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-emerald-900 p-10 rounded-[3rem] shadow-emerald-900/40 shadow-2xl relative overflow-hidden group border-8 border-emerald-800/50">
                        <div className="absolute top-8 right-8 bg-emerald-500 text-white text-[10px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest animate-pulse">Most Popular</div>
                        <div className="text-sm font-black text-emerald-400 mb-2 uppercase tracking-widest italic">Scale</div>
                        <h3 className="text-3xl font-black mb-6 text-white text-glow-emerald">Enterprise</h3>
                        <div className="mb-8 text-white">
                            <span className="text-5xl font-black">$49</span>
                            <span className="text-emerald-400/60 font-bold ml-2">/ month</span>
                        </div>
                        <p className="text-white/60 text-sm mb-10 font-bold text-glow-white">Complete power for growing organizations of any size.</p>
                        <ul className="space-y-4 mb-10 text-sm font-bold text-white/80 text-glow-white">
                            {['Unlimited Employees', 'Advanced Analytics Engine', 'Custom Approval Chains', '24/7 Priority Support', 'API Access'].map((f, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="text-emerald-400" size={18} /> {f}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => navigate('/register')} className="w-full py-4 bg-white hover:bg-emerald-50 text-emerald-900 font-black rounded-2xl transition-all shadow-xl">Get Full Access</button>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 px-6 md:px-14 text-center bg-slate-900 relative overflow-hidden reveal opacity-0 transition-all duration-1000 translate-y-10">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_rgba(16,185,129,0.1)_1px,_transparent_1px)] bg-[length:40px_40px]"></div>
                <div className="relative z-10">
                    <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-white mb-8">Elevate your team's <br /><span className="text-emerald-500">entire experience.</span></h2>
                    <p className="text-white/60 text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium italic">Join the modern workforce management revolution today.</p>
                    <div className="flex flex-wrap justify-center gap-6">
                        <button onClick={() => navigate('/register')} className="px-12 py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-[1.5rem] shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all text-lg">
                            Deploy Now Free
                        </button>
                        <button className="px-12 py-5 bg-white/5 hover:bg-white/10 text-white font-black border border-white/20 rounded-[1.5rem] transition-all text-lg backdrop-blur-md">
                            Contact Engineering
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 group hover:translate-y-[-8px] hover:shadow-2xl hover:border-emerald-200 transition-all duration-500 relative overflow-hidden">
        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:rotate-6 transition-transform">{icon}</div>
        <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-600 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
    </div>
);

export default Home;
