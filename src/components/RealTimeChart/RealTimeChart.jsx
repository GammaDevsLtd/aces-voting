"use client"
import { useState, useEffect } from "react";
import styles from "./RealTimeChart.module.css";

const RealTimeChart = ({ teams }) => {
  const [maxVotes, setMaxVotes] = useState(1);
  const [animatedHeights, setAnimatedHeights] = useState({});

  useEffect(() => {
    // Safely get vote counts, default to 0 if invalid
    const voteCounts = teams.map(team => {
      const votes = Number(team.votes);
      return isNaN(votes) ? 0 : votes;
    });
    
    // Ensure we have at least 1 valid vote count
    const newMaxVotes = Math.max(...voteCounts, 1);
    setMaxVotes(newMaxVotes);

    // Animation logic remains the same
    const newAnimatedHeights = {};
    const animationFrames = 30;
    const interval = 20;

    teams.forEach((team) => {
      const votes = Number(team.votes) || 0;
      const targetHeight = (votes / newMaxVotes) * 100;
      const currentHeight = animatedHeights[team.id] || 0;
      const heightDifference = targetHeight - currentHeight;
      const heightIncrement = heightDifference / animationFrames;

      let current = currentHeight;
      let frame = 0;

      const animate = () => {
        current += heightIncrement;
        frame++;

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
        {teams.map((team) => {
          const votes = Number(team.votes) || 0;
          
          return (
            <div key={team.id} className={styles.barGroup}>
              <div className={styles.barLabel}>
                <span className={styles.teamName}>{team.name}</span>
                <span className={styles.voteCount}>{votes} votes</span>
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
          );
        })}
      </div>

      <div className={styles.chartAxis}>
        {[0, 25, 50, 75, 100].map((percent) => (
          <div key={percent} className={styles.axisLabel}>
            {/* Safely calculate axis values */}
            {Math.round((percent / 100) * (isNaN(maxVotes) ? 1 : maxVotes))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RealTimeChart;