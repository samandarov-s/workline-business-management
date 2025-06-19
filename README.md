# Workline - Business Workflow & Inventory Management System

A comprehensive business management platform built with React, TypeScript, and FastAPI. Workline helps businesses manage tasks, projects, inventory, time tracking, accounting, and reporting in one unified system.

## 🚀 Features

### Frontend (React + TypeScript)
- **Authentication**: Role-based access control (Admin, Manager, Employee, Accountant)
- **Dashboard**: Real-time metrics and role-specific widgets
- **Task Management**: Full CRUD operations with Kanban-style interface
- **Project Management**: Project tracking with task association
- **Inventory Management**: Stock tracking and management
- **Time Tracking**: Employee time logging and reporting
- **Accounting**: Financial records and accounting features
- **Reporting**: Comprehensive business reports
- **User Management**: Admin-only user administration

### Backend (FastAPI + PostgreSQL/SQLite)
- **RESTful API**: Complete backend API with authentication
- **Database Models**: User, Task, Project, Inventory, TimeEntry, FinancialRecord, Accounting
- **JWT Authentication**: Secure user authentication with role-based permissions
- **Data Validation**: Pydantic schemas for request/response validation
- **Database ORM**: SQLAlchemy with PostgreSQL/SQLite support

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Axios** for API communication
- **React Context** for state management

### Backend
- **FastAPI** Python web framework
- **SQLAlchemy** ORM for database operations
- **PostgreSQL/SQLite** database
- **Pydantic** for data validation
- **JWT** for authentication
- **Uvicorn** ASGI server

## 📁 Project Structure

```
workline/
├── bizflow-frontend/          # React TypeScript frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   ├── layouts/          # Layout components
│   │   ├── context/          # React context providers
│   │   ├── services/         # API service layer
│   │   └── hooks/            # Custom React hooks
│   ├── public/               # Static assets
│   └── package.json
│
└── bizflow-backend/           # FastAPI Python backend
    ├── app/
    │   ├── models/           # Database models
    │   ├── routers/          # API route handlers
    │   ├── schemas/          # Pydantic schemas
    │   ├── services/         # Business logic services
    │   └── main.py           # FastAPI application
    └── requirements.txt
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- PostgreSQL (optional, SQLite fallback available)

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd bizflow-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd bizflow-backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables** (optional):
   ```bash
   set DATABASE_URL=postgresql://user:password@localhost/bizflow  # Windows
   set JWT_SECRET_KEY=your-secret-key
   ```

5. **Initialize database:**
   ```bash
   python app/init_db.py
   ```

6. **Start backend server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

   The API will be available at `http://localhost:8000`

## 👤 User Roles & Permissions

### Admin
- Full system access
- User management
- All features available

### Manager
- Project and task management
- Team oversight
- Reporting access

### Employee
- Task management
- Time tracking
- Limited inventory access

### Accountant
- Financial records
- Accounting features
- Financial reporting

## 🧪 Current Status

### ✅ Completed Features
- Complete frontend UI with professional design
- Role-based authentication system
- Dashboard with real-time metrics
- Full task management (CRUD operations)
- Project management interface
- Responsive design
- API service layer ready for backend integration

### 🚧 In Development
- Backend authentication integration
- Database optimization
- Advanced filtering and search
- Real-time notifications
- Advanced reporting features

### 📋 Planned Features
- Mobile app
- Advanced analytics
- Email notifications
- File upload/management
- Integration APIs
- Multi-tenant support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ for modern businesses** 