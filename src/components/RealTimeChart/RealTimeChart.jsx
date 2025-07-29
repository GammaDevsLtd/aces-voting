import { useState, useEffect } from "react";
import styles from "./RealTimeChart.module.css";

const RealTimeChart = ({ teams }) => {
  const [maxVotes, setMaxVotes] = useState(1);
  const [animatedHeights, setAnimatedHeights] = useState({});

  useEffect(() => {
    const newMaxVotes = Math.max(...teams.map((t) => t.votes), 1);
    setMaxVotes(newMaxVotes);

    const newAnimatedHeights = {};
    const animationFrames = 30;
    const interval = 20; // ms per frame

    teams.forEach((team) => {
      const targetHeight = (team.votes / newMaxVotes) * 100;
      const currentHeight = animatedHeights[team.id] || 0;
      const heightDifference = targetHeight - currentHeight;
      const heightIncrement = heightDifference / animationFrames;

      let current = currentHeight;
      let frame = 0;

      const animate = () => {
        current += heightIncrement;
        frame++;

        // Ensure final value is accurate
        if (
          (heightDifference > 0 && current >= targetHeight) ||
          (heightDifference < 0 && current <= targetHeight) ||
          frame >= animationFrames
        ) {
          current = targetHeight;
        }

        setAnimatedHeights((prev) => ({
          ...prev,
          [team.id]: current,
        }));

        if (frame < animationFrames) {
          setTimeout(animate, interval);
        }
      };

      animate();
    });
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
