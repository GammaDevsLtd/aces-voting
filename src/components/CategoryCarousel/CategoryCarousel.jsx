"use client";
import { useState, useEffect } from "react";
import styles from "./CategoryCarousel.module.css";
import EmptyState from "@/components/EmptyState/EmptyState";

const CategoryCarousel = ({ categories, onCategorySelect }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(categories[0] || {});
  const [topTeams, setTopTeams] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  // Update current category when index changes
  useEffect(() => {
    if (categories.length > 0) {
      setCurrentCategory(categories[currentCategoryIndex]);
    }
  }, [currentCategoryIndex, categories]);

  // Update top teams when category changes
  useEffect(() => {
    if (currentCategory && currentCategory.teams) {
      // Sort teams by averageScore and take top 3
      const sortedTeams = [...currentCategory.teams]
        .sort((a, b) => b.averageScore - a.averageScore)
        .slice(0, 3);
      
      // Fill with empty states if less than 3 teams
      const filledTeams = [...sortedTeams];
      while (filledTeams.length < 3) {
        filledTeams.push({
          id: `empty-${filledTeams.length}`,
          isEmpty: true,
        });
      }

      setTopTeams(filledTeams);
    }
  }, [currentCategory]);

  // Auto-rotation effect
  useEffect(() => {
    if (isHovered || !categories.length) return;

    const timer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentCategoryIndex, categories, isHovered]);

  if (!categories.length) return null;

  return (
    <section
      className={styles.carousel}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <div className={styles.carouselHeader}>
        <h2>
          Top Teams in{" "}
          <span className={styles.categoryName}>{currentCategory.name}</span>
        </h2>
        <div className={styles.controls}>
          {categories.map((category, index) => (
            <div key={category.id}>
              <button
                className={`${styles.controlDot} ${
                  currentCategory.id === category.id ? styles.active : ""
                }`}
                onClick={() => {
                  setCurrentCategoryIndex(index);
                  onCategorySelect && onCategorySelect(category.id);
                }}
                aria-label={`Show ${category.name}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={styles.podium}>
        {topTeams.map((team, index) => (
          <div
            key={team.id}
            className={`${styles.podiumItem} ${styles[`podium${index + 1}`]}`}
          >
            <div className={styles.rank}>{index + 1}</div>
            {team.isEmpty ? (
              <EmptyState />
            ) : (
              <>
                <div className={styles.votes}>
                  {team.averageScore.toFixed(1)} avg
                </div>
                <div className={styles.teamName}>{team.name}</div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className={styles.mobileControls}>
        <button
          className={styles.mobileArrow}
          onClick={() => {
            const prevIndex =
              (currentCategoryIndex - 1 + categories.length) %
              categories.length;
            setCurrentCategoryIndex(prevIndex);
            onCategorySelect && onCategorySelect(categories[prevIndex].id);
          }}
          aria-label="Previous category"
        >
          &lt;
        </button>
        <div className={styles.categoryIndicator}>
          {currentCategoryIndex + 1} / {categories.length}
        </div>
        <button
          className={styles.mobileArrow}
          onClick={() => {
            const nextIndex = (currentCategoryIndex + 1) % categories.length;
            setCurrentCategoryIndex(nextIndex);
            onCategorySelect && onCategorySelect(categories[nextIndex].id);
          }}
          aria-label="Next category"
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default CategoryCarousel;