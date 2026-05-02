"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../projects.module.css";
import formStyles from "@/app/signup/signup.module.css";

export default function NewProjectPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        router.push("/dashboard/projects");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Create New Project</h1>
      </header>

      <div className={formStyles.card} style={{ textAlign: "left", maxWidth: "600px", margin: "0" }}>
        <form onSubmit={handleSubmit} className={formStyles.form}>
          <div className={formStyles.inputGroup}>
            <label>Project Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="e.g. Website Redesign" 
              required 
            />
          </div>
          <div className={formStyles.inputGroup}>
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="What is this project about?" 
              rows={4}
              style={{ 
                background: "rgba(255, 255, 255, 0.05)", 
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "10px",
                padding: "0.8rem",
                color: "#fff",
                fontFamily: "inherit"
              }}
            />
          </div>
          <button type="submit" disabled={loading} className={formStyles.btn}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
