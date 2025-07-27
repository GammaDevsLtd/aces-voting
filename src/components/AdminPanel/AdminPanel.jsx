
"use client";
import React, { useState } from "react";
import styles from "./admin.module.css";
import CategoryForm from "./Category/Category";
import TeamForm from "./Teams/Teams";
import MessageBoard from "./MessageBoard/MessageBoard";

export default function AdminPanel() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminSuccess, setAdminSuccess] = useState("");



  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAdminError("");
    setAdminSuccess("");

    // Validation
    if (!fullname || !email || !password || !confirmpassword) {
      setAdminError("All fields are required");
      setLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      setAdminError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const userEmail = email.toLowerCase();
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, email: userEmail, password, isAdmin: true }),
      });

      if (response.ok) {
        setFullname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAdminSuccess("Admin created successfully");
      } else {
        const errorData = await response.json();
        setAdminError(errorData.message || "Admin registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setAdminError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <p>Manage messages and register teams, users and caegory</p>
      </div>

      <div className={styles.adminContent}>
        <div className={styles.top}>
          <MessageBoard/>
        </div>
        <div className={styles.grid}>
          {/*Category Form Section*/}
          <CategoryForm />

          {/*Teams Form Section*/}
          <TeamForm />

          {/* Admin Form Section */}
          <div className={`${styles.card} ${styles.adminCard}`}>
            <div className={styles.cardHeader}>
              <h2>Create New Admin</h2>
            </div>

            <div className={styles.cardContent}>
              <form onSubmit={handleAdminSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="fullname">Full Name:</label>
                  <input
                    type="text"
                    id="fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="Type your FullName"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Type your Email"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Type your Password"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="confirmpassword">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirmpassword"
                    value={confirmpassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your Password"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Register New Admin"}
                </button>
              </form>

              {adminError && (
                <div className={styles.errorMessage}>{adminError}</div>
              )}
              {adminSuccess && (
                <div className={styles.successMessage}>{adminSuccess}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
