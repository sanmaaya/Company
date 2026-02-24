const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/User');
const Leave = require('./models/Leave');

// ─────────────────────────────────────────────────────────────
//  SEED USERS  (Admin · HR Managers · Dept Managers · Employees)
// ─────────────────────────────────────────────────────────────
const seedUsers = [
  // ── ADMIN ──────────────────────────────────────────────────
  {
    name: 'Admin User',
    email: 'admin@leavesync.com',
    password: 'admin123',
    role: 'admin',
    department: 'Management',
    leaveBalance: { casual: 15, sick: 12, earned: 20, unpaid: 0 },
  },

  // ── HR MANAGERS ────────────────────────────────────────────
  {
    name: 'Meera Iyer',
    email: 'hr@leavesync.com',
    password: 'hr123456',
    role: 'manager',
    department: 'Human Resources',
    leaveBalance: { casual: 12, sick: 10, earned: 15, unpaid: 0 },
    _ref: 'meera',
  },
  {
    name: 'Rohan Kapoor',
    email: 'hr2@leavesync.com',
    password: 'hr123456',
    role: 'manager',
    department: 'Human Resources',
    leaveBalance: { casual: 12, sick: 10, earned: 15, unpaid: 0 },
    _ref: 'rohan',
  },

  // ── DEPARTMENT MANAGERS ────────────────────────────────────
  {
    name: 'Priya Sharma',
    email: 'manager@leavesync.com',
    password: 'manager123',
    role: 'manager',
    department: 'Engineering',
    leaveBalance: { casual: 12, sick: 10, earned: 15, unpaid: 0 },
    _ref: 'priya',
  },
  {
    name: 'Arjun Nair',
    email: 'manager2@leavesync.com',
    password: 'manager123',
    role: 'manager',
    department: 'Sales',
    leaveBalance: { casual: 12, sick: 10, earned: 15, unpaid: 0 },
    _ref: 'arjun',
  },

  // ── EMPLOYEES (Engineering) ─────────────────────────────────
  {
    name: 'Rahul Mehta',
    email: 'employee@leavesync.com',
    password: 'employee123',
    role: 'employee',
    department: 'Engineering',
    leaveBalance: { casual: 10, sick: 8, earned: 12, unpaid: 0 },
    _ref: 'rahul',
    _managerId: 'meera',   // all employees report to HR manager
  },
  {
    name: 'Dev Patel',
    email: 'dev@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    leaveBalance: { casual: 8, sick: 6, earned: 10, unpaid: 0 },
    _ref: 'dev',
    _managerId: 'meera',
  },
  {
    name: 'Siddharth Rao',
    email: 'sid@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Engineering',
    leaveBalance: { casual: 9, sick: 7, earned: 11, unpaid: 0 },
    _ref: 'sid',
    _managerId: 'meera',
  },

  // ── EMPLOYEES (HR Dept) ──────────────────────────────────────
  {
    name: 'Anita Roy',
    email: 'anita@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Human Resources',
    leaveBalance: { casual: 10, sick: 8, earned: 12, unpaid: 0 },
    _ref: 'anita',
    _managerId: 'meera',
  },
  {
    name: 'Pooja Krishnan',
    email: 'pooja@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Human Resources',
    leaveBalance: { casual: 10, sick: 9, earned: 13, unpaid: 0 },
    _ref: 'pooja',
    _managerId: 'meera',
  },

  // ── EMPLOYEES (Design) ───────────────────────────────────────
  {
    name: 'Sneha Verma',
    email: 'sneha@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Design',
    leaveBalance: { casual: 10, sick: 9, earned: 12, unpaid: 0 },
    _ref: 'sneha',
    _managerId: 'meera',
  },
  {
    name: 'Vikram Desai',
    email: 'vikram@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Design',
    leaveBalance: { casual: 9, sick: 8, earned: 11, unpaid: 0 },
    _ref: 'vikram',
    _managerId: 'meera',
  },

  // ── EMPLOYEES (Sales) ────────────────────────────────────────
  {
    name: 'Karan Singh',
    email: 'karan@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Sales',
    leaveBalance: { casual: 9, sick: 7, earned: 11, unpaid: 0 },
    _ref: 'karan',
    _managerId: 'meera',
  },
  {
    name: 'Nisha Agarwal',
    email: 'nisha@leavesync.com',
    password: 'password123',
    role: 'employee',
    department: 'Sales',
    leaveBalance: { casual: 10, sick: 8, earned: 12, unpaid: 0 },
    _ref: 'nisha',
    _managerId: 'meera',
  },
];

// ─────────────────────────────────────────────────────────────
//  MAIN SEED FUNCTION
// ─────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('\n🔌 Connected to MongoDB...');

    // Clear existing data
    await User.deleteMany({});
    await Leave.deleteMany({});
    console.log('🗑️  Cleared existing data...');

    // Extract _ref and _managerId before inserting (not real schema fields)
    const refMap = {};
    const managerRefMap = {};
    const cleanUsers = seedUsers.map(u => {
      const { _ref, _managerId, ...rest } = u;
      if (_ref) refMap[_ref] = null;
      if (_ref && _managerId) managerRefMap[_ref] = _managerId;
      return rest;
    });

    // Create users (pre-save hook hashes passwords automatically)
    const created = await User.create(cleanUsers);
    console.log('✅ Users seeded:', created.map(u => `${u.name} (${u.role})`).join(', '));

    // Build a ref → userId lookup
    const lookup = {};
    seedUsers.forEach((u, i) => {
      if (u._ref) lookup[u._ref] = created[i]._id;
    });

    // Assign managerId to employees
    const updatePromises = [];
    seedUsers.forEach((u, i) => {
      if (u._managerId) {
        updatePromises.push(
          User.findByIdAndUpdate(created[i]._id, { managerId: lookup[u._managerId] })
        );
      }
    });
    await Promise.all(updatePromises);
    console.log('✅ Manager assignments set');

    // ── SAMPLE LEAVE REQUESTS ─────────────────────────────────
    // Helper
    const id = (ref) => lookup[ref];

    const leaves = [
      // ── RAHUL (Engineering · reports to Meera) ──────────────
      {
        employee: id('rahul'), leaveType: 'earned',
        startDate: new Date('2025-04-01'), endDate: new Date('2025-04-05'),
        reason: 'Annual vacation with family.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Approved. Well deserved rest!',
        reviewedAt: new Date('2025-03-28'), totalDays: 5,
      },
      {
        employee: id('rahul'), leaveType: 'casual',
        startDate: new Date('2025-05-10'), endDate: new Date('2025-05-10'),
        reason: 'Personal work and family commitment.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Approved. Enjoy your day off.',
        reviewedAt: new Date('2025-05-09'), totalDays: 1,
      },
      {
        employee: id('rahul'), leaveType: 'sick',
        startDate: new Date('2025-06-23'), endDate: new Date('2025-06-25'),
        reason: 'High fever and doctor advised rest for 3 days.', status: 'pending', totalDays: 3,
      },
      {
        employee: id('rahul'), leaveType: 'unpaid',
        startDate: new Date('2025-07-14'), endDate: new Date('2025-07-18'),
        reason: 'Personal extended travel.', status: 'rejected',
        reviewedBy: id('meera'), reviewComment: 'Project deadline conflicts. Not approved.',
        reviewedAt: new Date('2025-07-10'), totalDays: 5,
      },

      // ── DEV (Engineering · reports to Meera) ─────────────────
      {
        employee: id('dev'), leaveType: 'earned',
        startDate: new Date('2025-03-15'), endDate: new Date('2025-03-20'),
        reason: 'Wedding ceremony in family.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Congratulations! Approved.',
        reviewedAt: new Date('2025-03-10'), totalDays: 6,
      },
      {
        employee: id('dev'), leaveType: 'sick',
        startDate: new Date('2025-07-08'), endDate: new Date('2025-07-09'),
        reason: 'Stomach infection, advised rest by doctor.', status: 'pending', totalDays: 2,
      },
      {
        employee: id('dev'), leaveType: 'casual',
        startDate: new Date('2025-08-20'), endDate: new Date('2025-08-21'),
        reason: 'Moving to new apartment.', status: 'pending', totalDays: 2,
      },

      // ── ANITA (HR Dept · reports to Meera) ──────────────────
      {
        employee: id('anita'), leaveType: 'sick',
        startDate: new Date('2025-06-01'), endDate: new Date('2025-06-02'),
        reason: 'Migraine attack. Doctor consultation needed.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Take care. Approved.',
        reviewedAt: new Date('2025-05-31'), totalDays: 2,
      },
      {
        employee: id('anita'), leaveType: 'casual',
        startDate: new Date('2025-07-20'), endDate: new Date('2025-07-20'),
        reason: 'Bank work and personal errands.', status: 'pending', totalDays: 1,
      },
      {
        employee: id('anita'), leaveType: 'earned',
        startDate: new Date('2025-09-10'), endDate: new Date('2025-09-15'),
        reason: 'Planned family trip to Goa.', status: 'pending', totalDays: 6,
      },

      // ── POOJA (HR Dept · reports to Meera) ──────────────────
      {
        employee: id('pooja'), leaveType: 'casual',
        startDate: new Date('2025-05-22'), endDate: new Date('2025-05-22'),
        reason: 'Doctor appointment and health checkup.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Approved. Take care!',
        reviewedAt: new Date('2025-05-21'), totalDays: 1,
      },
      {
        employee: id('pooja'), leaveType: 'earned',
        startDate: new Date('2025-08-01'), endDate: new Date('2025-08-05'),
        reason: 'Annual leave for personal travel.', status: 'pending', totalDays: 5,
      },

      // ── SIDDHARTH (Engineering · reports to Priya) ───────────
      {
        employee: id('sid'), leaveType: 'sick',
        startDate: new Date('2025-06-10'), endDate: new Date('2025-06-11'),
        reason: 'Cold and flu, doctor rest advised.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Get well soon!',
        reviewedAt: new Date('2025-06-09'), totalDays: 2,
      },
      {
        employee: id('sid'), leaveType: 'casual',
        startDate: new Date('2025-07-25'), endDate: new Date('2025-07-25'),
        reason: "Sibling's graduation ceremony.", status: 'pending', totalDays: 1,
      },

      // ── SNEHA (Design · reports to Meera/HR) ─────────────────
      {
        employee: id('sneha'), leaveType: 'casual',
        startDate: new Date('2025-06-12'), endDate: new Date('2025-06-13'),
        reason: 'Home renovation work scheduled.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Approved, enjoy!',
        reviewedAt: new Date('2025-06-10'), totalDays: 2,
      },
      {
        employee: id('sneha'), leaveType: 'earned',
        startDate: new Date('2025-08-05'), endDate: new Date('2025-08-10'),
        reason: 'Planned international trip.', status: 'pending', totalDays: 6,
      },

      // ── VIKRAM (Design · reports to Meera/HR) ────────────────
      {
        employee: id('vikram'), leaveType: 'earned',
        startDate: new Date('2025-07-01'), endDate: new Date('2025-07-05'),
        reason: 'Parents anniversary family trip.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Enjoy the trip!',
        reviewedAt: new Date('2025-06-28'), totalDays: 5,
      },
      {
        employee: id('vikram'), leaveType: 'sick',
        startDate: new Date('2025-08-18'), endDate: new Date('2025-08-19'),
        reason: 'Back pain due to long working hours.', status: 'pending', totalDays: 2,
      },

      // ── KARAN (Sales · reports to Meera/HR) ──────────────────
      {
        employee: id('karan'), leaveType: 'casual',
        startDate: new Date('2025-05-28'), endDate: new Date('2025-05-29'),
        reason: 'Personal travel plans.', status: 'rejected',
        reviewedBy: id('meera'), reviewComment: 'Quarter-end review week – not approved.',
        reviewedAt: new Date('2025-05-25'), totalDays: 2,
      },
      {
        employee: id('karan'), leaveType: 'sick',
        startDate: new Date('2025-07-02'), endDate: new Date('2025-07-03'),
        reason: 'Viral fever, rest recommended.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Approved. Get well soon.',
        reviewedAt: new Date('2025-07-01'), totalDays: 2,
      },
      {
        employee: id('karan'), leaveType: 'earned',
        startDate: new Date('2025-09-01'), endDate: new Date('2025-09-05'),
        reason: 'Wedding celebration in hometown.', status: 'pending', totalDays: 5,
      },

      // ── NISHA (Sales · reports to Meera/HR) ──────────────────
      {
        employee: id('nisha'), leaveType: 'casual',
        startDate: new Date('2025-06-20'), endDate: new Date('2025-06-20'),
        reason: 'Child school function attendance.', status: 'approved',
        reviewedBy: id('meera'), reviewComment: 'Approved!',
        reviewedAt: new Date('2025-06-19'), totalDays: 1,
      },
      {
        employee: id('nisha'), leaveType: 'earned',
        startDate: new Date('2025-08-12'), endDate: new Date('2025-08-16'),
        reason: 'Anniversary trip with family.', status: 'pending', totalDays: 5,
      },
    ];

    await Leave.create(leaves);
    console.log(`✅ ${leaves.length} leave records seeded`);

    // ── PRINT CREDENTIALS TABLE ──────────────────────────────
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║               🔑  DEFAULT LOGIN CREDENTIALS                ║');
    console.log('╠═══════════════════╦══════════════════════════╦═════════════╣');
    console.log('║ Role              ║ Email                    ║ Password    ║');
    console.log('╠═══════════════════╬══════════════════════════╬═════════════╣');
    console.log('║ Admin             ║ admin@leavesync.com      ║ admin123    ║');
    console.log('╠═══════════════════╬══════════════════════════╬═════════════╣');
    console.log('║ HR Manager        ║ hr@leavesync.com         ║ hr123456    ║');
    console.log('║ HR Manager 2      ║ hr2@leavesync.com        ║ hr123456    ║');
    console.log('║ Eng Manager       ║ manager@leavesync.com    ║ manager123  ║');
    console.log('║ Sales Manager     ║ manager2@leavesync.com   ║ manager123  ║');
    console.log('╠═══════════════════╬══════════════════════════╬═════════════╣');
    console.log('║ Employee (Eng)    ║ employee@leavesync.com   ║ employee123 ║');
    console.log('║ Employee (Eng)    ║ dev@leavesync.com        ║ password123 ║');
    console.log('║ Employee (Eng)    ║ sid@leavesync.com        ║ password123 ║');
    console.log('║ Employee (HR)     ║ anita@leavesync.com      ║ password123 ║');
    console.log('║ Employee (HR)     ║ pooja@leavesync.com      ║ password123 ║');
    console.log('║ Employee (Design) ║ sneha@leavesync.com      ║ password123 ║');
    console.log('║ Employee (Design) ║ vikram@leavesync.com     ║ password123 ║');
    console.log('║ Employee (Sales)  ║ karan@leavesync.com      ║ password123 ║');
    console.log('║ Employee (Sales)  ║ nisha@leavesync.com      ║ password123 ║');
    console.log('╚═══════════════════╩══════════════════════════╩═════════════╝');
    console.log('\n🎉 Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder error:', error);
    process.exit(1);
  }
};

seed();
