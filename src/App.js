import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CountriesPage from "./pages/CountriesPage";
import Header from "./components/Header";
import useDarkMode from "./hooks/useDarkMode";

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<CountriesPage />} />
        </Routes>
      </div>
    </Router>
  );
}
