import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatsCard from "@/components/dashboard/StatsCard";
import styles from "./dashboard.module.css";
import { 
  Zap,
  Activity,
  Layers,
  ShieldAlert,
  ArrowRight,
  Plus,
  Layout
} from "lucide-react";
import Link from "next/link";

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

  const [totalTasks, completedTasks, inProgressTasks, overdueTasks] = await Promise.all([
    prisma.task.count({ where: whereClause }),
    prisma.task.count({ where: { ...whereClause, status: "COMPLETED" } }),
    prisma.task.count({ where: { ...whereClause, status: "IN_PROGRESS" } }),
    prisma.task.count({ 
      where: { 
        ...whereClause, 
        status: { not: "COMPLETED" },
        dueDate: { lt: new Date() }
      } 
    })
  ]);

  const recentTasks = await prisma.task.findMany({
    where: whereClause,
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { project: true, assignee: true },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className="animate-reveal">Quantum Dashboard</h1>
          <p className="animate-reveal" style={{ animationDelay: "0.1s" }}>
            Welcome back, {session?.user?.name.split(' ')[0]}. Systems are optimal.
          </p>
        </div>
        <div className={styles.actions}>
           <Link href="/dashboard/projects/new" className="glow-primary" style={{ 
             background: 'var(--primary)', 
             color: 'white', 
             padding: '0.8rem 1.8rem', 
             borderRadius: '16px',
             display: 'flex',
             alignItems: 'center',
             gap: '0.75rem'
           }}>
             <Plus size={20} />
             <span>Launch Project</span>
           </Link>
        </div>
      </header>

      <div className={styles.bentoGrid}>
        <div className={styles.statsBox}>
          <StatsCard 
            title="Active Tasks" 
            value={totalTasks} 
            icon={<Zap size={24} />} 
            color="#8b5cf6"
            trend="Live"
          />
        </div>
        
        <div className={styles.activityBox}>
           <div className={styles.bentoCard} style={{ height: '100%' }}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>Recent Operations</h3>
                <Link href="/dashboard/tasks" className="badge" style={{ color: 'var(--primary)' }}>
                   History <ArrowRight size={14} />
                </Link>
              </div>
              
              <div className={styles.recentTasks}>
                {recentTasks.map((task) => (
                  <div key={task.id} className={styles.taskItem}>
                    <div className={styles.statusIndicator} style={{ 
                      backgroundColor: task.status === 'COMPLETED' ? 'var(--completed)' : 'var(--primary)' 
                    }} />
                    <div className={styles.taskMain}>
                      <div className={styles.taskTitle}>{task.title}</div>
                      <div className={styles.taskMeta}>{task.project.name} • {task.assignee?.name || "AI Unassigned"}</div>
                    </div>
                    <div className="badge" style={{ background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem' }}>
                       {task.status.replace('_', ' ')}
                    </div>
                  </div>
                ))}
                
                {recentTasks.length === 0 && (
                  <div className={styles.emptyState}>
                    <Activity size={48} style={{ opacity: 0.1 }} />
                    <p>No active logs found in the cluster.</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        <div className={styles.statsBox}>
          <StatsCard 
            title="Sync Rate" 
            value={completedTasks} 
            icon={<Layers size={24} />} 
            color="#10b981"
            trend="89%"
          />
        </div>

        <div className={styles.chartBox}>
           <StatsCard 
            title="Anomalies" 
            value={overdueTasks} 
            icon={<ShieldAlert size={24} />} 
            color="#ef4444"
            trend="Crit"
          />
        </div>

        <div className={styles.statsBox}>
           <div className={styles.bentoCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
              <div style={{ textAlign: 'center' }}>
                <Layout size={32} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 700 }}>System v2.0</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
