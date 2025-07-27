"use client";
import React, { useState } from "react";
import styles from "./register.module.css"; 
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validation checks
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();

      const resUserCheck = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const { user } = await resUserCheck.json();

      if (user) {
        setError("User Already Exists");
        setIsSubmitting(false);
        return;
      }

      // Send registration request
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: normalizedEmail,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to login after successful registration
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "An error occurred during registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}></div>
          <h1 className={styles.loginTitle}>Create an Account to Vote</h1>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              placeholder="Type in your Fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Type in your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <p className={styles.passwordHint}>Minimum 8 characters</p>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.loginButton}
          >
            {isSubmitting ? "Creating Account..." : "Register"}
          </button>

          <div className={styles.loginLink}>
            <span>Already have an account?</span>
            <Link href="/login">Sign in here</Link>
          </div>
        </form>
      </div>
    </main>
  );
}
