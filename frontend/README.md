# 🚀 TaskFlow - Project Management System

TaskFlow is a full-stack MERN based project management application that helps users manage projects and tasks efficiently. It provides role-based authentication where Admin can manage users, projects, and tasks while users can create and manage their own workflow.

---

# ✨ Features

## 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Secure password encryption using bcrypt
- Role-based access (Admin/User)

---

# 👑 Admin Features

- Admin Dashboard
- View total users, projects, and tasks
- Manage users
- Manage projects
- Manage tasks
- View task statistics

---

# 👤 User Features

- User Dashboard
- Create projects
- Update projects
- Delete projects
- Create tasks
- Update tasks
- Delete tasks
- Manage task status and priority

---

# 📋 Task Management

- Task creation and management
- Task priority:
  - Low
  - Medium
  - High

- Task status:
  - Todo
  - In Progress
  - Done

- Due date tracking

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Vite
- React Router DOM
- Axios
- CSS3

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js

## Tools
- VS Code
- MongoDB Compass
- Postman

---

# 📂 Project Structure

```
TaskFlow
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── config
│   └── server.js
│
└── frontend
    ├── src
    │   ├── components
    │   ├── pages
    │   ├── services
    │   └── styles
    │
    └── package.json
```

---

# ⚙️ Installation & Setup

## Clone Repository

```bash
git clone <your-repository-url>

cd TaskFlow
```

---

# Backend Setup

Go to backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/taskflow

JWT_SECRET=taskflow_secret_key_123
```

Run backend server:

```bash
npm run dev
```

Backend will run on:

```
http://localhost:5000
```

---

# Frontend Setup

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run React application:

```bash
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

# 🔗 API Endpoints

## Authentication

Register:

```
POST /api/auth/register
```

Login:

```
POST /api/auth/login
```

---

## Projects API

```
GET    /api/projects

POST   /api/projects

PUT    /api/projects/:id

DELETE /api/projects/:id
```

---

## Tasks API

```
GET    /api/tasks

POST   /api/tasks

PUT    /api/tasks/:id

DELETE /api/tasks/:id
```

---

## Admin API

Dashboard:

```
GET /api/admin/dashboard
```

Users:

```
GET /api/admin/users
```

Projects:

```
GET /api/admin/projects
```

Tasks:

```
GET /api/admin/tasks
```

---

# 🔑 User Roles

## Admin

Admin can:
- Manage users
- Manage projects
- Manage tasks
- View dashboard analytics


## User

User can:
- Create projects
- Manage tasks
- Track workflow

---

# 🚀 Future Improvements

- Drag and Drop Kanban Board
- Real-time notifications
- Team collaboration
- File attachments
- Comments system
- Cloud deployment

---

# 👨‍💻 Developer

**Neha Sharma**

MERN Stack Developer


