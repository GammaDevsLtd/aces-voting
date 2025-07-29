"use client";
import { useState, useEffect } from "react";
import styles from "./CategoryCarousel.module.css";
import EmptyState from "@/components/EmptyState/EmptyState";

const CategoryCarousel = ({ categories, teams }) => {
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentCategory, setCurrentCategory] = useState(categories[0]);
  const [topTeams, setTopTeams] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const categoryTeams = teams
      .filter((t) => t.categoryId === currentCategory.id)
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 3);

    // Fill with empty states if less than 3 teams
    while (categoryTeams.length < 3) {
      categoryTeams.push({
        id: `empty-${categoryTeams.length}`,
        isEmpty: true,
      });
    }

    setTopTeams(categoryTeams);
  }, [currentCategory, teams]);

  useEffect(() => {
    if (isHovered) return; // Pause auto-rotation when hovered

    const timer = setInterval(() => {
      setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
      setCurrentCategory(
        categories[(currentCategoryIndex + 1) % categories.length]
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [currentCategoryIndex, categories, isHovered]);

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
            <div key={category.name}>
              <button
                className={`${styles.controlDot} ${
                  currentCategory.id === category.id ? styles.active : ""
                }`}
                onClick={() => {
                  setCurrentCategoryIndex(index);
                  setCurrentCategory(category);
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
                <div className={styles.votes}>{team.votes} votes</div>
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
            setCurrentCategory(categories[prevIndex]);
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
            setCurrentCategory(categories[nextIndex]);
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
