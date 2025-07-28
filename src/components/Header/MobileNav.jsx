"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  Home,
  LayoutList,
  BarChart2,
  User,
  LogOut,
} from "lucide-react";
import styles from "./Header.module.css"; 

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Close menu when route changes
  useEffect(() => {
    closeMenu();
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const navLinks = [
    { title: "Home", path: "/", icon: Home },
    { title: "Categories", path: "/categories", icon: LayoutList },
    { title: "Live Results", path: "/results", icon: BarChart2 },
    ...(session?.user?.isAdmin
      ? [{ title: "AdminPanel", path: "/admin", icon: User }]
      : []),
  ];

  return (
    <>
      
      <div className={styles.showOnMobile}>
        <div className={styles.mobLogo}>
                <h1 className={styles.logo}>TechJam</h1>
                <p className={styles.subtitle}>Vote for groundbreaking innovations</p>
        </div>


        <button
          onClick={toggleMenu}
          className={styles.mobileMenuButton}
          aria-label="Toggle navigation menu"
        >
          <Menu className={styles.mobileNavIcon} size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className={styles.mobileMenuOverlay}>
          <div className={styles.mobileMenuHeader}>
            <button
              onClick={toggleMenu}
              className={styles.mobileMenuButton}
              aria-label="Close navigation menu"
            >
              <X className={styles.mobileNavIcon} size={24} />
            </button>
          </div>

          {/* App Title */}
          <div className={styles.mobileMenuTitle}>
            <h1>TechJam</h1>
            <p className={styles.subtitle}>Vote for groundbreaking innovations</p>
          </div>

          <nav>
            <ul className={styles.mobileNavList}>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <li className={styles.mobileNavItem} key={link.title}>
                    <Link
                      href={link.path}
                      className={`${styles.mobileNavLink} ${
                        isActive ? styles.mobileNavLinkActive : ""
                      }`}
                    >
                      <Icon className={styles.mobileNavIcon} size={20} />
                      <span>{link.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className={styles.mobileAuthContainer}>
            {session?.user ? (
              <div className={styles.mobileButtonGroup}>
                <Link href="/categories" className={styles.mobileVoteButton}>
                  Vote Now!
                </Link>
                <button
                  onClick={() => signOut()}
                  className={styles.mobileLogoutButton}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className={styles.mobileAuthGrid}>
                <Link href="/login" className={styles.mobileLoginButton}>
                  Login
                </Link>
                <Link href="/register" className={styles.mobileRegisterButton}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
