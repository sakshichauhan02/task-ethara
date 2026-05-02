"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../../projects.module.css";
import formStyles from "@/app/signup/signup.module.css";

export default function NewTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  useEffect(() => {
    // Fetch project members for assignment
    const fetchMembers = async () => {
      const res = await fetch(`/api/users`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    };
    fetchMembers();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${projectId}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title, 
          description, 
          priority, 
          assigneeId: assigneeId || null,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null
        }),
      });

      if (res.ok) {
        router.push(`/dashboard/projects/${projectId}`);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create task");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Create New Task</h1>
      </header>

      <div className={formStyles.card} style={{ textAlign: "left", maxWidth: "600px", margin: "0" }}>
        <form onSubmit={handleSubmit} className={formStyles.form}>
          <div className={formStyles.inputGroup}>
            <label>Task Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Design Landing Page" 
              required 
            />
          </div>
          <div className={formStyles.inputGroup}>
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Details about the task..." 
              rows={3}
              style={{ 
                background: "#f8fafc", 
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "0.8rem",
                color: "var(--foreground)",
                fontFamily: "inherit"
              }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className={formStyles.inputGroup}>
              <label>Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                style={{ 
                  background: "#f8fafc", 
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  padding: "0.8rem",
                  color: "var(--foreground)"
                }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className={formStyles.inputGroup}>
              <label>Due Date</label>
              <input 
                type="date" 
                value={dueDate} 
                onChange={(e) => setDueDate(e.target.value)} 
                style={{ colorScheme: "light" }}
              />
            </div>
          </div>
          <div className={formStyles.inputGroup}>
            <label>Assignee</label>
            <select 
              value={assigneeId} 
              onChange={(e) => setAssigneeId(e.target.value)}
              style={{ 
                background: "#f8fafc", 
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "0.8rem",
                color: "var(--foreground)"
              }}
            >
              <option value="">Unassigned</option>
              {members.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading} className={formStyles.btn}>
            {loading ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}
