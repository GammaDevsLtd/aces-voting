"use client";
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import CategoryCarousel from "@/components/CategoryCarousel/CategoryCarousel";
import VotingSection from "@/components/VotingSection/VotingSection";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import LoadingScreen from "./loading";
import Link from "next/link"

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [stats, setStats] = useState({
    teamCount: 0,
    categoryCount: 0,
    voteCount: 0,
    totalScores: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const res = await fetch("/api/homeData");
        const data = await res.json();

        if (res.ok) {
          setCategories(data.categories);
          setTeams(data.teams);
          setStats(data.stats);
          
          // Set active category to first category ID
          if (data.categories.length > 0) {
            setActiveCategory(data.categories[0].id);
          }
        } else {
          console.error("Failed to fetch home data:", data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Find teams for the active category
  const getTeamsForActiveCategory = () => {
    if (!activeCategory) return [];
    
    const category = categories.find(cat => cat.id === activeCategory);
    return category ? category.teams : [];
  };

  if (loading) return <LoadingScreen />;


  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1>Tech Innovation Jam</h1>
              <p>
                Your vote powers the future. Cast your ballot for the most
                groundbreaking tech teams!
              </p>
              <Link href="/categories" className={styles.ctaButton}>Vote Now</Link>
            </div>
            <div className={styles.sponsorSection}>
              <p>This website was brought to you by</p>
              <div className={styles.sponsorLogo}>
                <div className={styles.logo}></div>
                Gammadevs
              </div>
            </div>
          </div>
        </section>

        <div className={styles.body}>
          <section className={styles.statsSection}>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.teamCount}</span>
              <span className={styles.statLabel}>Teams</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>{stats.categoryCount}</span>
              <span className={styles.statLabel}>Categories</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>
                {stats.voteCount.toLocaleString()}
              </span>
              <span className={styles.statLabel}>Votes Cast</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNumber}>
                {stats.totalScores.toLocaleString()}
              </span>
              <span className={styles.statLabel}>Total Points</span>
            </div>
          </section>

          <CategoryCarousel 
            categories={categories} 
            onCategorySelect={setActiveCategory}
          />

          <VotingSection
            categories={categories}
            teams={getTeamsForActiveCategory()}
            onCategoryChange={setActiveCategory}
            activeCategory={activeCategory}
          />
        </div>
      </main>

      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      <footer className={styles.footer}>
        <p>© 2023 Tech Innovation Jam. All rights reserved.</p>
      </footer>
    </div>
  );
}