# Employee Leave Management System (ELMS)

A modern, full-stack Employee Leave Management System built with the MERN stack.

## 🚀 Features
- **Authentication**: JWT-based login and registration with Role-Based Access Control (RBAC).
- **Role-Based Dashboards**:
  - **Employee**: Apply for leave, view personal leave history, and track status.
  - **Manager/Admin**: View all leave requests, approve or reject applications with comments, and see analytics.
- **Analytics**: Visualization of leave statistics using Chart.js.
- **Responsive UI**: Built with Tailwind CSS and Framer Motion for a premium look and feel.
- **Protected Routes**: Secure navigation using React Router.
- **Global State**: Managed using React Context API.

## 🛠 Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide React, Framer Motion, Chart.js.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Auth**: JSON Web Tokens (JWT) & BcryptJS.

## 📂 Project Structure
```
/root
  ├── /backend
  │   ├── /config (Database connection)
  │   ├── /controllers (Auth & Leave logic)
  │   ├── /middleware (Auth & Role protection)
  │   ├── /models (User & Leave schemas)
  │   └── /routes (API endpoints)
  └── /frontend
      ├── /src
      │   ├── /components (Reusable UI)
      │   ├── /context (Global Auth state)
      │   ├── /pages (Login, Dashboard, Form, etc.)
      │   └── /utils (Axios config)
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas URI

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/company_leave_db
   JWT_SECRET=your_jwt_secret_key
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

## 📸 Basic Wireframe
- **Login**: Elegant glassmorphic form.
- **Employee Dashboard**: Cards for totals, recent status table.
- **Apply Form**: Multi-field form with date pickers.
- **Manager Panel**: Filterable card grid for pending/approved/rejected requests.

## 🛡 Security
- Passwords are hashed using bcrypt.
- API endpoints are protected by JWT middleware.
- Only Managers/Admins can access the approval workflow.