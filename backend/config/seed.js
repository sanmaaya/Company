const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const User = require('../models/User');
const Leave = require('../models/Leave');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Group = require('../models/Group');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leavesync');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Leave.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Group.deleteMany({});

    const pass = 'password123';

    // ── ADMINS ──────────────────────────────────────────
    const meera = await User.create({
      name: 'Meera Iyer',
      email: 'meera@leavesync.com',
      password: pass,
      phoneNumber: '9999999999',
      role: 'admin',
      title: 'HR Director',
      department: 'Management',
      profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    });

    const rahul = await User.create({
      name: 'Rahul Khanna',
      email: 'rahul@leavesync.com',
      password: pass,
      phoneNumber: '8888888888',
      role: 'admin',
      title: 'Chief Technology Officer',
      department: 'Management',
      profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
    });

    // ── MANAGERS ────────────────────────────────────────
    const riya = await User.create({
      name: 'Riya Verma',
      email: 'manager@leavesync.com',
      password: pass,
      phoneNumber: '7777777777',
      role: 'manager',
      title: 'Engineering Manager',
      department: 'Engineering',
      profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
    });

    const suresh = await User.create({
      name: 'Suresh Raina',
      email: 'suresh@leavesync.com',
      password: pass,
      phoneNumber: '6666666666',
      role: 'manager',
      title: 'Marketing Head',
      department: 'Marketing',
      profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    });

    // ── EMPLOYEES ───────────────────────────────────────
    const employeeData = [
      { name: 'Amit Patel', email: 'employee@leavesync.com', phoneNumber: '5555555555', title: 'Senior Frontend Engineer', department: 'Engineering', managerId: riya._id, profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
      { name: 'Priya Sharma', email: 'priya@leavesync.com', phoneNumber: '4444444444', title: 'Backend Developer', department: 'Engineering', managerId: riya._id, profilePic: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200' },
      { name: 'Vikram Singh', email: 'vikram@leavesync.com', phoneNumber: '3333333333', title: 'Digital Marketer', department: 'Marketing', managerId: suresh._id, profilePic: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=200' },
      { name: 'Anjali Gupta', email: 'anjali@leavesync.com', phoneNumber: '2222222222', title: 'UX Researcher', department: 'Engineering', managerId: riya._id, profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
      { name: 'Zane Malik', email: 'zane@leavesync.com', phoneNumber: '1111111111', title: 'Growth Specialist', department: 'Marketing', managerId: suresh._id, profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' },
      { name: 'Sara Khan', email: 'sara@leavesync.com', phoneNumber: '1212121212', title: 'Customer Success', department: 'Support', managerId: meera._id, profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
      { name: 'Rohan Mehra', email: 'rohan@leavesync.com', phoneNumber: '1313131313', title: 'Fullstack Developer', department: 'Engineering', managerId: riya._id, profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
      { name: 'Ishita Roy', email: 'ishita@leavesync.com', phoneNumber: '1414141414', title: 'Product Designer', department: 'Design', managerId: meera._id, profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
      { name: 'Kabir Das', email: 'kabir@leavesync.com', phoneNumber: '1515151515', title: 'DevOps Engineer', department: 'Engineering', managerId: riya._id, profilePic: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200' }
    ];

    const employees = [];
    for (const data of employeeData) {
      const emp = await User.create({ ...data, password: pass, role: 'employee' });
      employees.push(emp);
    }

    // ── PROJECTS ────────────────────────────────────────
    const p1 = await Project.create({
      name: 'Q3 Mobile Revamp',
      description: 'Major redesign of the mobile application for better UX.',
      client: 'Skyscanner',
      deadline: new Date('2024-09-30'),
      status: 'active',
      members: [employees[0]._id, employees[1]._id, employees[3]._id, riya._id, meera._id],
      createdBy: meera._id
    });

    const p2 = await Project.create({
      name: 'Cloud Infrastructure Upgrade',
      description: 'Migrating legacy servers to modern cloud architecture.',
      client: 'TechFlow Systems',
      deadline: new Date('2024-05-15'),
      status: 'completed',
      members: [employees[8]._id, rahul._id, meera._id],
      createdBy: rahul._id
    });

    const p3 = await Project.create({
      name: 'AI-Powered HR Bot',
      description: 'Future project to automate leave inquiries and HR FAQs.',
      client: 'Internal',
      deadline: new Date('2025-01-20'),
      status: 'upcoming',
      members: [employees[0]._id, employees[7]._id, meera._id],
      createdBy: meera._id
    });

    // ── TASKS ───────────────────────────────────────────
    await Task.create([
      // Project 1 (Active)
      { project: p1._id, title: 'Design Login Flow', description: 'Design UI in Figma', assignedTo: employees[0]._id, deadline: new Date('2024-06-30'), priority: 'high', status: 'in-progress' },
      { project: p1._id, title: 'Implement Auth API', description: 'Build JWT integration', assignedTo: employees[1]._id, deadline: new Date('2024-07-05'), priority: 'high', status: 'todo' },
      { project: p1._id, title: 'User Discovery Interviews', description: 'Talk to 5 potential users', assignedTo: employees[3]._id, deadline: new Date('2024-06-25'), priority: 'medium', status: 'completed' },
      { project: p1._id, title: 'Compliance Review', description: 'Check GDPR standards', assignedTo: meera._id, deadline: new Date('2024-07-10'), priority: 'medium', status: 'todo' },
      { project: p1._id, title: 'Setup CI/CD Pipeline', description: 'Deploy action via GitHub', assignedTo: employees[8]._id, deadline: new Date('2024-06-28'), priority: 'medium', status: 'todo' },
      { project: p1._id, title: 'Managerial Performance Review', description: 'Review Q2 stats', assignedTo: riya._id, deadline: new Date('2026-03-05'), priority: 'high', status: 'in-progress' },
      { project: p1._id, title: 'Budget Allocation Sync', description: 'Sync with HR', assignedTo: riya._id, deadline: new Date('2026-03-10'), priority: 'medium', status: 'todo' },

      // Project 2 (Completed)
      { project: p2._id, title: 'Audit Existing Servers', description: 'Map all hardware assets', assignedTo: employees[8]._id, deadline: new Date('2024-04-01'), priority: 'high', status: 'completed' },
      { project: p2._id, title: 'Data Migration Strategy', description: 'Plan the move', assignedTo: rahul._id, deadline: new Date('2024-04-10'), priority: 'high', status: 'completed' },
      { project: p2._id, title: 'Final Handover', description: 'Review with client', assignedTo: meera._id, deadline: new Date('2024-05-10'), priority: 'low', status: 'completed' },
      { project: p2._id, title: 'Retrospective Session', description: 'Internal team sync', assignedTo: riya._id, deadline: new Date('2024-05-20'), priority: 'low', status: 'completed' },

      // Project 3 (Upcoming/Future)
      { project: p3._id, title: 'Define NLP Requirements', description: 'What should the bot understand?', assignedTo: employees[7]._id, deadline: new Date('2024-11-01'), priority: 'medium', status: 'todo' },
      { project: p3._id, title: 'Frontend Prototyping', description: 'Chat window design', assignedTo: employees[0]._id, deadline: new Date('2024-11-15'), priority: 'medium', status: 'todo' },
      { project: p3._id, title: 'Budget Approval', description: 'Get the sign-off', assignedTo: meera._id, deadline: new Date('2024-10-01'), priority: 'high', status: 'todo' }
    ]);

    // ── LEAVES ──────────────────────────────────────────
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    await Leave.create([
      {
        employee: employees[0]._id,
        leaveType: 'sick',
        startDate: today,
        endDate: tomorrow,
        totalDays: 2,
        reason: 'Severe flu',
        status: 'approved',
        reviewedBy: riya._id,
        reviewedAt: today
      },
      {
        employee: employees[2]._id,
        leaveType: 'casual',
        startDate: new Date(today.getTime() + 86400000 * 3),
        endDate: new Date(today.getTime() + 86400000 * 5),
        totalDays: 3,
        reason: 'Family event',
        status: 'approved',
        reviewedBy: suresh._id,
        reviewedAt: today
      },
      {
        employee: employees[4]._id,
        leaveType: 'earned',
        startDate: today,
        endDate: today,
        totalDays: 1,
        reason: 'Mental health day',
        status: 'pending'
      },
      {
        employee: employees[6]._id,
        leaveType: 'sick',
        startDate: new Date(today.getTime() - 86400000 * 2),
        endDate: new Date(today.getTime() - 86400000 * 1),
        totalDays: 2,
        reason: 'Dental surgery',
        status: 'approved',
        reviewedBy: riya._id,
        reviewedAt: new Date(today.getTime() - 86400000 * 5)
      },
      {
        employee: employees[7]._id,
        leaveType: 'casual',
        startDate: new Date(today.getTime() + 86400000 * 10),
        endDate: new Date(today.getTime() + 86400000 * 12),
        totalDays: 3,
        reason: 'Mini vacation',
        status: 'pending'
      },
      {
        employee: employees[1]._id,
        leaveType: 'sick',
        startDate: new Date(today.getTime() + 86400000 * 15),
        endDate: new Date(today.getTime() + 86400000 * 16),
        totalDays: 2,
        reason: 'Doctor Appointment',
        status: 'approved',
        reviewedBy: riya._id,
        reviewedAt: today
      }
    ]);

    // ── GROUPS ──────────────────────────────────────────
    await Group.create([
      {
        name: 'The Engineering Hub 🛠️',
        description: 'Primary group for all engineering discussions, code reviews, and tech syncs.',
        members: [riya._id, rahul._id, ...employees.filter(e => e.department === 'Engineering').map(e => e._id)],
        createdBy: rahul._id,
        isPrivate: false
      },
      {
        name: 'Product & Design 🎨',
        description: 'Brainstorming session for the upcoming Q4 features.',
        members: [meera._id, employees[0]._id, employees[7]._id], // Amit (frontend) and Ishita (designer)
        createdBy: meera._id,
        isPrivate: false
      },
      {
        name: 'The Cool Support Crew 🎧',
        description: 'Direct support for customers and feedback loop.',
        members: [meera._id, employees[5]._id],
        createdBy: meera._id,
        isPrivate: true
      }
    ]);

    console.log('✅ DATABASE SEEDED SUCCESSFULLY');
    console.log(`🌍 ${User.length === 0 ? 'Wait' : 'Employees, Projects, and Groups are live!'}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
