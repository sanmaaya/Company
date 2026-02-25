const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: require('path').resolve(__dirname, '../.env') });

const User = require('../models/User');
const Leave = require('../models/Leave');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leavesync');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Leave.deleteMany({});

    const pass = 'password123';

    // Admins
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@leavesync.com',
      password: pass,
      role: 'admin',
      title: 'Head of Administration',
      department: 'Management'
    });

    const meera = await User.create({
      name: 'Meera Iyer',
      email: 'meera@leavesync.com',
      password: pass,
      role: 'admin',
      title: 'HR Director',
      department: 'People & Culture'
    });

    // Managers
    const manager = await User.create({
      name: 'Riya Verma',
      email: 'manager@leavesync.com',
      password: pass,
      role: 'manager',
      title: 'Engineering Manager',
      department: 'Engineering'
    });

    const manager2 = await User.create({
      name: 'Suresh Raina',
      email: 'suresh@leavesync.com',
      password: pass,
      role: 'manager',
      title: 'Marketing Manager',
      department: 'Marketing'
    });

    // Employees
    const emp1 = await User.create({
      name: 'Amit Patel',
      email: 'employee@leavesync.com',
      password: pass,
      role: 'employee',
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      managerId: manager._id
    });

    const emp2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@leavesync.com',
      password: pass,
      role: 'employee',
      title: 'Backend Developer',
      department: 'Engineering',
      managerId: manager._id
    });

    const emp3 = await User.create({
      name: 'Vikram Singh',
      email: 'vikram@leavesync.com',
      password: pass,
      role: 'employee',
      title: 'Digital Marketer',
      department: 'Marketing',
      managerId: manager2._id
    });

    const emp4 = await User.create({
      name: 'Anjali Gupta',
      email: 'anjali@leavesync.com',
      password: pass,
      role: 'employee',
      title: 'HR Specialist',
      department: 'People & Culture',
      managerId: meera._id
    });

    // Sample leaves for testing
    await Leave.create([
      {
        employee: emp1._id,
        leaveType: 'sick',
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-11'),
        totalDays: 2,
        reason: 'Severe fever and body ache',
        status: 'approved',
        reviewedBy: manager._id,
        reviewedAt: new Date()
      },
      {
        employee: emp2._id,
        leaveType: 'casual',
        startDate: new Date('2024-07-05'),
        endDate: new Date('2024-07-05'),
        totalDays: 1,
        reason: 'Personal family emergency',
        status: 'pending'
      }
    ]);

    console.log('✅ Database seeded successfully with Titles and Meera Iyer!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin (Global): meera@leavesync.com / password123');
    console.log('Manager (Eng):  manager@leavesync.com / password123');
    console.log('Employee:       employee@leavesync.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
