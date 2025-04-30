import { useState, useEffect } from "react";
import axios from "axios";
import Details from "./Details";
import OneCountry from "./OneCountry";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const itemsPerPage = 9;

  const regions = [
    { name: "All", value: "all" },
    { name: "Africa", value: "Africa" },
    { name: "Asia", value: "Asia" },
    { name: "Europe", value: "Europe" },
    { name: "Oceania", value: "Oceania" },
    { name: "Americas", value: "Americas" },
    { name: "Antarctica", value: "Antarctica" },
  ];

  useEffect(() => {
    fetchAllCountries();
  }, []);

  async function fetchAllCountries() {
    try {
      const res = await axios.get("https://restcountries.com/v3.1/all");
      setCountries(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  }

  async function searchCountry(e) {
    e.preventDefault();
    try {
      const res = await axios.get(
        `https://restcountries.com/v3.1/name/${searchText}`
      );
      setCountries(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error searching for country:", error);
    }
  }

  async function filterByRegion(region) {
    if (region === "all") {
      fetchAllCountries();
      return;
    }

    try {
      const res = await axios.get(
        `https://restcountries.com/v3.1/region/${region}`
      );
      setCountries(res.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error filtering by region:", error);
    }
  }

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentCountries = countries.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(countries.length / itemsPerPage);

  return (
    <section className="mx-auto p-8 max-w-7xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <form
          onSubmit={searchCountry}
          autoComplete="off"
          className="max-w-4xl md:flex-1"
        >
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search countries..."
            className="py-3 px-4 text-gray-700 dark:text-gray-100 dark:bg-gray-700 placeholder-gray-500 w-full shadow rounded outline-none"
            required
          />
        </form>

        <select
          className="w-52 py-3 px-4 outline-none shadow rounded dark:bg-gray-700 dark:text-white"
          onChange={(e) => filterByRegion(e.target.value)}
        >
          {regions.map((region, index) => (
            <option key={index} value={region.value}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {currentCountries.map((country) => (
          <Details
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setSelectedCountry(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] max-h-[90vh] overflow-y-auto relative shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCountry(null)}
              className="absolute top-4 right-4 text-gray-800 dark:text-white text-xl font-bold"
            >
              &times;
            </button>
            <OneCountry countryName={selectedCountry} />
          </div>
        </div>
      )}
    </section>
  );
}
