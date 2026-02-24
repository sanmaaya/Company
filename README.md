# 🌿 LeaveSync — Employee Leave Management System

A full-stack Leave Management System built with React.js, Node.js, Express.js, MongoDB, and JWT authentication.

---

## 📋 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS (CDN) |
| Routing | React Router v6 |
| State Management | Context API (AuthContext + LeaveContext) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Token) |
| Authorization | Role-Based Access Control (Admin / Manager / Employee) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone & Install

```bash
git clone <repo-url>
cd leavesync

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leavesync
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Frontend: http://localhost:3000  
Backend API: http://localhost:5000

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | admin@leavesync.com | password123 |
| 👔 Manager | manager@leavesync.com | password123 |
| 👤 Employee | employee@leavesync.com | password123 |

---

## 📁 Folder Structure

```
leavesync/
├── backend/
│   ├── config/
│   │   └── seed.js                # Database seeder
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Profile
│   │   ├── leaveController.js     # Leave CRUD + review
│   │   └── userController.js      # User management (Admin)
│   ├── middleware/
│   │   └── auth.js                # JWT protect + authorize (RBAC)
│   ├── models/
│   │   ├── User.js                # User schema with roles & leave balance
│   │   └── Leave.js               # Leave schema with status tracking
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── leaveRoutes.js
│   │   └── userRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html             # Tailwind CDN loaded here
    └── src/
        ├── components/
        │   ├── common/
        │   │   ├── LoadingSpinner.js
        │   │   ├── ProtectedRoute.js  # JWT + role guard
        │   │   ├── StatusBadge.js
        │   │   └── Toast.js           # Notification system
        │   └── layout/
        │       ├── DashboardLayout.js
        │       ├── Header.js
        │       └── Sidebar.js         # Role-based nav
        ├── context/
        │   ├── AuthContext.js         # Global auth state (Context API)
        │   └── LeaveContext.js        # Global leave state (Context API)
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.js
        │   │   └── Register.js
        │   ├── employee/
        │   │   ├── Dashboard.js
        │   │   ├── ApplyLeave.js
        │   │   ├── MyLeaves.js
        │   │   └── Profile.js
        │   ├── manager/
        │   │   ├── Approvals.js
        │   │   └── Team.js
        │   ├── admin/
        │   │   ├── AdminUsers.js
        │   │   └── AdminLeaves.js
        │   └── Unauthorized.js
        ├── utils/
        │   └── api.js                 # Axios instance with interceptors
        └── App.js                     # React Router configuration
```

---

## ✅ Features Implemented

### Authentication & Security (20 marks)
- [x] JWT-based login/register
- [x] Password hashing with bcryptjs
- [x] Token stored in localStorage with auto-expiry
- [x] Axios interceptors attach token to all requests
- [x] Auto-redirect on 401 (token expired)
- [x] Input validation (express-validator + frontend)

### Role-Based Authorization (20 marks)
- [x] 3 roles: Admin, Manager, Employee
- [x] Backend `authorize()` middleware on all routes
- [x] Frontend `ProtectedRoute` with role guard
- [x] Role-based sidebar navigation
- [x] Role-based leave query filtering

### Frontend UI (15 marks)
- [x] Tailwind CSS throughout
- [x] React Router v6 with protected routes
- [x] Context API for global auth + leave state
- [x] Loading states on all async operations
- [x] Error handling with toast notifications
- [x] Responsive layout with collapsible sidebar

### Backend API (15 marks)
- [x] RESTful Express.js API
- [x] Industry-standard folder structure
- [x] Request validation middleware
- [x] Error handling middleware
- [x] Role-based route protection

### Database Design (10 marks)
- [x] User model with role, department, leave balance
- [x] Leave model with status tracking, reviewer reference
- [x] Mongoose validation & pre-save hooks
- [x] Population of references

### Code Quality (10 marks)
- [x] Controller/Route/Model/Middleware separation
- [x] Reusable components (Badge, Toast, Spinner, Layout)
- [x] .env for secrets
- [x] Consistent error response format

---

## 📡 API Endpoints

### Auth
```
POST   /api/auth/register     Public
POST   /api/auth/login        Public
GET    /api/auth/me           Private
PUT    /api/auth/profile      Private
```

### Leaves
```
GET    /api/leaves            Private (role-filtered)
GET    /api/leaves/stats      Private
GET    /api/leaves/:id        Private
POST   /api/leaves            Private (Employee, Manager)
PUT    /api/leaves/:id/review Private (Manager, Admin)
DELETE /api/leaves/:id        Private (own pending leaves)
```

### Users
```
GET    /api/users             Private (Admin, Manager)
GET    /api/users/:id         Private (Admin)
POST   /api/users             Private (Admin)
PUT    /api/users/:id         Private (Admin)
DELETE /api/users/:id         Private (Admin)
GET    /api/users/stats       Private (Admin)
```
