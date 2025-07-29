"use client";
import { useEffect, useState } from "react";
import styles from "./home.module.css";
import CategoryCarousel from "@/components/CategoryCarousel/CategoryCarousel";
import VotingSection from "@/components/VotingSection/VotingSection";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import Link from "next/link"

// Mock data for categories and teams
// const categories = [
//   { id: 1, name: "Best Display", tag: "display" },
//   { id: 2, name: "Best Presentation", tag: "presentation" },
//   { id: 3, name: "Best Team Composure", tag: "composure" },
//   { id: 4, name: "Best Prototype", tag: "prototype" },
//   { id: 5, name: "Best Innovation Idea", tag: "innovation" },
// ];

// const teams = [
//   {
//     id: 1,
//     name: "Quantum Leap",
//     categoryId: 1,
//     votes: 125,
//     image: "/team1.jpg",
//     description: "Revolutionizing display technology with quantum dots",
//   },
//   {
//     id: 2,
//     name: "Neural Nexus",
//     categoryId: 2,
//     votes: 98,
//     image: "/team2.jpg",
//     description: "AI-powered presentation tools for next-gen communication",
//   },
//   {
//     id: 3,
//     name: "Bio Synth",
//     categoryId: 3,
//     votes: 142,
//     image: "/team3.jpg",
//     description: "Biodegradable materials for sustainable tech",
//   },
//   {
//     id: 4,
//     name: "Cyber Pulse",
//     categoryId: 4,
//     votes: 89,
//     image: "/team4.jpg",
//     description: "Advanced cybersecurity solutions for IoT devices",
//   },
//   {
//     id: 5,
//     name: "Nano Vision",
//     categoryId: 5,
//     votes: 156,
//     image: "/team5.jpg",
//     description: "Microscopic imaging technology for medical diagnostics",
//   },
// ];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [stats, setStats] = useState({
    teamCount: 0,
    categoryCount: 0,
    voteCount: 0,
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
          setActiveCategory(data.categories[0]?._id);
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

  const filteredTeams = teams.filter((team) =>
    team.categories.includes(activeCategory)
  );

  if (loading) return <p>Loading homepage...</p>;


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
              <Link href="/" className={styles.ctaButton}>Vote Now</button>
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
          </section>

          <CategoryCarousel categories={categories} teams={teams} />

          <VotingSection
            categories={categories}
            teams={filteredTeams}
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
  