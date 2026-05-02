import styles from "./StatsCard.module.css";

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.icon} style={{ backgroundColor: `${color}20`, color: color }}>
        {icon}
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
}
