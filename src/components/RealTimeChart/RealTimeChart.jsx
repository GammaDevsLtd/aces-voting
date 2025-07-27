import { useState, useEffect } from "react";
import styles from "./RealTimeChart.module.css";

const RealTimeChart = ({ teams }) => {
  const [maxVotes, setMaxVotes] = useState(0);
  const [animatedHeights, setAnimatedHeights] = useState({});

  useEffect(() => {
    // Calculate max votes for scaling
    const newMax = Math.max(...teams.map((t) => t.votes), 1);
    setMaxVotes(newMax);

    // Animate bar heights
    const newHeights = {};
    teams.forEach((team) => {
      const targetHeight = (team.votes / newMax) * 100;
      newHeights[team.id] = targetHeight;
    });
    setAnimatedHeights(newHeights);
  }, [teams]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartBars}>
        {teams.map((team) => (
          <div key={team.id} className={styles.barGroup}>
            <div className={styles.barLabel}>
              <span className={styles.teamName}>{team.name}</span>
              <span className={styles.voteCount}>{team.votes} votes</span>
            </div>

            <div className={styles.barContainer}>
              <div
                className={`${styles.bar} ${styles[team.trend]}`}
                style={{ height: `${animatedHeights[team.id] || 0}%` }}
              >
                <div className={styles.barFill}></div>
                <div className={styles.trendIndicator}>
                  {team.trend === "up" ? "▲" : "▼"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartAxis}>
        {[0, 25, 50, 75, 100].map((percent) => (
          <div key={percent} className={styles.axisLabel}>
            {Math.round((percent / 100) * maxVotes)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeChart;
