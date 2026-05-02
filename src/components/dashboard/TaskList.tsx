"use client";

import { useState, useEffect } from "react";
import styles from "./TaskList.module.css";
import { MoreVertical, CheckCircle2, Circle, Clock } from "lucide-react";

export default function TaskList({ tasks, projectId }: { tasks: any[], projectId: string }) {
  const [filter, setFilter] = useState("ALL");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredTasks = tasks.filter(task => {
    if (filter === "ALL") return true;
    return task.status === filter;
  });

  const handleStatusChange = async (taskId: string, currentStatus: string) => {
    const statusOrder = ["TODO", "IN_PROGRESS", "COMPLETED"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.ok) {
        window.location.reload(); // Simple way to refresh for now
      }
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <button 
          className={filter === "ALL" ? styles.activeFilter : ""} 
          onClick={() => setFilter("ALL")}
        >
          All Tasks
        </button>
        <button 
          className={filter === "TODO" ? styles.activeFilter : ""} 
          onClick={() => setFilter("TODO")}
        >
          Todo
        </button>
        <button 
          className={filter === "IN_PROGRESS" ? styles.activeFilter : ""} 
          onClick={() => setFilter("IN_PROGRESS")}
        >
          In Progress
        </button>
        <button 
          className={filter === "COMPLETED" ? styles.activeFilter : ""} 
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </button>
      </div>

      <div className={styles.list}>
        {filteredTasks.map((task) => (
          <div key={task.id} className={styles.taskItem}>
            <div 
              className={styles.taskStatus} 
              onClick={() => handleStatusChange(task.id, task.status)}
              style={{ cursor: "pointer" }}
              title="Change Status"
            >
              {task.status === "COMPLETED" ? (
                <CheckCircle2 className={styles.doneIcon} size={20} />
              ) : task.status === "IN_PROGRESS" ? (
                <Clock className={styles.progressIcon} size={20} />
              ) : (
                <Circle className={styles.todoIcon} size={20} />
              )}
            </div>
            <div className={styles.taskContent}>
              <h4>{task.title}</h4>
              <div className={styles.taskMeta}>
                <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                  {task.priority}
                </span>
                <span className={styles.assignee}>
                  {task.assignee?.name || "Unassigned"}
                </span>
                {mounted && task.dueDate && (
                  <span className={styles.dueDate}>
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <button className={styles.menuBtn}>
              <MoreVertical size={18} />
            </button>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className={styles.empty}>
            No tasks found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
