# Task Manager - Intelligent Project Management

Task Manager is a modern, high-performance project management web application built with Next.js, Prisma, and NextAuth. It features a premium, dark-themed interface designed for efficiency and ease of use.

## 🚀 Key Features

- **Authentication**: Secure signup and login using NextAuth.js with custom credentials provider.
- **Role-Based Access Control (RBAC)**: Distinct permissions for Admins and Members.
- **Project Management**: Create, view, and manage projects.
- **Task Management**: Create tasks, assign them to team members, set priorities, and track status.
- **Dashboard**: Real-time overview of task statistics and recent activities.
- **Premium Design**: Dark mode by default, glassmorphism, and smooth transitions.

## ⚙️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Prisma ORM with SQLite (Local) / PostgreSQL (Production)
- **Auth**: NextAuth.js
- **Styling**: Vanilla CSS (CSS Modules)
- **Icons**: Lucide React
- **Validation**: Zod (planned for advanced validation)

## 🛠️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd task-manager
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

This application is ready for deployment on **Railway**.
Ensure you provide the following environment variables on Railway:
- `DATABASE_URL` (PostgreSQL)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` (Your live URL)

