"use client"
import { useState } from "react";
import styles from "./VotingModal.module.css";

const VotingModal = ({ isOpen, onClose, team, onSubmit }) => {
  const [voterName, setVoterName] = useState("");
  const [voterEmail, setVoterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !team) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      onSubmit({
        name: voterName,
        email: voterEmail,
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.modalHeader}>
          <h2>Cast Your Vote</h2>
          <p>
            You're voting for{" "}
            <span className={styles.teamHighlight}>{team.name}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.votingForm}>
          <div className={styles.formGroup}>
            <label htmlFor="voterName">Your Name</label>
            <input
              type="text"
              id="voterName"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="voterEmail">Email Address</label>
            <input
              type="email"
              id="voterEmail"
              value={voterEmail}
              onChange={(e) => setVoterEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
            <p className={styles.emailNote}>
              We'll send a confirmation of your vote
            </p>
          </div>

          <div className={styles.terms}>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the voting terms and confirm this vote is my own
            </label>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className={styles.spinner}></span>
            ) : (
              `Submit Vote for ${team.name}`
            )}
          </button>
        </form>

        <div className={styles.footerNote}>
          <p>
            Your vote helps determine the winner! After voting, you'll be
            redirected to see live results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VotingModal;