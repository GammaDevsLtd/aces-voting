import styles from "./LeaderboardPodium.module.css";
import { Trophy, Crown, Rocket } from "lucide-react";

const LeaderboardPodium = ({ teams }) => {
  // Ensure we have at least 3 positions
  const podiumTeams = [...teams];
  while (podiumTeams.length < 3) {
    podiumTeams.push({
      id: `empty-${podiumTeams.length}`,
      name: "No team",
      votes: 0,
      isEmpty: true,
    });
  }

  return (
    <div className={styles.podiumContainer}>
      {/* 2nd Place */}
      <div className={`${styles.podiumItem} ${styles.secondPlace}`}>
        <div className={styles.rank}>2</div>
        {podiumTeams[1].isEmpty ? (
          <div className={styles.emptyTeam}>
            <div className={styles.emptyIcon}>
              <Trophy size={32} />
            </div>
            <div>Position Open</div>
          </div>
        ) : (
          <>
            <div className={styles.teamName}>{podiumTeams[1].name}</div>
            <div className={styles.votes}>{podiumTeams[1].votes} votes</div>
          </>
        )}
      </div>

      {/* 1st Place */}
      <div className={`${styles.podiumItem} ${styles.firstPlace}`}>
        <div className={styles.rank}>1</div>
        {podiumTeams[0].isEmpty ? (
          <div className={styles.emptyTeam}>
            <div className={styles.emptyIcon}>
              <Crown size={32} />
            </div>
            <div>Your Vote Matters!</div>
          </div>
        ) : (
          <>
            <div className={styles.teamName}>{podiumTeams[0].name}</div>
            <div className={styles.votes}>{podiumTeams[0].votes} votes</div>
          </>
        )}
      </div>

      {/* 3rd Place */}
      <div className={`${styles.podiumItem} ${styles.thirdPlace}`}>
        <div className={styles.rank}>3</div>
        {podiumTeams[2].isEmpty ? (
          <div className={styles.emptyTeam}>
            <div className={styles.emptyIcon}>
              <Rocket size={32} />
            </div>
            <div>Cast Your Vote</div>
          </div>
        ) : (
          <>
            <div className={styles.teamName}>{podiumTeams[2].name}</div>
            <div className={styles.votes}>{podiumTeams[2].votes} votes</div>
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPodium;
