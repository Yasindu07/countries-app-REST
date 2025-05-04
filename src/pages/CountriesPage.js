import { useState, useEffect } from "react";
import {
  getAllCountries,
  searchByName,
  filterByRegion,
  filterByCurrancy,
  filterByLanguage,
} from "../services/countryService";
import CountryCard from "../components/CountryCard";
import CountryModal from "../components/CountryModal";
import {
  Search,
  Globe,
  RefreshCw,
  CircleDollarSign,
  Languages,
  Heart,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";

const regions = [
  "Filter by Region",
  "Africa",
  "Asia",
  "Europe",
  "Oceania",
  "Americas",
  "Antarctica",
];

export default function CountriesPage() {
  const { isAuthenticated } = useAuth();
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCurrency, setSelectedCurrency] =
    useState("Filter by Currency");
  const [selectedLanguage, setSelectedLanguage] =
    useState("Filter by Language");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  const [currencyOptions, setCurrencyOptions] = useState([
    "Filter by Currency",
  ]);
  const [languageOptions, setLanguageOptions] = useState([
    "Filter by Language",
  ]);

  const [currencyMap, setCurrencyMap] = useState({});
  const [languageMap, setLanguageMap] = useState({});

  const itemsPerPage = 9;

  // Load countries and favorites from localStorage on initial render
  useEffect(() => {
    loadCountries();
    const savedFavorites = localStorage.getItem("favoriteCountries");
    if (savedFavorites && isAuthenticated) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Reset favorites when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      setFavorites([]);
      setShowOnlyFavorites(false);
    }
  }, [isAuthenticated]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("favoriteCountries", JSON.stringify(favorites));
    }
  }, [favorites, isAuthenticated]);

  useEffect(() => {
    if (countries.length > 0) {
      extractCurrencyOptions();
      extractLanguageOptions();
    }
  }, [countries]);

  async function loadCountries() {
    setIsLoading(true);
    try {
      const data = await getAllCountries();
      setCountries(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to load countries:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function extractCurrencyOptions() {
    const currencySet = new Set();
    const currencyCodeMap = {};

    countries.forEach((country) => {
      if (country.currencies) {
        Object.entries(country.currencies).forEach(([code, details]) => {
          const name = details.name;
          if (name) {
            currencySet.add(name);
            currencyCodeMap[name] = code;
          }
        });
      }
    });

    const sortedCurrencies = Array.from(currencySet).sort();
    setCurrencyOptions(["Filter by Currency", ...sortedCurrencies]);
    setCurrencyMap(currencyCodeMap);
  }

  function extractLanguageOptions() {
    const languageSet = new Set();
    const languageCodeMap = {};

    countries.forEach((country) => {
      if (country.languages) {
        Object.entries(country.languages).forEach(([code, name]) => {
          languageSet.add(name);
          languageCodeMap[name] = code;
        });
      }
    });

    const sortedLanguages = Array.from(languageSet).sort();
    setLanguageOptions(["Filter by Language", ...sortedLanguages]);
    setLanguageMap(languageCodeMap);
  }

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchText.trim()) return;

    setIsLoading(true);
    try {
      const data = await searchByName(searchText.trim());
      setCountries(data);
      setCurrentPage(1);
      setSelectedCurrency("Filter by Currency");
      setSelectedLanguage("Filter by Language");
      setShowOnlyFavorites(false);
    } catch (error) {
      console.error("Search failed:", error);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegionFilter(region) {
    if (region === "Filter by Region") return loadCountries();

    setIsLoading(true);
    try {
      const data = await filterByRegion(region);
      setCountries(data);
      setCurrentPage(1);
      setSelectedCurrency("Filter by Currency");
      setSelectedLanguage("Filter by Language");
      setShowOnlyFavorites(false);
    } catch (error) {
      console.error("Region filter failed:", error);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCurrencyFilter(currency) {
    if (currency === "Filter by Currency") return loadCountries();

    setIsLoading(true);
    try {
      const currencyCode = currencyMap[currency];
      if (!currencyCode) return;
      const data = await filterByCurrancy(currencyCode); // Changed to filterByCurrancy
      setCountries(data);
      setCurrentPage(1);
      setSelectedLanguage("Filter by Language");
      setShowOnlyFavorites(false);
    } catch (error) {
      console.error("Currency filter failed:", error);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLanguageFilter(language) {
    if (language === "Filter by Language") return loadCountries();

    setIsLoading(true);
    try {
      const languageCode = languageMap[language];
      if (!languageCode) return;
      const data = await filterByLanguage(languageCode);
      setCountries(data);
      setCurrentPage(1);
      setSelectedCurrency("Filter by Currency");
      setShowOnlyFavorites(false);
    } catch (error) {
      console.error("Language filter failed:", error);
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  }

  function resetFilters() {
    loadCountries();
    setSearchText("");
    setSelectedCurrency("Filter by Currency");
    setSelectedLanguage("Filter by Language");
    setShowOnlyFavorites(false);
  }

  function toggleFavorite(countryName) {
    setFavorites((prevFavorites) => {
      if (prevFavorites.includes(countryName)) {
        return prevFavorites.filter((name) => name !== countryName);
      } else {
        return [...prevFavorites, countryName];
      }
    });
  }

  function toggleShowFavorites() {
    setShowOnlyFavorites((prev) => !prev);
    setCurrentPage(1);
  }

  const filteredCountries = showOnlyFavorites
    ? countries.filter((country) => favorites.includes(country.name.common))
    : countries;

  const currentCountries = filteredCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  return (
    <section className="mx-auto p-4 md:p-8 max-w-7xl">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Explore Our World
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Discover information about countries around the globe - from
          populations and languages to currencies and more.
        </p>
      </div>

      {/* Search & filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
        <form onSubmit={handleSearch} className="w-full mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search countries..."
              className="py-3 px-4 pl-12 w-full rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-100 placeholder-gray-500 outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-500 dark:text-gray-400"
              size={20}
            />
            <button
              type="submit"
              className="absolute right-2 top-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow transition-all duration-300 font-medium py-1.5 px-8"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-col md:flex-row gap-4 items-end justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                <Globe size={16} className="inline mr-2" />
                Region
              </label>
              <select
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500"
                onChange={(e) => handleRegionFilter(e.target.value)}
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {regions.map((region, index) => (
                      <option key={index} value={region}>
                        {region}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                <CircleDollarSign size={16} className="inline mr-2" />
                Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => {
                  setSelectedCurrency(e.target.value);
                  handleCurrencyFilter(e.target.value);
                }}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {currencyOptions.map((currency, index) => (
                      <option key={index} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                <Languages size={16} className="inline mr-2" />
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  handleLanguageFilter(e.target.value);
                }}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500"
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {languageOptions.map((language, index) => (
                      <option key={index} value={language}>
                        {language}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleShowFavorites}
              className={`flex items-center gap-2 py-3 px-6 rounded-lg shadow-md md:self-end transition-all duration-300 ${
                showOnlyFavorites
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600"
              }`}
              aria-pressed={showOnlyFavorites}
            >
              {showOnlyFavorites ? (
                <>
                  <Heart size={18} />
                </>
              ) : (
                <>
                  <Heart size={18} />
                </>
              )}
            </button>

            <button
              onClick={resetFilters}
              className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-lg shadow-md md:self-end"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Result info */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 py-2 px-4 rounded-lg">
          {showOnlyFavorites ? (
            <>
              <Heart size={14} className="inline mr-2 text-rose-500" />
              <span className="text-teal-600 dark:text-teal-400 font-bold">
                {filteredCountries.length}
              </span>{" "}
              favorite countries
            </>
          ) : (
            <>
              Found{" "}
              <span className="text-teal-600 dark:text-teal-400 font-bold">
                {filteredCountries.length}
              </span>{" "}
              countries
            </>
          )}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages || 1}
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Country Cards */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {currentCountries.length > 0 ? (
              currentCountries.map((country) => (
                <div key={country.name.common} className="relative">
                  <button
                    onClick={() => toggleFavorite(country.name.common)}
                    className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform duration-200"
                    aria-label={
                      favorites.includes(country.name.common)
                        ? `Remove ${country.name.common} from favorites`
                        : `Add ${country.name.common} to favorites`
                    }
                  >
                    {favorites.includes(country.name.common) ? (
                      <Heart
                        size={20}
                        className="text-rose-500 fill-rose-500"
                      />
                    ) : (
                      <Heart size={20} className="text-gray-400" />
                    )}
                  </button>
                  <CountryCard
                    {...country}
                    onClick={() => setSelectedCountry(country.name.common)}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                {showOnlyFavorites ? (
                  <>
                    <p className="text-xl font-medium mb-4">
                      No favorite countries yet
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Click the heart icon on any country to add it to your
                      favorites
                    </p>
                    <button
                      onClick={() => setShowOnlyFavorites(false)}
                      className="py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow transition-all duration-300 "
                    >
                      Show All Countries
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-xl font-medium mb-4">
                      No countries found matching your criteria
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Try adjusting your search or filters
                    </p>
                    <button
                      onClick={resetFilters}
                      className="py-3 px-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow transition-all duration-300 "
                    >
                      Reset All Filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredCountries.length > 0 && (
            <div className="flex justify-center gap-4 my-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex items-center">
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  const pageNum =
                    totalPages <= 5
                      ? i + 1
                      : currentPage <= 3
                      ? i + 1
                      : currentPage >= totalPages - 2
                      ? totalPages - 4 + i
                      : currentPage - 2 + i;

                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 mx-1 rounded-lg ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-5 py-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {selectedCountry && (
        <CountryModal
          countryName={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
}
