import Navbar from "@/components/layout/Navbar";
import styles from "./page.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <main className={styles.main}>
      <Navbar />
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Manage Projects with <span>Intelligence</span>
          </h1>
          <p className={styles.subtitle}>
            The ultimate project management tool for modern teams. Create, track, and collaborate on tasks with ease.
          </p>
          <div className={styles.cta}>
            <Link href="/signup" className={styles.primaryBtn}>Get Started for Free</Link>
            <Link href="/about" className={styles.secondaryBtn}>Learn More</Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <div className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
              <div className={styles.dot}></div>
            </div>
            <div className={styles.cardBody}>
               <div className={styles.skeletonLine}></div>
               <div className={styles.skeletonLineShort}></div>
               <div className={styles.skeletonBox}></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
