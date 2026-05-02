"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import styles from "../dashboard.module.css";
import teamStyles from "./team.module.css";
import { Trash2, ShieldCheck, User } from "lucide-react";

export default function TeamPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [refresh]);

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "MEMBER" : "ADMIN";
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) setRefresh(prev => prev + 1);
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) setRefresh(prev => prev + 1);
      else {
        const data = await res.json();
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  if (loading) return <div className={styles.container}>Loading team...</div>;

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Team Management</h1>
        <p>View and manage team members and their roles.</p>
      </header>

      {isAdmin && (
        <section className={teamStyles.addMemberSection}>
          <div className={teamStyles.card}>
            <h3>Add Team Member</h3>
            <form className={teamStyles.addForm} onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const name = formData.get("name") as string;
              const email = formData.get("email") as string;
              const role = formData.get("role") as string;
              
              try {
                const res = await fetch("/api/users", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ name, email, role }),
                });
                if (res.ok) {
                  setRefresh(prev => prev + 1);
                  (e.target as HTMLFormElement).reset();
                } else {
                  const data = await res.json();
                  alert(data.error);
                }
              } catch (err) {
                alert("Failed to add member");
              }
            }}>
              <input name="name" placeholder="Full Name" required />
              <input name="email" type="email" placeholder="Email Address" required />
              <select name="role">
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
              <button type="submit" className={teamStyles.addBtn}>Add Member</button>
            </form>
          </div>
        </section>
      )}

      <div className={teamStyles.userList}>
        <div className={teamStyles.listHeader}>
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Joined</span>
          {isAdmin && <span>Actions</span>}
        </div>
        {users.map((user) => (
          <div key={user.id} className={teamStyles.userRow}>
            <div className={teamStyles.userInfo}>
              <div className={teamStyles.avatar}>{user.name?.[0]}</div>
              <span>{user.name} {user.id === session?.user?.id && "(You)"}</span>
            </div>
            <span>{user.email}</span>
            <span className={`${teamStyles.roleBadge} ${teamStyles[user.role.toLowerCase()]}`}>
              {user.role}
            </span>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            {isAdmin && user.id !== session?.user?.id && (
              <div className={teamStyles.actions}>
                <button 
                  className={teamStyles.iconBtn} 
                  onClick={() => handleToggleRole(user.id, user.role)}
                  title="Toggle Admin Role"
                >
                  {user.role === "ADMIN" ? <User size={16} /> : <ShieldCheck size={16} />}
                </button>
                <button 
                  className={`${teamStyles.iconBtn} ${teamStyles.deleteBtn}`}
                  onClick={() => handleDeleteUser(user.id)}
                  title="Delete User"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
