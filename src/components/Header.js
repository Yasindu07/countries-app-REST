import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className="p-4 shadow-md flex justify-between items-center bg-white dark:bg-gray-800">
      <h1 className="text-2xl font-bold">Country Explorer</h1>
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        {darkMode ? (
          <FaSun className="text-yellow-400" />
        ) : (
          <FaMoon className="text-gray-800" />
        )}
      </button>
    </header>
  );
}
