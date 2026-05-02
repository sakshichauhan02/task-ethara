import Link from "next/link";
import styles from "./Navbar.module.css";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Task <span>Manager</span>
        </Link>
        <div className={styles.links}>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/signup" className={styles.signupBtn}>Get Started</Link>
        </div>
      </div>
    </nav>
  );
}
