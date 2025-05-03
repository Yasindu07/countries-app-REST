import { useState, useEffect } from "react";
import { getCountryDetails } from "../services/countryService";
import { MapPin } from "lucide-react";

export default function CountryDetailsPage({ countryName }) {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const data = await getCountryDetails(countryName);
      setCountry(data);
    }
    fetchData();
  }, [countryName]);

  if (!country)
    return <h1 className="text-center text-2xl font-bold">Loading...</h1>;

  return (
    <section className="p-4 text-gray-900 dark:text-white border-r-10">
      {country.map((item) => (
        <div
          key={item.population}
          className="relative overflow-hidden rounded-lg shadow-xl"
        >
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: `url(${item.flags.svg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.25,
              filter: "blur(1px)",
            }}
          />

          <div className="relative z-10 p-3 grid gap-5 md:grid-cols-2">
            <img
              src={item.flags.svg || "/placeholder.svg"}
              alt={`Flag of ${item.name.common}`}
              className="shadow-lg rounded-md"
            />
            <div className="bg-white/70 dark:bg-gray-900/70 p-6 rounded-lg backdrop-blur-sm">
              <h1 className="mb-6 font-bold text-3xl">{item.name.official}</h1>
              <ul className="mb-5 flex flex-col gap-2 text-gray-700 dark:text-gray-300">
                <li>Population: {item.population.toLocaleString()}</li>
                <li>Region: {item.region}</li>
                <li>Subregion: {item.subregion}</li>
                <li>
                  Languages:{" "}
                  {item.languages
                    ? Object.values(item.languages).join(", ")
                    : "N/A"}
                </li>
                <li>Capital: {item.capital?.join(", ") || "N/A"}</li>
                <li>
                  Currency:{" "}
                  {item.currencies
                    ? Object.values(item.currencies)
                        .map((c) => c.name)
                        .join(", ")
                    : "N/A"}
                </li>
                <li>Area: {item.area.toLocaleString()} km²</li>
              </ul>
              <h3 className="font-semibold text-lg">Borders:</h3>
              <ul className="flex flex-wrap gap-2 mt-2">
                {item.borders ? (
                  item.borders.map((b, i) => (
                    <li
                      key={i}
                      className="bg-white/80 dark:bg-gray-700/80 p-2 rounded text-sm shadow"
                    >
                      {b}
                    </li>
                  ))
                ) : (
                  <li>No border countries</li>
                )}
              </ul>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  item.name.common
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white transition-all duration-300 font-medium px-5 py-2 rounded-lg shadow-md "
                aria-label={`View ${item.name.common} on Google Maps`}
              >
                <span className="font-medium">View on Map</span>
                <MapPin
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  size={20}
                />
              </a>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
