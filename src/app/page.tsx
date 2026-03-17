import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import "bootstrap/dist/css/bootstrap.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.ctas}>
          <br></br>
          <Link href="/forms/modems" className="btn btn-primary">
            Go to modems Page
          </Link>
        </div>
      </main>
      <footer className={styles.footer}>DO MORE WORK</footer>
    </div>
  );
}
