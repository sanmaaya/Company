import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) e.target.classList.add('visible');
            });
        }, { threshold: 0.08 });

        document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

        return () => obs.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="landing-page-container">
            {/* NAV */}
            <nav>
                <div className="brand"><div className="brand-dot"></div> LeaveSync</div>
                <ul className="nav-links">
                    <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
                    <li><a href="#dashboard" onClick={(e) => { e.preventDefault(); scrollToSection('dashboard'); }}>Dashboard</a></li>
                    <li><a href="#how" onClick={(e) => { e.preventDefault(); scrollToSection('how'); }}>How it works</a></li>
                    <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
                </ul>
                <div className="nav-cta">
                    <button className="btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="btn-primary" onClick={() => navigate('/register')}>Get Started Free</button>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero">
                <div className="hero-blob1"></div>
                <div className="hero-blob2"></div>
                <div className="hero-dots"></div>
                <div className="hero-inner">
                    <div className="hero-left">
                        <div className="hero-badge"><span className="badge-dot"></span> Trusted by 5,000+ companies worldwide</div>
                        <h1>Leave Management<br />Made <span className="highlight">Effortless</span></h1>
                        <p>Streamline leave requests, approvals, and tracking for your entire team — in one clean, modern platform built for today's HR.</p>
                        <div className="hero-actions">
                            <button className="btn-primary btn-lg" onClick={() => scrollToSection('dashboard')}>Explore Dashboard →</button>
                            <button className="btn-ghost btn-lg" onClick={() => navigate('/login')}>Sign In</button>
                        </div>
                        <div className="hero-trust">
                            <div className="trust-avatars">
                                <div style={{ background: 'linear-gradient(135deg,#16a34a,#22c55e)' }}>P</div>
                                <div style={{ background: 'linear-gradient(135deg,#15803d,#4ade80)' }}>R</div>
                                <div style={{ background: 'linear-gradient(135deg,#166534,#86efac)' }}>A</div>
                                <div style={{ background: 'linear-gradient(135deg,#14532d,#bbf7d0)', color: '#16a34a' }}>+</div>
                            </div>
                            <div className="trust-text"><strong>4,800+ HR teams</strong> already love LeaveSync</div>
                        </div>
                    </div>
                    <div className="hero-right">
                        <div className="float-card float-card-1">
                            <div className="float-title">Pending Today</div>
                            <div className="float-val">3 <span style={{ fontSize: '0.82rem', fontFamily: "'DM Sans',sans-serif", fontWeight: 400, color: 'var(--muted)' }}>requests</span></div>
                            <div className="float-sub">⚡ 2 need your approval</div>
                        </div>
                        <div className="hero-card">
                            <div className="hero-card-header">
                                <h3>Employee Dashboard</h3>
                                <button className="apply-btn">+ Apply Leave</button>
                            </div>
                            <div className="mini-stats">
                                <div className="mini-stat"><div className="mini-stat-n">2</div><div className="mini-stat-l">Pending</div></div>
                                <div className="mini-stat"><div className="mini-stat-n">5</div><div className="mini-stat-l">Approved</div></div>
                                <div className="mini-stat"><div className="mini-stat-n">12</div><div className="mini-stat-l">Days Left</div></div>
                            </div>
                            <table className="mini-table">
                                <thead><tr><th>Type</th><th>Date</th><th>Status</th></tr></thead>
                                <tbody>
                                    <tr><td>Sick Leave</td><td>Jun 23</td><td><span className="badge-sm pending">Pending</span></td></tr>
                                    <tr><td>Casual Leave</td><td>Jun 18</td><td><span className="badge-sm approved">Approved</span></td></tr>
                                    <tr><td>Earned Leave</td><td>Jun 10</td><td><span className="badge-sm approved">Approved</span></td></tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="float-card float-card-2">
                            <div className="float-title">Approval Rate</div>
                            <div className="float-val">94%</div>
                            <div className="float-sub">✅ Above company average</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES */}
            <div className="features-bg" id="features">
                <div className="section reveal">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
                        <div>
                            <div className="section-label">Features</div>
                            <h2 className="section-title">Built for modern HR teams</h2>
                        </div>
                        <p className="section-sub" style={{ paddingBottom: '4px' }}>Everything from application to approval — automated, tracked, and beautifully presented.</p>
                    </div>
                    <div className="features-grid">
                        <div className="feature-card"><div className="feature-icon">📋</div><h3>Quick Leave Application</h3><p>Apply for any leave type in under 30 seconds. Date picker, leave type selector, and reason field — simple as that.</p></div>
                        <div className="feature-card"><div className="feature-icon">⚡</div><h3>Instant Approvals</h3><p>Managers get real-time notifications and can approve or reject with one click — from desktop or mobile.</p></div>
                        <div className="feature-card"><div className="feature-icon">📊</div><h3>Live Balance Tracking</h3><p>Sick, casual, earned — all leave balances update in real time. No spreadsheets, no manual counting ever again.</p></div>
                        <div className="feature-card"><div className="feature-icon">📅</div><h3>Team Calendar</h3><p>See your whole team's availability at a glance. Plan projects and meetings without surprise absences.</p></div>
                        <div className="feature-card"><div className="feature-icon">🔐</div><h3>Role-Based Access</h3><p>Employee, Manager, and Admin dashboards. Everyone sees exactly what they need — nothing more, nothing less.</p></div>
                        <div className="feature-card"><div className="feature-icon">📈</div><h3>Reports & Analytics</h3><p>Generate leave reports by team, employee, or date. Export as PDF or CSV for payroll and compliance needs.</p></div>
                    </div>
                </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="preview-bg" id="dashboard">
                <div className="preview-section">
                    <div className="inner">
                        <div style={{ textAlign: 'center' }} className="reveal">
                            <div className="section-label">Live Preview</div>
                            <h2 className="section-title">See the dashboard in action</h2>
                            <p style={{ color: 'var(--muted)', margin: '12px auto 0', maxWidth: '400px', lineHeight: 1.7 }}>Clean, intuitive, and fast. Your team will actually enjoy using it.</p>
                        </div>
                        <div className="preview-wrapper reveal">
                            <div className="preview-browser-bar">
                                <div className="dot red"></div><div className="dot yellow"></div><div className="dot green"></div>
                                <div className="url-bar">app.leavesync.io/dashboard</div>
                            </div>
                            <div className="dashboard-ui">
                                <div className="sidebar">
                                    <div className="sidebar-logo">🌿 LeaveSync</div>
                                    <div className="sidebar-nav">
                                        <div className="sidebar-item active">📊 Dashboard</div>
                                        <div className="sidebar-item">📝 Apply Leave</div>
                                        <div className="sidebar-item">📋 My Requests</div>
                                        <div className="sidebar-item">✅ Approvals</div>
                                        <div className="sidebar-item">👥 Team</div>
                                        <div className="sidebar-item">📈 Reports</div>
                                        <div className="sidebar-item">⚙️ Settings</div>
                                    </div>
                                </div>
                                <div className="dash-main">
                                    <div className="dash-header">
                                        <div><h2>Good morning, Priya 👋</h2><div style={{ fontSize: '0.76rem', color: 'var(--muted)', marginTop: '2px' }}>Monday, February 23, 2026</div></div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>HR Manager</div><div className="avatar">PK</div></div>
                                    </div>
                                    <div className="stats-row">
                                        <div className="stat-card s1"><div className="stat-card-label">Approved</div><div className="stat-card-num green">5</div><div className="stat-card-sub">This month</div></div>
                                        <div className="stat-card s2"><div className="stat-card-label">Days Left</div><div className="stat-card-num green">12</div><div className="stat-card-sub">Of 24 annual</div></div>
                                        <div className="stat-card"><div className="stat-card-label">Pending</div><div className="stat-card-num">2</div><div className="stat-card-sub">Awaiting approval</div></div>
                                        <div className="stat-card"><div className="stat-card-label">Team OOO</div><div className="stat-card-num">3</div><div className="stat-card-sub">Members today</div></div>
                                    </div>
                                    <div className="table-section">
                                        <div className="table-head"><h3>Recent Leave Requests</h3><button className="apply-btn">+ Apply Leave</button></div>
                                        <table>
                                            <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Reason</th><th>Status</th></tr></thead>
                                            <tbody>
                                                <tr><td>Priya Sharma</td><td>Sick Leave</td><td>Jun 23, 2024</td><td>Jun 24, 2024</td><td>Fever</td><td><span className="badge pending">Pending</span></td></tr>
                                                <tr><td>Rahul Mehta</td><td>Casual Leave</td><td>Jun 22, 2024</td><td>Jun 22, 2024</td><td>Personal</td><td><span className="badge approved">Approved</span></td></tr>
                                                <tr><td>Anita Roy</td><td>Earned Leave</td><td>Jun 20, 2024</td><td>Jun 22, 2024</td><td>Vacation</td><td><span className="badge approved">Approved</span></td></tr>
                                                <tr><td>Dev Patel</td><td>Casual Leave</td><td>Jun 19, 2024</td><td>Jun 19, 2024</td><td>Holiday</td><td><span className="badge rejected">Rejected</span></td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div className="how-bg" id="how">
                <div className="section reveal">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">Process</div>
                        <h2 className="section-title">How LeaveSync works</h2>
                        <p style={{ color: 'var(--muted)', margin: '12px auto 0', maxWidth: '380px', lineHeight: 1.7 }}>Zero paperwork. Zero confusion. A smooth four-step flow every time.</p>
                    </div>
                    <div className="steps-grid">
                        <div className="steps-line"></div>
                        <div className="step"><div className="step-num active">01</div><h4>Employee Applies</h4><p>Pick leave type, select dates, add a reason. Done in under a minute.</p></div>
                        <div className="step"><div className="step-num active">02</div><h4>Manager Notified</h4><p>Instant email + in-app notification with full context and quick actions.</p></div>
                        <div className="step"><div className="step-num">03</div><h4>Approve or Reject</h4><p>One-click decision with optional reason. Employee notified immediately.</p></div>
                        <div className="step"><div className="step-num">04</div><h4>Auto-Updated</h4><p>Balances, calendars, and reports update automatically. No manual work.</p></div>
                    </div>
                </div>
            </div>

            {/* TESTIMONIALS */}
            <div className="testi-bg">
                <div className="section reveal">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">Testimonials</div>
                        <h2 className="section-title">Teams who trust LeaveSync</h2>
                    </div>
                    <div className="testi-grid">
                        <div className="testi-card">
                            <div className="testi-stars">★★★★★</div>
                            <div className="testi-text">"We moved from email chains and spreadsheets to a fully automated system in one day. Our HR team got hours back every week."</div>
                            <div className="testi-author"><div className="testi-avatar" style={{ background: 'linear-gradient(135deg,#16a34a,#4ade80)' }}>SK</div><div><div className="testi-name">Sunita Kapoor</div><div className="testi-role">HR Director, TechCorp India</div></div></div>
                        </div>
                        <div className="testi-card">
                            <div className="testi-stars">★★★★★</div>
                            <div className="testi-text">"The manager approval flow is brilliant. I approve from my phone in seconds. The team calendar alone is worth it."</div>
                            <div className="testi-author"><div className="testi-avatar" style={{ background: 'linear-gradient(135deg,#15803d,#86efac)' }}>AM</div><div><div className="testi-name">Arjun Malhotra</div><div className="testi-role">Engineering Manager, Zomato</div></div></div>
                        </div>
                        <div className="testi-card">
                            <div className="testi-stars">★★★★★</div>
                            <div className="testi-text">"Finally a leave system that doesn't feel outdated. Clean, fast, and our employees actually enjoy using it."</div>
                            <div className="testi-author"><div className="testi-avatar" style={{ background: 'linear-gradient(135deg,#166534,#bbf7d0)', color: '#16a34a' }}>NJ</div><div><div className="testi-name">Neha Joshi</div><div className="testi-role">COO, Startup Hub Bangalore</div></div></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <div className="pricing-bg" id="pricing">
                <div className="section reveal">
                    <div style={{ textAlign: 'center' }}>
                        <div className="section-label">Pricing</div>
                        <h2 className="section-title">Simple, honest pricing</h2>
                        <p style={{ color: 'var(--muted)', margin: '12px auto 0', maxWidth: '360px', lineHeight: 1.7 }}>Start free. Upgrade when you're ready. No hidden fees, ever.</p>
                    </div>
                    <div className="pricing-grid">
                        <div className="pricing-card">
                            <div className="plan-name">Starter</div>
                            <div className="plan-price">Free <span>forever</span></div>
                            <div className="plan-desc">Perfect for small teams getting started.</div>
                            <ul className="plan-features">
                                <li><span className="check">✓</span> Up to 10 employees</li>
                                <li><span className="check">✓</span> Basic leave types</li>
                                <li><span class="check">✓</span> Email notifications</li>
                                <li><span class="x-mark">—</span> <span style={{ color: 'var(--muted2)' }}>Analytics & reports</span></li>
                                <li><span class="x-mark">—</span> <span style={{ color: 'var(--muted2)' }}>Custom leave policies</span></li>
                            </ul>
                            <button className="plan-btn btn-ghost" onClick={() => navigate('/register')}>Get Started Free</button>
                        </div>
                        <div className="pricing-card popular">
                            <div className="popular-tag">Most Popular</div>
                            <div className="plan-name">Professional</div>
                            <div className="plan-price">₹499 <span>/ month</span></div>
                            <div className="plan-desc">For growing teams that need full control.</div>
                            <ul className="plan-features">
                                <li><span className="check">✓</span> Up to 100 employees</li>
                                <li><span className="check">✓</span> All leave types</li>
                                <li><span class="check">✓</span> Advanced analytics</li>
                                <li><span class="check">✓</span> Custom leave policies</li>
                                <li><span class="check">✓</span> Priority support</li>
                            </ul>
                            <button className="plan-btn btn-primary" onClick={() => navigate('/register')}>Start Free Trial</button>
                        </div>
                        <div className="pricing-card">
                            <div className="plan-name">Enterprise</div>
                            <div className="plan-price">Custom</div>
                            <div className="plan-desc">For large orgs with complex HR requirements.</div>
                            <ul className="plan-features">
                                <li><span className="check">✓</span> Unlimited employees</li>
                                <li><span className="check">✓</span> HRMS integrations</li>
                                <li><span class="check">✓</span> SSO & audit logs</li>
                                <li><span class="check">✓</span> Dedicated success manager</li>
                                <li><span class="check">✓</span> Custom SLA & contracts</li>
                            </ul>
                            <button className="plan-btn btn-ghost">Contact Sales</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="cta-section reveal">
                <h2>Ready to simplify your<br />team's time off?</h2>
                <p>Join thousands of companies managing leaves the modern way. Get started in minutes — completely free.</p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button className="btn-white" onClick={() => navigate('/register')}>Start for Free — No Credit Card</button>
                    <button className="btn-outline-white">Schedule a Demo</button>
                </div>
            </div>

            {/* FOOTER */}
            <footer>
                <div className="footer-brand">🌿 LeaveSync</div>
                <p>© 2024 LeaveSync. Built for modern HR teams.</p>
                <div className="footer-links">
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Support</a>
                    <a href="#">Blog</a>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
