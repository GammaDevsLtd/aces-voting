"use client"
import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Header = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { title: "Home", path: "/" },
    { title: "Categories", path: "/categories" },
    { title: "Live Results", path: "/results" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>Tech Innovation Jam</h1>
        <p className={styles.subtitle}>
          Vote for groundbreaking tech innovations
        </p>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {links.map((link) => (
            <li className={styles.navItem} key={link.title}>
              <Link
                href={link.path}
                className={`${styles.navLink} ${
                  pathname === link.path && styles.active
                }`}
              >
                {link.title}
              </Link>
            </li>
          ))}
          {session?.user?.isAdmin && (
            <li className={styles.navItem}>
              <Link
                href="/admin"
                className={`${styles.navLink} ${
                  pathname === "/admin" && styles.active
                }`}
              >
                AdminPanel
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {session?.user ? (
        <div className={styles.authContainer}>
          <Link href="/categories" className={styles.loginButton}>
            Vote Now!!
          </Link>
          <button onClick={() => signOut()} className={styles.registerButton}>
            Logout
          </button>
        </div>
      ) : (
        <div className={styles.authContainer}>
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>
          <Link href="/register" className={styles.registerButton}>
            Register
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
