import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TaskList from "@/components/dashboard/TaskList";
import styles from "../dashboard.module.css";

export default async function MyTasksPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: {
      assigneeId: session.user.id,
    },
    include: {
      project: true,
      assignee: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>My Tasks</h1>
        <p>All tasks assigned to you across all projects.</p>
      </header>

      <div className={styles.mainContent}>
        <TaskList tasks={tasks} projectId="" />
      </div>
    </div>
  );
}
