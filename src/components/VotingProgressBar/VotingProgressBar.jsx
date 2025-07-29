"use client"
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import styles from "./VotingProgressBar.module.css";

const VotingProgressBar = ({ votes, maxVotes, trend }) => {
  const [displayVotes, setDisplayVotes] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset on every new vote update
    setDisplayVotes(0);
    setProgress(0);

    const increment = Math.ceil(votes / 30);
    let currentVotes = 0;

    const voteTimer = setInterval(() => {
      currentVotes += increment;
      if (currentVotes >= votes) {
        currentVotes = votes;
        clearInterval(voteTimer);
      }
      setDisplayVotes(currentVotes);
    }, 30);

    const targetProgress = maxVotes > 0 ? (votes / maxVotes) * 100 : 0;
    const progressIncrement = targetProgress / 20;
    let currentProgress = 0;

    const progressTimer = setInterval(() => {
      currentProgress += progressIncrement;
      if (currentProgress >= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(progressTimer);
      }
      setProgress(currentProgress);
    }, 30);

    return () => {
      clearInterval(voteTimer);
      clearInterval(progressTimer);
    };
  }, [votes, maxVotes]); // Do not include displayVotes or progress

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressInfo}>
        <div className={styles.voteCount}>
          {displayVotes.toLocaleString()} votes
        </div>
        <div className={`${styles.trendIndicator} ${styles[trend]}`}>
          {trend === "up" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
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
