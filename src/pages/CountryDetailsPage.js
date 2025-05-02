import React, { useState, useEffect } from "react";
import { getCountryDetails } from "../services/countryService";

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
    <section className="p-4 text-gray-900 dark:text-white">
      {country.map((item) => (
        <div key={item.population} className="grid gap-8 md:grid-cols-2">
          <img
            src={item.flags.svg}
            alt={`Flag of ${item.name.common}`}
            className="shadow-lg"
          />
          <div>
            <h1 className="mb-6 font-bold text-3xl">{item.name.official}</h1>
            <ul className="mb-4 flex flex-col gap-2 text-gray-700 dark:text-gray-300">
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
                    className="bg-white dark:bg-gray-700 p-2 rounded text-sm shadow"
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
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View on Map
            </a>
          </div>
        </div>
      ))}
    </section>
  );
}
