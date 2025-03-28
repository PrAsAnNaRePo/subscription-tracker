"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll effect for glassmorphic navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Subscriptions", href: "/dashboard/subscriptions" },
    { name: "Settings", href: "/dashboard/settings" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-gray-900/80 backdrop-blur-md border-b border-gray-800" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-blue-500 hover:text-blue-400 transition-colors">
                SubTracker
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    pathname === link.href
                      ? "border-blue-500 text-white"
                      : "border-transparent text-gray-400 hover:border-gray-600 hover:text-gray-300"
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="ml-3 relative flex items-center space-x-4">
                <span className="text-sm text-gray-400">
                  Hello, {session.user.name}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden bg-gray-900/90 backdrop-blur-md`}>
        <div className="pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                pathname === link.href
                  ? "bg-gray-800 border-blue-500 text-blue-400"
                  : "border-transparent text-gray-400 hover:bg-gray-800 hover:border-gray-700 hover:text-gray-300"
              } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-800">
          {session ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <span className="text-gray-300">{session.user.name.charAt(0)}</span>
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-300">
                  {session.user.name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {session.user.email}
                </div>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="ml-auto flex-shrink-0 bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center px-4">
              <Link
                href="/auth/signin"
                className="text-base font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}