import React, { useState, useEffect } from "react";
import {
  getAllCountries,
  searchByName,
  filterByRegion,
} from "../services/countryService";
import CountryCard from "../components/CountryCard";
import CountryModal from "../components/CountryModal";

const regions = [
  "All",
  "Africa",
  "Asia",
  "Europe",
  "Oceania",
  "Americas",
  "Antarctica",
];

export default function CountriesPage() {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const itemsPerPage = 9;

  useEffect(() => {
    loadCountries();
  }, []);

  async function loadCountries() {
    const data = await getAllCountries();
    setCountries(data);
    setCurrentPage(1);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchText.trim()) return;

    try {
      const data = await searchByName(searchText.trim());
      setCountries(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Search failed:", error);
      setCountries([]);
    }
  }

  async function handleRegionFilter(region) {
    if (region === "All") return loadCountries();
    const data = await filterByRegion(region);
    setCountries(data);
    setCurrentPage(1);
  }

  const currentCountries = countries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  return (
    <section className="mx-auto p-8 max-w-7xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <form onSubmit={handleSearch} className="w-full md:flex-1">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search countries..."
            className="py-3 px-4 text-gray-700 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 w-full shadow rounded outline-none"
          />
        </form>

        <select
          className="w-52 py-3 px-4 outline-none shadow rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => handleRegionFilter(e.target.value)}
        >
          {regions.map((region, index) => (
            <option key={index} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {currentCountries.map((country) => (
          <CountryCard
            key={country.name.common}
            {...country}
            onClick={() => setSelectedCountry(country.name.common)}
          />
        ))}
      </div>

      <div className="flex justify-center gap-4 my-8">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="self-center text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {selectedCountry && (
        <CountryModal
          countryName={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </section>
  );
}
