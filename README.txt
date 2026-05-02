ETHARA AI - QUANTUM PROJECT MANAGEMENT
======================================

Ethara AI is a premium, AI-enhanced project management application designed for modern teams. Built with a futuristic 'Quantum Dark' aesthetic, it provides a seamless experience for orchestrating complex workflows with precision and clarity.

TECH STACK
----------
- Framework: Next.js (App Router)
- Database: PostgreSQL (via Neon DB)
- ORM: Prisma
- Authentication: NextAuth.js
- Styling: Vanilla CSS (Custom Quantum Design System)
- Icons: Lucide React

KEY FEATURES
------------
- Role-Based Access Control (Admin/Member)
- Project & Task Orchestration
- Real-time Team Collaboration
- Quantum Dashboard with Performance Analytics
- AI-Ready Task Prioritization

ENVIRONMENT VARIABLES
---------------------
To run this project, you need to add the following variables to your .env file:

DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"
NEXTAUTH_SECRET="your_random_secret_here"
NEXTAUTH_URL="http://localhost:3000"

GETTING STARTED
---------------
1. Install dependencies:
   npm install

2. Set up the database:
   npx prisma generate
   npx prisma db push

3. Start the development server:
   npm run dev

Open http://localhost:3000 in your browser to see the result.

DEPLOYMENT
----------
This project is optimized for Vercel. Ensure all environment variables are added in the Vercel Dashboard settings.

---
Created by Sakshi Chauhan
Repository: https://github.com/sakshichauhan02/task-ethara.git
