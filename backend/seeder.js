const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Leave = require('./models/Leave');

// Connect to DB first to ensure we can hash passwords (if necessary) or just use the model
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/employeesync';

const avatars = {
  admin: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop',
  meera: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  priya: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
  rahul: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  dev: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  sneha: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop',
  vikram: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  anita: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
  karan: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop'
};

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@employeesync.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    profilePic: avatars.admin,
    leaveBalance: { casual: 15, sick: 12, earned: 20, unpaid: 0 },
    _ref: 'admin'
  },
  {
    name: 'Meera Iyer',
    email: 'hr@employeesync.com',
    password: 'password123',
    role: 'manager',
    department: 'Human Resources',
    profilePic: avatars.meera,
    leaveBalance: { casual: 12, sick: 10, earned: 15, unpaid: 0 },
    _ref: 'meera'
  },
  {
    name: 'Priya Sharma',
    email: 'manager@employeesync.com',
    password: 'password123',
    role: 'manager',
    department: 'Engineering',
    profilePic: avatars.priya,
    leaveBalance: { casual: 12, sick: 10, earned: 15, unpaid: 0 },
    _ref: 'priya'
  },
  {
    name: 'Rahul Mehta',
    email: 'employee@employeesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    profilePic: avatars.rahul,
    leaveBalance: { casual: 10, sick: 8, earned: 12, unpaid: 0 },
    _ref: 'rahul',
    _managerId: 'priya'
  },
  {
    name: 'Dev Patel',
    email: 'dev@employeesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    profilePic: avatars.dev,
    leaveBalance: { casual: 8, sick: 6, earned: 10, unpaid: 0 },
    _ref: 'dev',
    _managerId: 'priya'
  },
  {
    name: 'Sneha Verma',
    email: 'sneha@employeesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Design',
    profilePic: avatars.sneha,
    leaveBalance: { casual: 10, sick: 9, earned: 12, unpaid: 0 },
    _ref: 'sneha',
    _managerId: 'meera'
  },
  {
    name: 'Vikram Desai',
    email: 'vikram@employeesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Design',
    profilePic: avatars.vikram,
    leaveBalance: { casual: 9, sick: 8, earned: 11, unpaid: 0 },
    _ref: 'vikram',
    _managerId: 'meera'
  },
  {
    name: 'Anita Roy',
    email: 'anita@employeesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Human Resources',
    profilePic: avatars.anita,
    leaveBalance: { casual: 10, sick: 8, earned: 12, unpaid: 0 },
    _ref: 'anita',
    _managerId: 'meera'
  },
  {
    name: 'Karan Singh',
    email: 'karan@employeesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Sales',
    profilePic: avatars.karan,
    leaveBalance: { casual: 9, sick: 7, earned: 11, unpaid: 0 },
    _ref: 'karan',
    _managerId: 'admin'
  }
];

const seed = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('\n🔌 Connected to MongoDB...');

    await User.deleteMany({});
    await Leave.deleteMany({});
    console.log('🗑️  Cleared existing data...');

    const lookup = {};
    const createdUsers = [];

    // Create users one by one to ensure middleware runs (hashing)
    for (const uData of seedUsers) {
      const { _ref, _managerId, ...rest } = uData;
      const user = new User(rest);
      const saved = await user.save();
      lookup[_ref] = saved._id;
      createdUsers.push({ saved, _ref, _managerId });
    }

    // Set Manager IDs
    for (const u of createdUsers) {
      if (u._managerId) {
        await User.findByIdAndUpdate(u.saved._id, { managerId: lookup[u._managerId] });
      }
    }
    console.log('✅ Users & Managers seeded.');

    // Sample Leaves
    const today = new Date();
    const leaves = [
      {
        employee: lookup['rahul'], leaveType: 'earned',
        startDate: new Date(today.getTime() + 86400000 * 2),
        endDate: new Date(today.getTime() + 86400000 * 5),
        reason: 'Family vacation to mountains', status: 'pending', totalDays: 3
      },
      {
        employee: lookup['dev'], leaveType: 'sick',
        startDate: new Date(today.getTime() - 86400000 * 3),
        endDate: new Date(today.getTime() - 86400000 * 1),
        reason: 'Recovering from viral fever', status: 'approved',
        reviewedBy: lookup['priya'], reviewComment: 'Get well soon!',
        reviewedAt: new Date(), totalDays: 2
      },
      {
        employee: lookup['sneha'], leaveType: 'casual',
        startDate: new Date(today.getTime() + 86400000),
        endDate: new Date(today.getTime() + 86400000),
        reason: 'Personal errands', status: 'pending', totalDays: 1
      },
      {
        employee: lookup['vikram'], leaveType: 'earned',
        startDate: new Date(today.getTime() + 86400000 * 10),
        endDate: new Date(today.getTime() + 86400000 * 15),
        reason: 'Sibling wedding', status: 'pending', totalDays: 5
      },
      {
        employee: lookup['anita'], leaveType: 'sick',
        startDate: new Date(today.getTime()),
        endDate: new Date(today.getTime() + 86400000),
        reason: 'Heavy migraine', status: 'approved',
        reviewedBy: lookup['meera'], reviewComment: 'Take complete rest.',
        reviewedAt: new Date(), totalDays: 2
      },
      {
        employee: lookup['karan'], leaveType: 'casual',
        startDate: new Date(today.getTime() + 86400000 * 4),
        endDate: new Date(today.getTime() + 86400000 * 4),
        reason: 'Aadhaar card update work', status: 'pending', totalDays: 1
      }
    ];

    await Leave.create(leaves);
    console.log('✅ Sample leaves seeded.');

    console.log('\n🚀 SEEDING COMPLETE');
    console.log('---------------------------');
    console.log('Admin:    admin@employeesync.com / admin123');
    console.log('Manager:  manager@employeesync.com / password123');
    console.log('Employee: employee@employeesync.com / password123');
    console.log('---------------------------\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding:', err);
    process.exit(1);
  }
};

seed();
