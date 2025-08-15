"use client";
import { useState, useEffect } from "react";
import styles from "./TeamCard.module.css";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const TeamCard = ({ team, category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showScoring, setShowScoring] = useState(false);
  const [submit, setSubmit] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();

  const maxPoints = Number(category?.maxPoints) || 0;

  // Get rubric description based on category name
  const getRubricDescription = () => {
    switch (category.name) {
      case "Innovation & Originality":
        return [
          "20-25: Genuinely unique, solves novel problem",
          "10-19: Solid variation of existing solution",
          "0-9: Lacks innovative element",
        ];
      case "Technical Implementation & Functionality":
        return [
          "20-25: Functional, well-designed, polished",
          "10-19: Some features working but buggy",
          "0-9: Not functional or weak implementation",
        ];
      case "Problem-Solving & Impact":
        return [
          "15-20: Directly solves significant problem",
          "8-14: Limited impact or partial solution",
          "0-7: Problem poorly defined or not addressed",
        ];
      case "User Experience (UX) & Design":
        return [
          "11-15: Intuitive, clean, visually appealing",
          "6-10: Functional but usability issues",
          "0-5: Difficult to navigate or confusing",
        ];
      case "Presentation & Pitch":
        return [
          "11-15: Clear, concise, compelling",
          "6-10: Disorganized or key details missed",
          "0-5: Unclear communication",
        ];
      default:
        return [
          `15-${maxPoints}: Excellent`,
          `8-14: Average`,
          `0-7: Needs improvement`,
        ];
    }
  };

  const handleScoreSubmit = async () => {
    setSubmit(true);

    if (!session) {
      setSubmit(false);
      setError("You must login to submit scores!");
      router.push("/register");
      return;
    }

    try {
      const scoreData = {
        category: category._id,
        teamId: team._id,
        score: score,
      };

      const res = await fetch("/api/voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scoreData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.message || "Failed to submit score");
      }

      if (res.ok) {
        const successData = await res.json();
        setSuccess(successData.message || "Score submitted successfully!");
      }
    } catch (error) {
      setError(error.message || "Error submitting score");
    } finally {
      setSubmit(false);
      console.log(`Scored ${score} for ${team.name}`);
      setTimeout(reset, 5000);
    }
  };

  const reset = () => {
    setError("");
    setSuccess("");
    setShowScoring(false);
    // Use maxPoints instead of category.maxPoints
    setScore(Math.floor(maxPoints * 0.7));
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (showScoring) {
      document.body.style.overflow = "hidden";
      // Use maxPoints instead of category.maxPoints
      setScore(Math.floor(maxPoints * 0.7));
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showScoring, maxPoints]); // Add maxPoints as dependency

  const handleSession = () => {
    if (!session) {
      router.push("/register");
    } else {
      setShowScoring(true);
    }
  };

  const handleScoreChange = (e) => {
    const newScore = parseInt(e.target.value, 10);
    if (!isNaN(newScore)) {
      setScore(newScore);
    }
  };

  return (
    <>
      <div
        className={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.cardHeader}>
          <div className={styles.teamImage}>
            <div className={styles.imagePlaceholder}>
              <span className={styles.teamInitial}>{team.name.charAt(0)}</span>
            </div>
          </div>
          <div className={styles.teamInfo}>
            <h3 className={styles.teamName}>{team.name}</h3>
            <div className={styles.scoreDisplay}>
              <span className={styles.scoreLabel}>AVG SCORE:</span>
              <span className={styles.scoreValue}>
                {team.averageScore ? team.averageScore.toFixed(1) : "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.teamDescription}>{team.description}</p>
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.voteButton} onClick={handleSession}>
            {!session ? "Login to Score" : `Score ${team.name}`}

            <svg
              className={`${styles.arrowIcon} ${
                isHovered ? styles.hovered : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scoring Modal */}
      {showScoring && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setShowScoring(false)}
            >
              &times;
            </button>

            <div className={styles.modalHeader}>
              <h2>Submit Your Score</h2>
              <p>
                Scoring{" "}
                <span className={styles.teamHighlight}>{team.name}</span> in
              </p>
              <p className={styles.categoryHighlight}>{category.name}</p>
            </div>

            <div className={styles.confirmationContent}>
              <div className={styles.rubricContainer}>
                <h4>Judging Rubric:</h4>
                <ul className={styles.rubricList}>
                  {getRubricDescription().map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.scoreInputContainer}>
                <label className={styles.scoreLabel}>
                  Your Score:
                  <span className={styles.scoreValue}>{score}</span>
                  <span className={styles.maxScore}>/{maxPoints}</span>
                </label>

                <input
                  type="range"
                  min="0"
                  max={maxPoints}
                  value={score}
                  onChange={handleScoreChange} // Use the new handler
                  className={styles.scoreSlider}
                />

                <div className={styles.scoreTicks}>
                  <span>0</span>
                  <span>{Math.floor(maxPoints * 0.3)}</span>
                  <span>{Math.floor(maxPoints * 0.5)}</span>
                  <span>{Math.floor(maxPoints * 0.7)}</span>
                  <span>{maxPoints}</span>
                </div>
              </div>

              <div className={styles.teamPreview}>
                <div className={styles.previewImage}>
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.teamInitial}>
                      {team.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className={styles.previewInfo}>
                  <h3>{team.name}</h3>
                  <p className={styles.previewDescription}>
                    {team.description}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowScoring(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                disabled={submit}
                onClick={handleScoreSubmit}
              >
                {submit ? "Submitting..." : "Submit Score"}
              </button>
            </div>
            {success && <p className={styles.successMessage}>{success}</p>}
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default TeamCard;
