import { useRef, useEffect } from "react";
import styles from "./CategorySlider.module.css";

const CategorySlider = ({ categories, activeIndex, onSelect, sliderRef }) => {
  const itemRefs = useRef([]);

  useEffect(() => {
    // Scroll active item into view
    if (itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeIndex]);

  return (
    <div className={styles.sliderContainer} ref={sliderRef}>
      <div className={styles.sliderTrack}>
        {categories.map((category, index) => (
          <div
            key={category.id}
            ref={(el) => (itemRefs.current[index] = el)}
            className={`${styles.sliderItem} ${
              index === activeIndex ? styles.active : ""
            }`}
            onClick={() => onSelect(index)}
          >
            <div className={styles.categoryIcon}>
              {getCategoryIcon(category.name)}
            </div>
            <div className={styles.categoryName}>{category.name}</div>
            <div className={styles.topTeam}>
              {category.teams[0]?.name || "No teams"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (name) => {
  switch (name) {
    case "Best Display":
      return "🖥️";
    case "Best Presentation":
      return "🎤";
    case "Best Team Composure":
      return "🤝";
    case "Best Prototype":
      return "🔧";
    case "Best Innovation Idea":
      return "💡";
    default:
      return "🏆";
  }
};

export default CategorySlider;
