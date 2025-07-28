'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import LeaderboardPodium from "@/components/LeaderboardPodium/LeaderboardPodium";
import VotingProgressBar from "@/components/VotingProgressBar/VotingProgressBar";
import RealTimeChart from "@/components/RealTimeChart/RealTimeChart";
import ChatWidget from "@/components/ChatWidget/ChatWidget";

// Mock data for all categories
const categories = [
  {
    id: 'best-display',
    name: 'Best Display',
    description: 'Teams with the most impressive visual presentations',
    teams: [
      { id: 1, name: 'Quantum Leap', votes: 245, trend: 'up' },
      { id: 2, name: 'Visioneers', votes: 187, trend: 'down' },
      { id: 3, name: 'Pixel Pioneers', votes: 132, trend: 'up' },
    ]
  },
  {
    id: 'best-presentation',
    name: 'Best Presentation',
    description: 'Teams with exceptional pitching and demonstration skills',
    teams: [
      { id: 4, name: 'Neural Nexus', votes: 312, trend: 'up' },
      { id: 5, name: 'Orator Group', votes: 256, trend: 'up' },
      { id: 6, name: 'Stage Masters', votes: 198, trend: 'down' },
    ]
  },
  {
    id: 'best-composure',
    name: 'Best Team Composure',
    description: 'Teams that show outstanding teamwork and professionalism',
    teams: [
      { id: 7, name: 'Team Synergy', votes: 287, trend: 'up' },
      { id: 8, name: 'Collaborative Minds', votes: 203, trend: 'down' },
      { id: 9, name: 'Unity Force', votes: 156, trend: 'up' },
    ]
  },
  {
    id: 'best-prototype',
    name: 'Best Prototype',
    description: 'Most functional and well-executed working prototypes',
    teams: [
      { id: 10, name: 'ProtoMasters', votes: 324, trend: 'up' },
      { id: 11, name: 'Build Innovators', votes: 278, trend: 'up' },
      { id: 12, name: 'Function First', votes: 201, trend: 'down' },
    ]
  },
  {
    id: 'best-innovation',
    name: 'Best Innovation Idea',
    description: 'Most groundbreaking and original tech concepts',
    teams: [
      { id: 13, name: 'Idea Pioneers', votes: 356, trend: 'up' },
      { id: 14, name: 'Concept Creators', votes: 289, trend: 'down' },
      { id: 15, name: 'Visionary Labs', votes: 234, trend: 'up' },
    ]
  }
];

// Simulate real-time updates
const simulateVoteUpdates = (teams) => {
  return teams.map(team => {
    const voteChange = Math.floor(Math.random() * 10);
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    
    return {
      ...team,
      votes: team.votes + (trend === 'up' ? voteChange : -voteChange),
      trend
    };
  });
};

export default function ResultsPage() {
  const [activeCategory, setActiveCategory] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds
  const [stats, setStats] = useState({
    totalVotes: 0,
    voters: 0,
    categories: categories.length
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Initial data load
    setTimeout(() => {
      setIsLoading(false);
      updateStats();
    }, 800);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      categories.forEach((category, index) => {
        categories[index].teams = simulateVoteUpdates(category.teams);
      });
      updateStats();
    }, 5000); // Update every 5 seconds

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const updateStats = () => {
    const totalVotes = categories.reduce((sum, category) => {
      return sum + category.teams.reduce((catSum, team) => catSum + team.votes, 0);
    }, 0);
    
    setStats({
      totalVotes,
      voters: Math.floor(totalVotes * 1.2),
      categories: categories.length
    });
  };

  const handleCategoryChange = (index) => {
    setActiveCategory(index);
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: index * 300, // Adjust based on your card width
        behavior: 'smooth'
      });
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading live results...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Live Voting Results</h1>
        <p>Real-time updates from TechFest Innovation Jam</p>
      </div>
      
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{stats.totalVotes}</div>
          <div className={styles.statLabel}>Total Votes</div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{stats.voters}</div>
          <div className={styles.statLabel}>Voters</div>
        </div>
        
        <div className={styles.statItem}>
          <div className={styles.statNumber}>{stats.categories}</div>
          <div className={styles.statLabel}>Categories</div>
        </div>
        
        {/* <div className={styles.timerCard}>
          <div className={styles.timerLabel}>Voting Ends In</div>
          <div className={styles.timerValue}>{formatTime(timeRemaining)}</div>
        </div> */}
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
        <h2>{categories[activeCategory].name}</h2>
        <p>{categories[activeCategory].description}</p>
      </div>
      
      <div className={styles.resultsContent}>
        <div className={styles.podiumSection}>
          <h3 className={styles.sectionTitle}>Top Performers</h3>
          <LeaderboardPodium teams={categories[activeCategory].teams.slice(0, 3)} />
        </div>
        
        <div className={styles.chartSection}>
          <h3 className={styles.sectionTitle}>Voting Distribution</h3>
          <RealTimeChart teams={categories[activeCategory].teams} />
        </div>
      </div>
      
      <div className={styles.fullLeaderboard}>
        <h3 className={styles.sectionTitle}>Full Leaderboard</h3>
        <div className={styles.leaderboardList}>
          {categories[activeCategory].teams.map((team, index) => (
            <div key={team.id} className={styles.leaderboardItem}>
              <div className={styles.rank}>#{index + 1}</div>
              <div className={styles.teamInfo}>
                <div className={styles.teamName}>{team.name}</div>
                <VotingProgressBar 
                  votes={team.votes} 
                  maxVotes={Math.max(...categories[activeCategory].teams.map(t => t.votes))} 
                  trend={team.trend}
                />
              </div>
              <div className={styles.voteCount}>
                {team.votes} votes
                <span className={`${styles.trend} ${styles[team.trend]}`}>
                  {team.trend === 'up' ? '▲' : '▼'}
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