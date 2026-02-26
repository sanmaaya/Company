# 🌿 WORK Balance — Premium Employee Leave & Team Management

A full-stack, real-time Employee Leave Management System with a premium UI, role-based access control, team collaboration tools, and data export capabilities. Built with **React.js**, **Node.js**, **Express.js**, **MongoDB**, **Socket.io**, and **Tailwind CSS**.

---

## ✨ Feature Overview

### 👥 Role-Based Access Control (RBAC)
Three distinct roles with tailored experiences:
- **Employee** — Apply for leave, track approvals, view team calendar, chat, and access the directory.
- **Manager** — All employee features + approve/reject team leaves, view Risk Monitor, project portfolio, and export data.
- **Admin** — All manager features + manage all users, view all leaves, and full system administration.

> **Note**: Admins cannot apply for leave themselves. Only Employees and Managers can request leave.

---

### 🏠 Operational Dashboard
- **Welcome Banner** — Personalized greeting with role, department, and quick-action buttons.
- **Stat Cards** — Live counts for Pending Tasks, Casual, Sick, and Earned Leave balances.
- **Leave Calendar** — Company-wide calendar showing approved leaves for all staff (synchronized across all roles).
- **Task Roadmap** — Assigned tasks with completion tracking and a progress velocity indicator.
- **Company Status** — Real-time list of who is online, on a task, or on approved leave.
- **Risk Monitor** *(Manager/Admin)* — Live feed of overdue tasks with employee avatars and linked projects.
- **Portfolio Status** *(Manager/Admin)* — Active project health overview with status indicators.

---

### 📅 Leave Management
- Apply for Casual, Sick, or Earned leave with a reason and date range.
- Approval hierarchy: **Employee → Manager → Admin**.
- Managers approve employee leaves; Admins approve manager leaves.
- Leave calendar updates globally and in real-time once a leave is approved.

---

### 💬 Real-Time Chat
- **Direct Messaging** — Peer-to-peer real-time communication between any two agents.
- **Persistent history** — Messages are synchronized with MongoDB and loaded contextually.
- **Unread Counters** — Accurately tracks unread counts internally for messages while offline or tabbed away.
- **Micro-Events** — Real-time online/offline indicators and typing animations.
- Toast notifications for incoming transmissions when the chat widget is minimized.

---

### 👥 Team Directory
Accessible from the sidebar by all users. Displays rich contact cards for every team member including:
- Full name, role badge, department, job title.
- Clickable email and phone number for instant contact.
- Search by name, department, or job title.

---

### ⚙️ System Settings *(Manager & Admin only)*
A dedicated settings page with:
- **Personnel Data Export** — Download a report of all employee records (CSV format).
- **Leave Analytics Export** — Download a comprehensive leave history report.
- System status indicators (API health, privacy tier).

---

### 🎨 Design & UX
- **Premium Light Theme** by default on every login session.
- **Dark/Light Mode Toggle** in the top header for personalized viewing.
- Glassmorphism cards, animated ambient backgrounds, and smooth micro-animations.
- Fully responsive — works on mobile, tablet, and desktop.

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Tailwind CSS |
| **State** | React Context API (Auth, Leave, Theme) |
| **Animation** | Framer Motion |
| **Real-Time** | Socket.io (WebSockets) |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT (7-day expiry) + Role Guards |
| **Validation** | express-validator |

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local instance or Atlas URI)
- Two terminal windows

### 1. Clone the Repository
```bash
git clone https://github.com/sanmaaya/Company.git
cd Company
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend (in a new terminal)
cd frontend
npm install
```

### 3. Configure Environment
Create a file `backend/.env` with the following:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leavesync
JWT_SECRET=leavesync_super_secret_jwt_key_2024
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Seed the Database
```bash
cd backend
npm run seed
```
This populates the database with demo users, projects, tasks, and leaves.

### 5. Run the Application
```bash
# Terminal 1 — Backend API + Socket.io
cd backend
npm run dev

# Terminal 2 — Frontend Dev Server
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔑 Demo Accounts

| Role | Name | Email | Password |
|------|------|-------|---------|
| **Admin** | Meera Iyer | `meera@leavesync.com` | `password123` |
| **Admin** | Rahul Khanna | `rahul@leavesync.com` | `password123` |
| **Manager** | Riya Verma | `manager@leavesync.com` | `password123` |
| **Manager** | Suresh Raina | `suresh@leavesync.com` | `password123` |
| **Employee** | Amit Patel | `employee@leavesync.com` | `password123` |
| **Employee** | Priya Sharma | `priya@leavesync.com` | `password123` |
| **Employee** | Rohan Mehra | `rohan@leavesync.com` | `password123` |
| **Employee** | Anjali Gupta | `anjali@leavesync.com` | `password123` |

---

## 📁 Project Structure

```
Company/
├── backend/
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── seed.js            # Database seeder
│   ├── controllers/
│   │   ├── authController.js  # Login, register, profile
│   │   ├── leaveController.js # Leave CRUD + approvals
│   │   ├── projectController.js # Projects & tasks
│   │   ├── userController.js  # User management
│   │   └── chatController.js  # Group chat management
│   ├── middleware/
│   │   └── auth.js            # JWT protect + role authorize
│   ├── models/
│   │   ├── User.js
│   │   ├── Leave.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Group.js
│   │   └── Message.js         # Persistent chat messages
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── userRoutes.js
│   │   └── chatRoutes.js
│   └── server.js              # Express + Socket.io server
│
└── frontend/
    └── src/
        ├── components/
        │   ├── common/
        │   │   ├── Avatar.jsx         # Auto photo or gradient initials
        │   │   ├── LeaveCalendar.jsx  # Company-wide calendar
        │   │   ├── CompanyStatusList.jsx # Live presence tracker
        │   │   └── ChatWidget.jsx     # Floating real-time chat
        │   └── layout/
        │       ├── Sidebar.jsx        # Role-aware navigation
        │       ├── Header.jsx         # Dark/light toggle + greeting
        │       └── DashboardLayout.jsx
        ├── context/
        │   ├── AuthContext.jsx        # Auth state (login/logout/user)
        │   ├── LeaveContext.jsx       # Leave stats + fetch
        │   └── ThemeContext.jsx       # Light/dark mode
        ├── pages/
        │   ├── employee/
        │   │   ├── Dashboard.jsx      # Main operational hub
        │   │   ├── ApplyLeave.jsx
        │   │   ├── MyLeaves.jsx
        │   │   ├── Contacts.jsx       # Team Directory (all users)
        │   │   └── Profile.jsx
        │   ├── manager/
        │   │   ├── Approvals.jsx
        │   │   └── Settings.jsx       # Export + system settings
        │   └── admin/
        │       ├── AdminUsers.jsx
        │       └── AdminLeaves.jsx
        └── utils/
            └── api.js                 # Axios instance + interceptors
```

---

## 🔒 API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/register` | Public |
| GET | `/api/auth/me` | Protected |
| PUT | `/api/auth/profile` | Protected |

### Leaves
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/leaves` | Protected (role-filtered) |
| POST | `/api/leaves` | Employee, Manager |
| PUT | `/api/leaves/:id/review` | Manager, Admin |
| GET | `/api/leaves/stats` | Protected |

### Projects & Tasks
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/projects` | Protected |
| GET | `/api/projects/my-tasks` | Protected |
| GET | `/api/projects/tasks/overdue` | Manager, Admin |
| PUT | `/api/projects/tasks/:id` | Protected |

---

## 🔌 Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user:online` | Client → Server | Register user presence |
| `users:online` | Server → Client | Broadcast online list |
| `room:join` | Client → Server | Join a DM or group room |
| `messages:history` | Server → Client | Load past 50 messages |
| `message:send` | Client → Server | Send and persist a message |
| `message:new` | Server → Client | Broadcast new message to room |
| `typing:start/stop` | Client → Server | Typing indicators |

---

Developed with ❤️ for the WORK Balance platform.
