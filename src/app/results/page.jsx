"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import LeaderboardPodium from "@/components/LeaderboardPodium/LeaderboardPodium";
import VotingProgressBar from "@/components/VotingProgressBar/VotingProgressBar";
import RealTimeChart from "@/components/RealTimeChart/RealTimeChart";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import * as LucideIcons from "lucide-react";
import EmptyResults from "@/components/EmptyResults/EmptyResults"; // New component

export default function ResultsPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [stats, setStats] = useState({
    totalVotes: 0,
    voters: 0,
    categories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showEmptyState, setShowEmptyState] = useState(false);
  const sliderRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/homeData");
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch results");
      }

      const structuredCategories = data.categories;
      const totalVotes = structuredCategories.reduce(
        (sum, cat) => sum + cat.teams.reduce((tSum, t) => tSum + t.voteCount, 0),
        0
      );

      // Check if there are any votes
      const hasVotes = totalVotes > 0;
      setShowEmptyState(!hasVotes);

      setCategories(structuredCategories);
      setStats({
        totalVotes,
        voters: Math.floor(totalVotes * 1.2), // Estimate unique voters
        categories: structuredCategories.length,
      });
      setLastUpdated(new Date());
      setIsLoading(false);
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    } catch (err) {
      console.error("Failed to fetch results", err);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch
    
    // Refresh data every 2 minutes
    const refreshInterval = setInterval(fetchData, 120000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const handleCategoryChange = (index) => {
    setActiveCategory(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: index * 300, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <LucideIcons.Loader size={48} />
        </div>
        <p>Loading live results...</p>
      </div>
    );
  }

  if (showEmptyState) {
    return <EmptyResults />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}></div>

      <div className={styles.header}>
        <h1>Live Voting Results</h1>
        <p>Real-time updates from TechFest Innovation Jam</p>
        <div className={styles.headerUnderline}></div>
        
        {lastUpdated && (
          <div className={styles.lastUpdated}>
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      <div
        className={`${styles.statsBar} ${pulse ? styles.pulseAnimation : ""}`}
      >
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <LucideIcons.BarChart2 size={32} />
          </div>
          <div className={styles.statNumber}>{stats.totalVotes}</div>
          <div className={styles.statLabel}>Total Votes</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <LucideIcons.Users size={32} />
          </div>
          <div className={styles.statNumber}>{stats.voters}</div>
          <div className={styles.statLabel}>Voters</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statIcon}>
            <LucideIcons.Trophy size={32} />
          </div>
          <div className={styles.statNumber}>{stats.categories}</div>
          <div className={styles.statLabel}>Categories</div>
        </div>
      </div>

      <div className={styles.categorySelector}>
        <CategorySlider
          categories={categories}
          activeIndex={activeCategory}
          onSelect={handleCategoryChange}
          sliderRef={sliderRef}
        />
      </div>

      {categories[activeCategory] && (
        <>
          <div className={styles.categoryHeader}>
            <div className={styles.categoryTitle}>
              <h2>{categories[activeCategory].name}</h2>
              <div className={styles.categoryBadge}>Active</div>
            </div>
            <p>{categories[activeCategory].description}</p>
          </div>

          <div className={styles.resultsContent}>
            <div className={styles.podiumSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Top Performers</h3>
                <div className={styles.sectionDecor}></div>
              </div>
              <LeaderboardPodium
                teams={[...categories[activeCategory].teams]
                  .sort((a, b) => b.averageScore - a.averageScore)
                  .slice(0, 3)}
              />
            </div>

            <div className={styles.chartSection}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Voting Distribution</h3>
                <div className={styles.sectionDecor}></div>
              </div>
              <RealTimeChart teams={categories[activeCategory].teams} />
            </div>
          </div>

          <div className={styles.fullLeaderboard}>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Full Leaderboard</h3>
              <div className={styles.sectionDecor}></div>
            </div>
            <div className={styles.leaderboardList}>
              {[...categories[activeCategory].teams]
                .sort((a, b) => b.averageScore - a.averageScore)
                .map((team, index) => (
                  <div key={team.id} className={styles.leaderboardItem}>
                    <div className={styles.rank}>#{index + 1}</div>
                    <div className={styles.teamInfo}>
                      <div className={styles.teamName}>{team.name}</div>
                      <VotingProgressBar
                        votes={team.voteCount}
                        maxVotes={Math.max(
                          ...categories[activeCategory].teams.map(t => t.voteCount)
                        )}
                      />
                    </div>
                    <div className={styles.voteDetails}>
                      <div className={styles.voteCount}>
                        <div className={styles.voteNumber}>{team.voteCount}</div>
                        <div className={styles.voteLabel}>votes</div>
                      </div>
                      <div className={styles.scoreBadge}>
                        {team.averageScore.toFixed(1)}/10
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
}