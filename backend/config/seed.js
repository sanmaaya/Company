const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Leave = require('../models/Leave');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/leavesync');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Leave.deleteMany({});

    const hashedPass = await bcrypt.hash('password123', 12);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@leavesync.com',
      password: hashedPass,
      role: 'admin',
      department: 'HR'
    });

    const manager = await User.create({
      name: 'Riya Verma',
      email: 'manager@leavesync.com',
      password: hashedPass,
      role: 'manager',
      department: 'Engineering'
    });

    const emp1 = await User.create({
      name: 'Amit Patel',
      email: 'employee@leavesync.com',
      password: hashedPass,
      role: 'employee',
      department: 'Engineering',
      managerId: manager._id
    });

    const emp2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@leavesync.com',
      password: hashedPass,
      role: 'employee',
      department: 'Engineering',
      managerId: manager._id
    });

    // Sample leaves
    await Leave.create([
      {
        employee: emp1._id,
        leaveType: 'sick',
        startDate: new Date('2024-06-10'),
        endDate: new Date('2024-06-11'),
        totalDays: 2,
        reason: 'Fever and cold',
        status: 'approved',
        reviewedBy: manager._id,
        reviewedAt: new Date()
      },
      {
        employee: emp1._id,
        leaveType: 'casual',
        startDate: new Date('2024-07-05'),
        endDate: new Date('2024-07-05'),
        totalDays: 1,
        reason: 'Personal work',
        status: 'pending'
      },
      {
        employee: emp2._id,
        leaveType: 'earned',
        startDate: new Date('2024-06-20'),
        endDate: new Date('2024-06-22'),
        totalDays: 3,
        reason: 'Family vacation',
        status: 'approved',
        reviewedBy: manager._id,
        reviewedAt: new Date()
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Demo Credentials:');
    console.log('Admin:    admin@leavesync.com    / password123');
    console.log('Manager:  manager@leavesync.com  / password123');
    console.log('Employee: employee@leavesync.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedDB();
