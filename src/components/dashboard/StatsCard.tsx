import styles from "./StatsCard.module.css";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
}

export default function StatsCard({ title, value, icon, color, trend }: StatsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon} style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <div className={styles.value}>
          {value}
          {trend && <span className={styles.trend}>{trend}</span>}
        </div>
      </div>
    </div>
  );
}
