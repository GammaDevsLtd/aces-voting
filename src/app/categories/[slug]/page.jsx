"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TeamCard from "@/components/VotingSection/TeamCard";
import VotingModal from "@/components/VotingModal/VotingModal";
import styles from "./page.module.css";
import Link from "next/link";
import { Loader2, AlertTriangle } from "lucide-react";

export default function SingleCategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryTeams = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/categories/${slug}/teams`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch data: ${res.status}`);
        }

        const data = await res.json();
        setCategory(data.category);
        setTeams(data.teams);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchCategoryTeams();
  }, [slug]);

  const handleVoteClick = (team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };


  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.backLinkSkeleton}></div>
          <div className={styles.titleSkeleton}></div>
          <div className={styles.descriptionSkeleton}></div>
        </div>

        <div className={styles.statsBar}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statNumberSkeleton}></span>
              <span className={styles.statLabelSkeleton}></span>
            </div>
          ))}
        </div>

        <div className={styles.teamGrid}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={styles.teamCardSkeleton}>
              <div className={styles.teamImageSkeleton}></div>
              <div className={styles.teamNameSkeleton}></div>
              <div className={styles.teamDescriptionSkeleton}></div>
              <div className={styles.voteButtonSkeleton}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Link href="/categories" className={styles.backLink}>
            &larr; All Categories
          </Link>
          <h1>Error Loading Category</h1>
        </div>

        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <AlertTriangle size={48} />
          </div>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Calculate total votes
  const totalVotes = teams.reduce((sum, team) => sum + team.votes, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/categories" className={styles.backLink}>
          &larr; All Categories
        </Link>
        <h1>{category?.name}</h1>
        <p>{category?.description}</p>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{teams.length}</span>
          <span className={styles.statLabel}>Teams</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>{totalVotes}</span>
          <span className={styles.statLabel}>Total Votes</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNumber}>24</span>
          <span className={styles.statLabel}>Hours Left</span>
        </div>
      </div>

      <div className={styles.teamGrid}>
        {teams.map((team) => (
          <TeamCard
            key={team._id}
            category={category._id}
            team={team}
            onVoteClick={() => handleVoteClick(team)}
          />
        ))}
      </div>


    </div>
  );
}