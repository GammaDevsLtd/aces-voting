import { Loader2 } from "lucide-react";
import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.loaderContent}>
        <Loader2 size={48} className={styles.spinner} />
        <p className={styles.loadingText}>Loading homepage...</p>
      </div>
    </div>
  );
}
