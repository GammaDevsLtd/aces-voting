// components/EmptyState.jsx
import styles from "./EmptyState.module.css";

const EmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <div className={styles.emptyAnimation}>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
        <div className={styles.circle}></div>
      </div>
      <div className={styles.emptyText}>Cast your vote!</div>
      <div className={styles.emptySubtext}>You decide the winner</div>
    </div>
  );
};

export default EmptyState;
