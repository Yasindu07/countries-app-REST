"use client";

import { useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Globe, User, LogIn } from "lucide-react";

export default function Header({ darkMode, toggleDarkMode }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 bg-gradient-to-r from-teal-500 to-cyan-500 p-2 rounded-full">
              <Globe className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Country Explorer
            </h1>
          </div>

          {/* Navigation and buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme toggle button */}
            <button
              onClick={toggleDarkMode}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? (
                <FaSun className="h-4 w-4 text-amber-400" />
              ) : (
                <FaMoon className="h-4 w-4 text-gray-700" />
              )}
              <span className="sr-only">
                {darkMode ? "Light mode" : "Dark mode"}
              </span>
            </button>

            {/* Login button */}
            <button
              className="hidden sm:flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow transition-all duration-300 font-medium"
              onClick={() =>
                alert("Login functionality would be implemented here")
              }
            >
              <LogIn className="h-4 w-4" />
              <span>Login</span>
            </button>

            {/* User dropdown (for mobile) */}
            <div className="relative sm:hidden">
              <button
                className="flex items-center justify-center h-9 w-9 rounded-full bg-teal-500 text-white hover:bg-teal-600 transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <User className="h-5 w-5" />
              </button>

              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 animate-fadeIn"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <button
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => {
                      alert("Login functionality would be implemented here");
                      setShowDropdown(false);
                    }}
                    role="menuitem"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </header>
  );
}
