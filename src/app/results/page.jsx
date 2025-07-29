"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import LeaderboardPodium from "@/components/LeaderboardPodium/LeaderboardPodium";
import VotingProgressBar from "@/components/VotingProgressBar/VotingProgressBar";
import RealTimeChart from "@/components/RealTimeChart/RealTimeChart";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import * as LucideIcons from "lucide-react"; // Import all Lucide icons

export default function ResultsPage() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60);
  const [stats, setStats] = useState({
    totalVotes: 0,
    voters: 0,
    categories: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sliderRef = useRef(null);
  const [pulse, setPulse] = useState(false);

  const simulateVoteUpdates = (teams) => {
    return teams.map((team) => {
      const voteChange = Math.floor(Math.random() * 10);
      const trend = Math.random() > 0.5 ? "up" : "down";
      return {
        ...team,
        votes: team.votes + (trend === "up" ? voteChange : -voteChange),
        trend,
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/homeData");
        const data = await res.json();

            const structuredCategories = data.categories;


        setCategories(structuredCategories);
        setStats({
          totalVotes: structuredCategories.reduce(
            (sum, cat) =>
              sum + cat.teams.reduce((tSum, t) => tSum + t.votes, 0),
            0
          ),
          voters: Math.floor(
            structuredCategories.reduce(
              (sum, cat) =>
                sum + cat.teams.reduce((tSum, t) => tSum + t.votes, 0),
              0
            ) * 1.2
          ),
          categories: structuredCategories.length,
        });
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch homeData", err);
      }
    };

    fetchData();

    const interval = setInterval(() => {
      setCategories((prev) =>
        prev.map((cat) => ({
          ...cat,
          teams: simulateVoteUpdates(cat.teams),
        }))
      );
      setPulse(true);
      setTimeout(() => setPulse(false), 1000);
    }, 5000);

    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const handleCategoryChange = (index) => {
    setActiveCategory(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({ left: index * 300, behavior: "smooth" });
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

if (isLoading || !categories.length) {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}>
        <LucideIcons.Loader size={48} />
      </div>
      <p>Loading live results...</p>
    </div>
  );
}


  return (
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}></div>

      <div className={styles.header}>
        <h1>Live Voting Results</h1>
        <p>Real-time updates from TechFest Innovation Jam</p>
        <div className={styles.headerUnderline}></div>
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
              .sort((a, b) => b.votes - a.votes)
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
            .sort((a, b) => b.votes - a.votes)
            .map((team, index) => (
              <div key={team.id} className={styles.leaderboardItem}>
                <div className={styles.rank}>#{index + 1}</div>
                <div className={styles.teamInfo}>
                  <div className={styles.teamName}>{team.name}</div>
                  <VotingProgressBar
                    votes={team.votes}
                    maxVotes={Math.max(
                      ...categories[activeCategory].teams.map((t) => t.votes)
                    )}
                    trend={team.trend}
                  />
                </div>
                <div className={styles.voteCount}>
                  <div className={styles.voteNumber}>{team.votes}</div>
                  <div className={styles.voteLabel}>votes</div>
                  <span className={`${styles.trend} ${styles[team.trend]}`}>
                    {team.trend === "up" ? "▲" : "▼"}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
}
