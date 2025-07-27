import { useEffect, useState } from "react";
import styles from "./VotingProgressBar.module.css";

const VotingProgressBar = ({ votes, maxVotes, trend }) => {
  const [displayVotes, setDisplayVotes] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate vote count
    const targetVotes = votes;
    const increment = Math.ceil(targetVotes / 30);

    let currentVotes = displayVotes;
    const voteTimer = setInterval(() => {
      currentVotes += increment;
      if (currentVotes >= targetVotes) {
        currentVotes = targetVotes;
        clearInterval(voteTimer);
      }
      setDisplayVotes(currentVotes);
    }, 50);

    // Animate progress bar
    const targetProgress = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
    const progressIncrement = targetProgress / 20;

    let currentProgress = progress;
    const progressTimer = setInterval(() => {
      currentProgress += progressIncrement;
      if (currentProgress >= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(progressTimer);
      }
      setProgress(currentProgress);
    }, 50);

    return () => {
      clearInterval(voteTimer);
      clearInterval(progressTimer);
    };
  }, [votes, maxVotes]);

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInfo}>
        <div className={styles.voteCount}>
          {displayVotes.toLocaleString()} votes
        </div>
        <div className={`${styles.trendIndicator} ${styles[trend]}`}>
          {trend === "up" ? "▲" : "▼"}
        </div>
      </div>

      <div
        className={`${styles.progressBar} ${styles[trend]}`}
        style={{ width: `${progress}%` }}
      >
        <div className={styles.progressFill}></div>
      </div>
    </div>
  );
};

export default VotingProgressBar;
