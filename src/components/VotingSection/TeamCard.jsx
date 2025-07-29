"use client"
import { useState } from "react";
import styles from "./TeamCard.module.css"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const TeamCard = ({ team, category }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ submit, setSubmit ] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleVote = async () => {
    setSubmit(true);

    if(!session){
      setSubmit(false);
      setError("You must login to Vote!");
      router.push("/login");
      return
    }

    try{
      const voteData = {
        category,
        teamId: team._id
      }

      const res = await fetch("/api/voting",{
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(voteData)
      })

      if (!res.ok){
        const errorData = await res.json();
        setError(errorData.message || "Failed to vote")
      }

      setSuccess("Voting Successful");

    }catch(error){
      setError(error.message || "Error Casting your Vote")
    } finally{
      setSubmit(false)
    console.log(`Voted for ${team.name}`);
    setTimeout(reset, 5000)
    }
  };

  const reset = () =>{
    setError("");
    setSuccess("")
    setShowConfirmation(false);
  }

  return (
    <>
      <div
        className={styles.card}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={styles.cardHeader}>
          <div className={styles.teamImage}>
            {/* Placeholder for team image */}
            <div className={styles.imagePlaceholder}>
              <span className={styles.teamInitial}>{team.name.charAt(0)}</span>
            </div>
          </div>
          <div className={styles.teamInfo}>
            <h3 className={styles.teamName}>{team.name}</h3>
            <div className={styles.voteCount}>{team.votes} votes</div>
          </div>
        </div>

        <div className={styles.cardBody}>
          <p className={styles.teamDescription}>{team.description}</p>
        </div>

        <div className={styles.cardFooter}>
          <button
            className={styles.voteButton}
            onClick={() => setShowConfirmation(true)}
          >
            Vote for {team.name}
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

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button
              className={styles.closeButton}
              onClick={() => setShowConfirmation(false)}
            >
              &times;
            </button>

            <div className={styles.modalHeader}>
              <h2>Confirm Your Vote</h2>
              <p>
                You're voting for{" "}
                <span className={styles.teamHighlight}>{team.name}</span>
              </p>
            </div>

            <div className={styles.confirmationContent}>
              <p className={styles.warningText}>
                ⚠️ Once you vote, you won't be able to change your selection or
                vote for any other team in this category.
              </p>

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
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                disabled={submit}
                onClick={handleVote}
              >
                {submit ? "Submitting..." : "Confirm Vote"}
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

