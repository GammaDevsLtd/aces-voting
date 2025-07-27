"use client";
import React, { useState } from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { signIn } from "next-auth/react"; // Missing import
import { useRouter } from "next/navigation"; // Missing import

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(""); 
  const router = useRouter(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Process Initiated");
    setIsSubmitting(true);
    setError(""); 

    try {
      const normalizedEmail = email.toLowerCase().trim();

      const res = await signIn("credentials", {
        email: normalizedEmail,
        password,
        redirect: false,
      });

      console.log("SignIn response:", res); // Add logging

      if (res?.error) {
        setError("Invalid Credentials");
        return;
      }

      // Check if response is ok before redirecting
      if (res?.ok) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}></div>
          <h1 className={styles.loginTitle}>Login to Vote</h1>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} className={styles.loginForm}>
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.loginButton}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
