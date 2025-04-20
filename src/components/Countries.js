import { useState, useEffect } from "react";
import axios from "axios";
import Details from "./Details";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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
    <>
      {!countries.length ? (
        <h1 className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center h-screen text-4xl">
          Loading...
        </h1>
      ) : (
        <section className="mx-auto p-8 max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <form
              onSubmit={searchCountry}
              autoComplete="off"
              className="max-w-4xl md:flex-1"
            >
              <input
                type="text"
                name="search"
                id="search"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search countries..."
                className="py-3 px-4 text-grey-600 placeholder-grey-600 w-full shadow rounded outline-none"
                required
              />
            </form>

            <select
              name="filter-by-region"
              id="filter-by-region"
              className="w-52 py-3 px-4 outline-none shadow rounded"
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
              <Details key={country.name.common} {...country} />
            ))}
          </div>

          <div className="flex justify-center gap-4 my-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
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
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </section>
      )}
    </>
  );
}
