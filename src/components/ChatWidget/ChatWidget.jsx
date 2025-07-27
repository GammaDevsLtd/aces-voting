"use client"
import { useState } from "react";
import styles from "./ChatWidget.module.css";

const ChatWidget = ({ isOpen, onToggle }) => {
  const [fullname, setFullname] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    // Handle chat submission
    try{
      if(!fullname || !message){
        setSending(false);
        setError("All fields are required!!")
      }

      const res = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify({
          fullname,
          message,
        }),
      })

      const data = await res.json();

      if(!res.ok){
        throw new Error(data.message || "Failed to send message")
      }
    }catch(error){
      setError(error.message || "An error occured while sending the message")
    }

    setSuccess(true);
    setTimeout(
      setSuccess(false), 5000
    )

    setFullname("");
    setMessage("");
    setSending(false);
  };

  return (
    <div className={`${styles.chatContainer} ${isOpen ? styles.open : ""}`}>
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <h3>Event Questions</h3>
            <button className={styles.closeButton} onClick={onToggle}>
              ×
            </button>
          </div>
          <form onSubmit={handleSubmit} className={styles.chatForm}>
            <div className={styles.formGroup}>
              <input
                type="text"
                placeholder="Your Name"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                maxLength={50}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <textarea
                placeholder="Your question (max 250 characters)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={250}
                required
              />
            </div>
            {success ? (
              <button
                type="disabled"
                className={styles.submitButton}
              >
                Message Sent
              </button>
            ) : (
              <button
                type="submit"
                disabled={sending}
                className={`${styles.submitButton} ${
                  sending && styles.sending
                }`}
              >
                {sending ? "Sending Message" : "Send"}
              </button>
            )}
            {error && <p className={styles.errorMessage}>{error}</p>}
          </form>
        </div>
      )}

      <button className={styles.chatButton} onClick={onToggle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="28px"
          height="28px"
        >
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
      </button>
    </div>
  );
};

export default ChatWidget;
