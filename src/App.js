import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectRoute from "./components/ProtectRoute";
import CountriesPage from "./pages/CountriesPage";
import Header from "./components/Header";
import useDarkMode from "./hooks/useDarkMode";

function AppContent() {
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectRoute>
              <CountriesPage />
            </ProtectRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [darkMode, toggleDarkMode] = useDarkMode();

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}
