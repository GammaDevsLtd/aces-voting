import styles from "./VotingSection.module.css";
import TeamCard from "./TeamCard";

const VotingSection = ({
  categories,
  teams,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <section className={styles.votingSection}>
      <div className={styles.sectionHeader}>
        <h2>Vote for Your Favorite Teams</h2>
        <p>
          Select a category and cast your vote to support innovative tech teams
        </p>
      </div>

      <div className={styles.categoryTabs}>
        {categories.map((category) => (
          <div key={category._id}>
            <button
              className={`${styles.tabButton} ${
                activeCategory === category.id ? styles.active : ""
              }`}
              onClick={() => onCategoryChange(category.id)}
            >
              <span className={styles.tabText}>{category.name}</span>
              {activeCategory === category.id && (
                <span className={styles.activeIndicator}></span>
              )}
            </button>
          </div>
        ))}
      </div>

      {teams.length > 0 ? (
        <div className={styles.teamGrid}>
          {teams.map((team) => (
            <TeamCard category={categories._id} key={team.id} team={team} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <div className={styles.iconBackground}></div>
            <span>👀</span>
          </div>
          <h3>No teams in this category yet</h3>
          <p>Check back later or explore other categories</p>
        </div>
      )}
    </section>
  );
};

export default VotingSection;
