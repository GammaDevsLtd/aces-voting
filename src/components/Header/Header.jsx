// components/Header.js
"use client";
import Link from "next/link";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import MobileNav from "./MobileNav";

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
      <nav className={`${styles.nav} ${styles.hideOnMobile}`}>
      <div className={styles.logoContainer}>
        <h1 className={styles.logo}>TechJam</h1>
        <p className={styles.subtitle}>Vote for groundbreaking innovations</p>
      </div>

      
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

    
      <div className={`${styles.authContainer} ${styles.hideOnMobile}`}>
        {session?.user ? (
          <>
            <Link href="/categories" className={styles.loginButton}>
              Vote Now!!
            </Link>
            <button onClick={() => signOut()} className={styles.registerButton}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.loginButton}>
              Login
            </Link>
            <Link href="/register" className={styles.registerButton}>
              Register
            </Link>
          </>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </header>
  );
};

export default Header;
