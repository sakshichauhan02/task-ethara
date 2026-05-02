import Navbar from "@/components/layout/Navbar";
import styles from "./page.module.css";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Rocket, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={`${styles.orb} ${styles.orb1}`}></div>
      <div className={`${styles.orb} ${styles.orb2}`}></div>
      
      <Navbar />
      
      <section className={styles.hero}>
        <div className={styles.badge}>
          <Sparkles size={16} />
          <span>New: AI-Powered Task Prioritization</span>
        </div>
        
        <div className={styles.heroContent}>
          <h1 className={`${styles.title} animate-reveal`}>
            Orchestrate Projects with <span>Quantum Precision</span>
          </h1>
          <p className={`${styles.subtitle} animate-reveal`} style={{ animationDelay: "0.1s" }}>
            Experience the next generation of project management. Built for speed, 
            designed for clarity, and powered by intelligent automation.
          </p>
          
          <div className={`${styles.cta} animate-reveal`} style={{ animationDelay: "0.2s" }}>
            <Link href="/signup" className={styles.primaryBtn}>
              Start Building <ArrowRight size={20} />
            </Link>
            <Link href="/login" className={styles.secondaryBtn}>
              Sign In
            </Link>
          </div>
        </div>

        <div className={`${styles.visualContainer} animate-reveal`} style={{ animationDelay: "0.3s" }}>
          <div className={styles.dashboardPreview}>
            <div className={styles.previewHeader}>
              <div className={styles.dot} style={{ background: "#ff5f56" }}></div>
              <div className={styles.dot} style={{ background: "#ffbd2e" }}></div>
              <div className={styles.dot} style={{ background: "#27c93f" }}></div>
              <div style={{ marginLeft: "auto", fontSize: "0.75rem", opacity: 0.5 }}>ethara-ai.sys</div>
            </div>
            
            <div className={styles.previewGrid}>
              <div className={styles.skeleton}>
                <Zap size={20} color="var(--primary)" style={{ marginBottom: "1rem" }} />
                <div className={styles.line} style={{ width: "70%" }}></div>
                <div className={styles.line} style={{ width: "40%" }}></div>
              </div>
              <div className={styles.skeleton}>
                <Rocket size={20} color="var(--secondary)" style={{ marginBottom: "1rem" }} />
                <div className={styles.line} style={{ width: "60%" }}></div>
                <div className={styles.line} style={{ width: "80%" }}></div>
              </div>
              <div className={styles.skeleton}>
                <Shield size={20} color="#10b981" style={{ marginBottom: "1rem" }} />
                <div className={styles.line} style={{ width: "50%" }}></div>
                <div className={styles.line} style={{ width: "30%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
