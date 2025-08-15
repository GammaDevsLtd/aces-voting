"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import ChatWidget from "@/components/ChatWidget/ChatWidget";
import * as LucideIcons from "lucide-react"; // Import all Lucide icons

export default function CategoriesPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/categories");

        if (!res.ok) {
          throw new Error(`Failed to fetch categories: ${res.status}`);
        }

        const data = await res.json();
        setCategories(data.categories);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Function to safely get icon component
  const getIconComponent = (iconName) => {
    try {
      // Check if icon exists in Lucide set
      if (iconName && LucideIcons[iconName]) {
        return LucideIcons[iconName];
      }
      return LucideIcons.Monitor; // Fallback icon
    } catch (error) {
      console.error("Icon error:", error);
      return LucideIcons.Monitor;
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Voting Categories</h1>
          <p>Loading categories...</p>
        </div>
        <div className={styles.categoryGrid}>
          {[...Array(5)].map((_, i) => {
            const IconComponent = LucideIcons.Loader; // Use loader icon
            return (
              <div key={i} className={styles.categoryCard}>
                <div className={styles.cardIcon}>
                  <div className={styles.iconWrapper}>
                    <IconComponent className={styles.icon} />
                  </div>
                </div>
                <h2>Loading...</h2>
                <p>Category description will appear here</p>
                <div className={styles.cta}>
                  Loading...
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (error) {
    const IconComponent = LucideIcons.AlertTriangle; // Error icon
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Voting Categories</h1>
          <p className={styles.error}>Error loading categories</p>
        </div>
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>
            <div className={styles.cardIcon}>
              <div className={styles.iconWrapper}>
                <IconComponent className={styles.icon} />
              </div>
            </div>
          </div>
          <p>Failed to load categories: {error}</p>
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Voting Categories</h1>
        <p>Select a category to view teams and cast your vote</p>
      </div>

      <div className={styles.categoryGrid}>
        {categories.map((category) => {
          // Get the correct icon component
          const IconComponent = getIconComponent(category.icon);

          return (
            <Link
              href={`/categories/${category._id}`}
              key={category.id || category._id}
              className={styles.categoryCard}
            >
              <div className={styles.cardIcon}>
                <div className={styles.iconWrapper}>
                  <IconComponent className={styles.icon} />
                </div>
              </div>
              <h2>{category.name}</h2>
              <p>{category.description}</p>
              <div className={styles.maxPoints}>
                Max Score: {category.maxPoints} points
              </div>
              <div className={styles.cta}>
                View Teams
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
      <ChatWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />
    </div>
  );
}
