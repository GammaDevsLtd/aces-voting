import { icons } from "lucide-react";
import { useState, useMemo } from "react";
import styles from "./IconPicker.module.css"; // Import CSS module

const IconPicker = ({ selectedIcon, onSelect }) => {
  const [search, setSearch] = useState("");

  const iconList = useMemo(() => {
    const names = Object.keys(icons).filter((name) =>
      name.toLowerCase().includes(search.toLowerCase())
    );
    return names.sort();
  }, [search]);

  return (
    <div className={styles.iconPicker}>
      <input
        type="text"
        placeholder="Search icons..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      <div className={styles.iconGrid}>
        {iconList.map((iconName) => {
          const Icon = icons[iconName];
          return (
            <div
              key={iconName}
              className={`${styles.iconOption} ${
                selectedIcon === iconName ? styles.selected : ""
              }`}
              onClick={() => onSelect(iconName)}
            >
              <Icon size={20} />
              <span>{iconName}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IconPicker;
