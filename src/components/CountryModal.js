import React from "react";
import CountryDetailsPage from "../pages/CountryDetailsPage";

export default function CountryModal({ countryName, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-h-[90vh] overflow-y-auto relative shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-800 dark:text-white text-xl font-bold"
        >
          &times;
        </button>
        <CountryDetailsPage countryName={countryName} />
      </div>
    </div>
  );
}
