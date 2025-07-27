"use client";
import React, { useState } from "react";
import styles from "./GammaDevs.module.css";

const GammaDevs = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.content}>
        <button
          className={styles.chatButton}
          onClick={togglePanel}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => !isOpen && setIsOpen(false)}
        />

        {isOpen && (
          <div
            className={styles.infoPanel}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className={styles.panelHeader}>
              <div className={styles.logo} />
              <h3>Brought to you by</h3>
              <h2>GammaDevs</h2>
            </div>

            <div className={styles.panelBody}>
              <div className={styles.contactItem}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <a href="mailto:gammadevs0@gmail.com">gammadevs0@gmail.com</a>
              </div>

              <div className={styles.contactItem}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <a href="tel:+2348080431610">+234 808 043 1610</a>
              </div>
            </div>

            <div className={styles.panelFooter}>
              <p>Your technology innovation partners</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GammaDevs;
