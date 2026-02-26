import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Monitor, Zap, Shield, BarChart3, Clock, CheckCircle2, ChevronRight, PlayCircle, Star, Users, ArrowRight } from 'lucide-react';

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
        <div className="bg-white font-sans text-slate-900 scroll-smooth selection:bg-blue-100 selection:text-blue-900 light relative overflow-hidden">
            {/* Page-wide background effects - Multi-color mesh gradient style */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-100/40 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/30 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] left-[5%] w-[45%] h-[45%] bg-sky-50/50 rounded-full blur-[110px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-200/20 rounded-full blur-[140px]"></div>
                <div className="absolute top-[35%] right-[20%] w-[30%] h-[30%] bg-indigo-50/40 rounded-full blur-[90px] animate-pulse delay-700"></div>
            </div>



            {/* NAV */}
            <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-14 h-[72px] bg-white/80 backdrop-blur-xl border-b border-blue-50/50 shadow-sm transition-all duration-300">
                <div className="text-[1.3rem] font-black tracking-tighter text-slate-900 flex items-center gap-2 cursor-pointer transition-colors" onClick={() => window.scrollTo(0, 0)}>
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white text-lg shadow-lg shadow-blue-500/30">🏙️</div>
                    <span className="dark:text-slate-900">WORK Balance</span>
                </div>
                <ul className="hidden lg:flex gap-8 list-none">
                    {navLinks.map(link => (
                        <li key={link.name}>
                            <a href={link.href} className="text-slate-500 hover:text-blue-600 font-bold text-sm tracking-tight transition-all relative group">
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="flex gap-4 items-center">
                    <Link to="/login" className="px-5 py-2.5 text-slate-600 dark:text-slate-600 hover:text-blue-600 transition-colors font-bold text-sm transition-all">Sign In</Link>
                    <Link to="/register" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* HERO */}
            <section className="min-h-screen pt-40 pb-20 px-6 relative overflow-hidden bg-white">
                {/* Decorative Elements */}
                <div className="absolute w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[120px] top-[-200px] right-[-200px]"></div>
                <div className="absolute w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] bottom-[-100px] left-[-150px]"></div>

                <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center mb-20 relative"
                    >
                        {/* Floating elements for visual depth */}
                        <motion.div
                            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-10 -left-20 hidden lg:block"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                <Zap className="text-blue-400 w-6 h-6" />
                            </div>
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-40 -right-20 hidden lg:block"
                        >
                            <div className="w-16 h-16 rounded-3xl bg-blue-600/5 border border-blue-200/20 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="text-blue-500 w-8 h-8" />
                            </div>
                        </motion.div>

                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[0.75rem] font-bold text-blue-700 mb-8 uppercase tracking-wider">
                            <Star className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                            Trusted by 10,000+ Enterprises
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight mb-8 !text-slate-900 dark:!text-slate-900">
                            Leave Management<br />
                            <span className="text-blue-600">Perfectly Balanced.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                            Step into the future of HR. Automate leave cycles, track availability in real-time, and empower your workforce with WORK Balance's modern platform.
                        </p>
                        <div className="flex flex-wrap gap-5 justify-center">
                            <button onClick={() => navigate('/register')} className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl shadow-2xl shadow-blue-600/30 transition-all flex items-center gap-2 group">
                                Get Started Free
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button onClick={() => navigate('/login')} className="px-10 py-5 bg-white border border-slate-200 hover:border-blue-600 hover:bg-blue-50 text-slate-800 dark:text-slate-800 font-black text-lg rounded-2xl shadow-sm transition-all flex items-center gap-2">
                                <PlayCircle className="text-blue-600" />
                                Live Preview
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 40 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative w-full max-w-4xl mx-auto z-20"
                    >
                        {/* Glow effect behind dashboard */}
                        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-[3rem] -z-10 animate-pulse"></div>

                        {/* Interactive UI Card Mockup */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.08)] border border-blue-50 relative z-10 overflow-hidden transform transition-all duration-700 hover:scale-[1.01]">
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 dark:text-slate-900">Team Status</h3>
                                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest mt-0.5">Live Tracking</p>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    { lab: 'PENDING', val: '04', col: 'bg-blue-50 text-blue-700' },
                                    { lab: 'APPROVED', val: '18', col: 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' },
                                    { lab: 'DAYS LEFT', val: '12', col: 'bg-slate-50 text-slate-700' }
                                ].map(st => (
                                    <div key={st.lab} className={`${st.col} rounded-2xl p-4 text-center transition-all cursor-default`}>
                                        <div className="text-2xl font-black">{st.val}</div>
                                        <div className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-80">{st.lab}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                {[
                                    { user: 'Sarah Chen', type: 'Annual Trip', img: 21, date: 'Aug 12 - 20', status: 'Approved', sCol: 'bg-blue-100 text-blue-700' },
                                    { user: 'Alex Rivera', type: 'Wedding', img: 22, date: 'Sep 05 - 06', status: 'Pending', sCol: 'bg-amber-100 text-amber-700' }
                                ].map((row, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-100 transition-colors shadow-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${row.img}`} className="w-full h-full object-cover" alt="avatar" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-800 dark:text-slate-800">{row.user}</p>
                                                <p className="text-[10px] text-slate-400 dark:text-slate-400 font-bold">{row.type} • {row.date}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${row.sCol}`}>{row.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative mesh gradient at the bottom of hero */}
                <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-slate-50 to-transparent"></div>
            </section>


            {/* FEATURES SECTION */}
            <section id="features" className="py-32 px-6 md:px-14 bg-white relative">
                <div className="max-w-7xl mx-auto reveal opacity-0 transition-all duration-1000 translate-y-10">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="inline-block text-[10px] font-black tracking-widest uppercase text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full mb-4">Core System</motion.div>
                        <h2 className="text-2xl md:text-4xl font-black !text-slate-900 dark:!text-slate-900 mb-4">Enterprise Grade Features</h2>
                        <p className="text-slate-500 dark:text-slate-500 text-base max-w-xl mx-auto font-medium leading-relaxed">Everything you need to replace your legacy spreadsheets and automate your leave request lifecycle.</p>
                    </div>


                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1 }
                            }
                        }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <FeatureCard
                            icon={<Zap className="text-blue-600" size={24} />}
                            title="Instant Approvals"
                            desc="Real-time notifications and one-click decisions from any device. Simplified for modern managers."
                        />
                        <FeatureCard
                            icon={<Shield className="text-blue-600" size={24} />}
                            title="Enterprise Security"
                            desc="Role-based access control and secure data encryption. Your team data is safe and auditable."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="text-blue-600" size={24} />}
                            title="Live Analytics"
                            desc="Visualize team availability trends and department heatmaps at a glance in your command center."
                        />
                        <FeatureCard
                            icon={<Clock className="text-blue-600" size={24} />}
                            title="Time Tracking"
                            desc="Keep accurate logs of sick, casual and earned leaves. Balances update automatically in real-time."
                        />
                        <FeatureCard
                            icon={<CheckCircle2 className="text-blue-600" size={24} />}
                            title="Compliance Ready"
                            desc="Stay compliant with company policies and local laws using automated rules and tracking."
                        />
                        <FeatureCard
                            icon={<Users className="text-blue-600" size={24} />}
                            title="Global Directory"
                            desc="All your employees in one unified cloud directory. Sync organizational levels effortlessly."
                        />
                    </motion.div>

                </div>
            </section>

            {/* DASHBOARD PREVIEW */}
            <section id="dashboard" className="py-32 px-6 md:px-14 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center mb-20 reveal opacity-0">
                    <h2 className="text-2xl md:text-4xl font-black !text-slate-900 dark:!text-slate-900 mb-4">Command Your Workspace</h2>
                    <p className="text-slate-500 dark:text-slate-500 text-base max-w-xl mx-auto font-medium">A unified interface that gives HR admins and managers total visibility.</p>
                </div>

                <div className="max-w-5xl mx-auto reveal opacity-0 translate-y-10 transition-all duration-1000">
                    <div className="relative bg-white rounded-[2rem] p-4 shadow-2xl border border-slate-200">
                        <div className="bg-slate-100 h-8 rounded-t-2xl flex items-center px-6 gap-2 mb-2">
                            <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full"></div>
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
                            alt="Dashboard"
                            className="w-full h-auto rounded-b-xl border border-slate-100"
                        />
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section id="how" className="py-32 px-6 md:px-14 bg-white">
                <div className="max-w-7xl mx-auto reveal opacity-0">
                    <div className="text-center mb-24">
                        <h2 className="text-2xl md:text-4xl font-black !text-slate-900 dark:!text-slate-900 mb-4">How it Works</h2>
                        <p className="text-slate-500 dark:text-slate-500 text-base max-w-xl mx-auto font-medium">Three simple steps to transition your team to modern HRMS.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {[
                            { num: '01', title: 'Onboard Team', desc: 'Sync your organizational directory via CSV or secure API hooks in minutes.' },
                            { num: '02', title: 'Customize Rules', desc: 'Define leave quotas and approval chains using our simple policy builder.' },
                            { num: '03', title: 'Empower Users', desc: 'Invite employees to their new mobile-friendly self-service leave dashboard.' }
                        ].map((s, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black mb-6 shadow-lg shadow-blue-500/20">0{i + 1}</div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-slate-900 mb-3">{s.title}</h3>
                                <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed font-medium">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section id="pricing" className="py-32 px-6 md:px-14 bg-blue-50/20">
                <div className="max-w-7xl mx-auto reveal opacity-0">
                    <div className="text-center mb-20">
                        <h2 className="text-2xl md:text-4xl font-black !text-slate-900 dark:!text-slate-900 mb-4">Start Growing Today</h2>
                        <p className="text-slate-500 dark:text-slate-500 text-base font-medium">Simple plans for teams of all sizes.</p>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-white/70 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.04)] flex flex-col relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16"></div>
                            <h3 className="text-2xl font-black mb-1 !text-slate-900 dark:!text-slate-900 relative z-10">Standard</h3>
                            <p className="text-slate-400 font-bold mb-6 uppercase tracking-widest text-[10px] relative z-10">Small teams</p>
                            <div className="mb-10 relative z-10">
                                <span className="text-5xl font-black text-slate-900">$0</span>
                                <span className="text-slate-400 font-bold ml-2">/ month</span>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {['Up to 20 Employees', 'Core Leave Engine', 'Email Support'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-slate-600 dark:text-slate-600 font-bold text-sm">
                                        <CheckCircle2 className="text-blue-500 w-4 h-4" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => navigate('/register')} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-xl transition-all">Get Started Free</button>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02, y: -5 }}
                            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-3xl shadow-[0_30px_60px_rgba(37,99,235,0.25)] border-4 border-blue-400/30 flex flex-col text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-6 z-20">
                                <div className="bg-white/20 backdrop-blur-md text-white text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Growth</div>
                            </div>
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                            <h3 className="text-2xl font-black mb-1 text-white dark:text-white relative z-10">Enterprise</h3>
                            <p className="text-blue-100 font-bold mb-6 uppercase tracking-widest text-[10px] relative z-10">Unlimited Power</p>
                            <div className="mb-10 text-white relative z-10">
                                <span className="text-5xl font-black">$49</span>
                                <span className="text-blue-100 font-bold ml-2">/ month</span>
                            </div>
                            <ul className="space-y-4 mb-10 flex-1 relative z-10">
                                {['Unlimited Users', 'Advanced Analytics', 'Priority 24/7 Support'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-white font-bold text-sm">
                                        <CheckCircle2 className="text-white w-4 h-4" /> {f}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => navigate('/register')} className="w-full py-4 bg-white hover:bg-blue-50 text-blue-600 font-black rounded-xl transition-all shadow-lg relative z-10">Unlock Everything</button>
                        </motion.div>
                    </div>

                </div>
            </section>

            {/* CTA */}
            <section className="py-32 px-6 md:px-14 text-center bg-slate-900 relative overflow-hidden reveal opacity-0 transition-all duration-1000 translate-y-10">
                <div className="relative z-10 max-w-3xl mx-auto font-sans">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-8">Ready to modernize?</h2>
                    <p className="text-slate-400 text-lg mb-12 font-medium">Deploy WORK Balance to your organization today and eliminate HR complexity.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => navigate('/register')} className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl transition-all text-lg">
                            Deploy Now
                        </button>
                        <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white font-black border border-white/20 rounded-2xl transition-all text-lg backdrop-blur-md">
                            Book a Demo
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 }
        }}
        className="bg-white border border-slate-100 rounded-3xl p-10 group hover:shadow-[0_20px_50px_rgba(8,107,255,0.08)] hover:border-blue-100 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 relative z-10 transition-transform group-hover:scale-110 duration-500">{icon}</div>
        <h3 className="text-xl font-black !text-slate-900 dark:!text-slate-900 mb-4 relative z-10">{title}</h3>
        <p className="text-slate-500 dark:text-slate-500 text-base leading-relaxed font-medium mb-2 relative z-10">{desc}</p>
    </motion.div>
);


export default Home;
