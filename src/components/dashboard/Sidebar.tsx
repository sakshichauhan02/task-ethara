"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";
import { signOut } from "next-auth/react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ user }: { user: any }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Team", href: "/dashboard/team", icon: Users },
  ];

  if (user.role === "ADMIN") {
    menuItems.push({ name: "Settings", href: "/dashboard/settings", icon: Settings });
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        Task <span>Manager</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <Link 
            key={item.name} 
            href={item.href}
            className={`${styles.navItem} ${pathname === item.href ? styles.active : ""}`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.user}>
          <div className={styles.userAvatar}>
            {user.name?.[0] || "U"}
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userRole}>{user.role}</p>
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={() => signOut()}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
