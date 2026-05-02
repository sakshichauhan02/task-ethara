import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import styles from "../dashboard.module.css";
import formStyles from "@/app/signup/signup.module.css";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>System Settings</h1>
        <p>Manage application preferences and global configurations.</p>
      </header>

      <div className={formStyles.card} style={{ textAlign: "left", maxWidth: "600px", margin: "0" }}>
        <h3 style={{ color: "#fff", marginBottom: "1.5rem" }}>General Configuration</h3>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
          Settings are currently restricted to Administrators.
        </p>
        
        <div className={formStyles.form}>
           <div className={formStyles.inputGroup}>
            <label>App Name</label>
            <input type="text" defaultValue="Task Manager" readOnly />
          </div>
          <div className={formStyles.inputGroup}>
            <label>Default User Role</label>
            <select disabled>
              <option>MEMBER</option>
            </select>
          </div>
          <button className={formStyles.btn} disabled>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
