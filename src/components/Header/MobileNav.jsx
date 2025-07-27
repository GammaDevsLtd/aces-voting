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
      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-end flex-1">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-lg bg-[#2a2a3c] border border-[#483E3F] hover:bg-[#3a3a4c] transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="text-[#D4CFB1]" size={24} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-[#191820]/95 backdrop-blur-lg md:hidden">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-[#2a2a3c] border border-[#483E3F] hover:bg-[#3a3a4c] transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="text-[#D4CFB1]" size={24} />
            </button>
          </div>

          {/* App Title */}
          <div className="text-center mb-8 px-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F7451F] to-[#32417A] bg-clip-text text-transparent">
              TechJam
            </h1>
            <p className="text-[#D4CFB1] opacity-80 mt-1">
              Vote for groundbreaking innovations
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="px-6">
            <ul className="space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.path;
                return (
                  <li key={link.title}>
                    <Link
                      href={link.path}
                      className={`flex items-center p-4 rounded-xl transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-[#F7451F]/20 to-[#32417A]/20 border border-[#483E3F]"
                          : "hover:bg-[#2a2a3c]"
                      }`}
                    >
                      <Icon
                        className={`mr-3 ${
                          isActive ? "text-[#F7451F]" : "text-[#D4CFB1]"
                        }`}
                        size={20}
                      />
                      <span
                        className={`font-medium ${
                          isActive ? "text-[#F7451F]" : "text-[#D4CFB1]"
                        }`}
                      >
                        {link.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#483E3F]">
            {session?.user ? (
              <div className="flex flex-col gap-3">
                <Link
                  href="/categories"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-gradient-to-r from-[#F7451F] to-[#32417A] text-white font-medium shadow-lg shadow-[#F7451F]/30"
                >
                  Vote Now!
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#2a2a3c] border border-[#483E3F] text-[#D4CFB1] font-medium"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="py-3 px-4 rounded-full bg-[#2a2a3c] border border-[#483E3F] text-[#D4CFB1] text-center font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="py-3 px-4 rounded-full bg-gradient-to-r from-[#F7451F] to-[#32417A] text-white text-center font-medium shadow-lg shadow-[#F7451F]/30"
                >
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
