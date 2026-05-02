"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import styles from "./project-details.module.css";
import TaskList from "@/components/dashboard/TaskList";
import { Users, Calendar, Plus, Mail } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function ProjectDetailsPage() {
  const { data: session } = useSession();
  const params = useParams();
  const id = params.id as string;

  const [project, setProject] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    };
    fetchProject();
  }, [id, refresh]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setEmail("");
        setRefresh(prev => prev + 1);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add member");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;

    try {
      const res = await fetch(`/api/projects/${id}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setRefresh(prev => prev + 1);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to remove member");
      }
    } catch (err) {
      alert("Something went wrong");
    }
  };

  if (!project) return <div className={styles.container}>Loading project...</div>;

  const isOwner = project.ownerId === session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";
  const hasAccess = isOwner || isAdmin || project.members.some((m: any) => m.userId === session?.user?.id);

  if (!hasAccess) return <div className={styles.container}>Access Denied</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.titleArea}>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <div className={styles.actions}>
          {(isOwner || isAdmin) && (
            <Link href={`/dashboard/projects/${id}/tasks/new`} className={styles.addTaskBtn}>
              <Plus size={20} />
              <span>Add Task</span>
            </Link>
          )}
        </div>
      </header>

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          <TaskList tasks={project.tasks} projectId={id} />
        </div>
        
        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Project Info</h3>
            <div className={styles.infoItem}>
              <Calendar size={18} />
              <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            <div className={styles.infoItem}>
              <Users size={18} />
              <span>Owner: {project.owner.name}</span>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Team</h3>
            </div>
            <div className={styles.teamList}>
              {project.members.map((member: any) => (
                <div key={member.id} className={styles.teamMember}>
                  <div className={styles.avatar}>{member.user.name?.[0]}</div>
                  <div className={styles.memberInfo}>
                    <span className={styles.memberName}>{member.user.name}</span>
                    <span className={styles.memberEmail}>{member.user.email}</span>
                  </div>
                  {(isOwner || isAdmin) && member.user.id !== project.ownerId && (
                    <button 
                      onClick={() => handleRemoveMember(member.user.id)}
                      className={styles.removeBtn}
                      title="Remove Member"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              {project.members.length === 0 && <p className={styles.empty}>No team members yet.</p>}
            </div>

            {(isOwner || isAdmin) && (
              <form onSubmit={handleAddMember} className={styles.addMemberForm}>
                <div className={styles.inputWithIcon}>
                  <Mail size={16} />
                  <input 
                    type="email" 
                    placeholder="User email..." 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className={styles.errorText}>{error}</p>}
                <button type="submit" disabled={loading} className={styles.smallBtn}>
                  {loading ? "Adding..." : "Invite"}
                </button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
