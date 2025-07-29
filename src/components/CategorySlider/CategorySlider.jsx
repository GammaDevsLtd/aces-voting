import { useRef, useEffect } from "react";
import styles from "./CategorySlider.module.css";
import * as LucideIcons from "lucide-react";

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

  // Get icon component safely
  const getIconComponent = (iconName) => {
    if (!iconName) return LucideIcons.Monitor;
    return LucideIcons[iconName] || LucideIcons.Monitor;
  };

  return (
    <div className={styles.sliderContainer} ref={sliderRef}>
      <div className={styles.sliderTrack}>
        {categories.map((category, index) => {
          const IconComponent = getIconComponent(category.icon);

          return (
            <div
              key={category.id}
              ref={(el) => (itemRefs.current[index] = el)}
              className={`${styles.sliderItem} ${
                index === activeIndex ? styles.active : ""
              }`}
              onClick={() => onSelect(index)}
            >
              <div className={styles.categoryIcon}>
                <IconComponent size={32} />
              </div>
              <div className={styles.categoryName}>{category.name}</div>
              <div className={styles.topTeam}>
                {category.teams[0]?.name || "No teams"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySlider;
