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
      { name: 'Priya Sharma', email: 'priya@leavesync.com', phoneNumber: '4444444444', title: 'Backend Developer', department: 'Engineering', managerId: riya._id, profilePic: 'https://images.unsplash.com/photo-1598550874175-4d0fe4a2c90b?auto=format&fit=crop&q=80&w=200' },
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
      members: [employees[0]._id, employees[1]._id, employees[3]._id, riya._id],
      createdBy: meera._id
    });

    // ── TASKS ───────────────────────────────────────────
    await Task.create([
      { project: p1._id, title: 'Design Login Flow', assignedTo: employees[0]._id, deadline: new Date('2024-06-30'), priority: 'high', status: 'in-progress' },
      { project: p1._id, title: 'Implement Auth API', assignedTo: employees[1]._id, deadline: new Date('2024-07-05'), priority: 'high', status: 'todo' }
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
