import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import styles from "./projects.module.css";
import { Plus } from "lucide-react";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: session?.user?.id },
        { members: { some: { userId: session?.user?.id } } }
      ]
    },
    include: {
      _count: {
        select: { tasks: true, members: true }
      }
    }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Projects</h1>
          <p>Manage and track all your team's projects.</p>
        </div>
        {session?.user?.role === "ADMIN" && (
          <Link href="/dashboard/projects/new" className={styles.createBtn}>
            <Plus size={20} />
            <span>New Project</span>
          </Link>
        )}
      </header>

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <Link key={project.id} href={`/dashboard/projects/${project.id}`} className={styles.projectCard}>
            <div className={styles.projectInfo}>
              <h3>{project.name}</h3>
              <p>{project.description || "No description provided."}</p>
            </div>
            <div className={styles.projectMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Tasks</span>
                <span className={styles.metaValue}>{project._count.tasks}</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Team</span>
                <span className={styles.metaValue}>{project._count.members}</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className={styles.emptyState}>
            <p>No projects found. Create your first project to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
