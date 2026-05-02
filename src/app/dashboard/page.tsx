import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatsCard from "@/components/dashboard/StatsCard";
import styles from "./dashboard.module.css";
import { CheckCircle2, Clock, ListTodo, AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  if (!userId) return null;
  
  const whereClause = isAdmin ? {} : {
    OR: [
      { assigneeId: userId },
      { project: { members: { some: { userId } } } }
    ]
  };

  // Fetch stats for the current user
  const totalTasks = await prisma.task.count({
    where: whereClause
  });

  const completedTasks = await prisma.task.count({ 
    where: { 
      ...whereClause,
      status: "COMPLETED",
    } 
  });

  const inProgressTasks = await prisma.task.count({ 
    where: { 
      ...whereClause,
      status: "IN_PROGRESS",
    } 
  });

  const overdueTasks = await prisma.task.count({
    where: {
      ...whereClause,
      status: { not: "COMPLETED" },
      dueDate: { lt: new Date() }
    }
  });

  const recentTasks = await prisma.task.findMany({
    where: whereClause,
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { project: true, assignee: true },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome, {session?.user?.name}</h1>
        <p>Here's what's happening with your projects today.</p>
      </header>

      <div className={styles.statsGrid}>
        <StatsCard 
          title="Total Tasks" 
          value={totalTasks} 
          icon={<ListTodo size={24} />} 
          color="#3b82f6" 
        />
        <StatsCard 
          title="In Progress" 
          value={inProgressTasks} 
          icon={<Clock size={24} />} 
          color="#f59e0b" 
        />
        <StatsCard 
          title="Completed" 
          value={completedTasks} 
          icon={<CheckCircle2 size={24} />} 
          color="#10b981" 
        />
        <StatsCard 
          title="Overdue" 
          value={overdueTasks} 
          icon={<AlertCircle size={24} />} 
          color="#ef4444" 
        />
      </div>

      <section className={styles.recentSection}>
        <h2>Recent Tasks</h2>
        <div className={styles.taskTable}>
          <div className={styles.tableHeader}>
            <span>Task</span>
            <span>Project</span>
            <span>Status</span>
            <span>Assignee</span>
          </div>
          {recentTasks.map((task) => (
            <div key={task.id} className={styles.tableRow}>
              <span className={styles.taskTitle}>{task.title}</span>
              <span className={styles.projectName}>{task.project.name}</span>
              <span className={`${styles.statusBadge} ${styles[task.status.toLowerCase()]}`}>
                {task.status.replace("_", " ")}
              </span>
              <span className={styles.assigneeName}>
                {task.assignee?.name || "Unassigned"}
              </span>
            </div>
          ))}
          {recentTasks.length === 0 && (
            <p className={styles.emptyState}>No tasks found. Create a project to get started!</p>
          )}
        </div>
      </section>
    </div>
  );
}
