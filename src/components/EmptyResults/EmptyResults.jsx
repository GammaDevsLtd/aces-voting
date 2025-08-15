import Link from "next/link";
import styles from "./EmptyResults.module.css";
import { Rocket, Vote } from "lucide-react";

const EmptyResults = () => {
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.emptyIllustration}>
        <div className={styles.rocket}>
          <Rocket size={80} />
        </div>
        <div className={styles.vote}>
          <Vote size={80} />
        </div>
      </div>
      
      <h1>No Results Yet!</h1>
      <p className={styles.emptyMessage}>
        Be the first to cast your vote and help your favorite team rise to the top.
      </p>
      
      <div className={styles.ctaContainer}>
        <Link href="/" className={styles.ctaButton}>
          Explore Teams
        </Link>
        <Link href="/categories" className={styles.ctaSecondary}>
          View Categories
        </Link>
      </div>
      
      <div className={styles.tip}>
        <p>Results will appear here once voting begins</p>
      </div>
    </div>
  );
};

export default EmptyResults;