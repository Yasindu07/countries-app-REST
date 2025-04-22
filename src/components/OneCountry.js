import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

export default function OneCountry() {
  const [country, setCountry] = useState(null);
  const { name } = useParams();

  useEffect(() => {
    const getOneCountry = async () => {
      try {
        const res = await axios.get(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        setCountry(res.data);
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };
    getOneCountry();
  }, [name]);

  if (!country) {
    return <h1 className="text-center text-2xl font-bold">Loading...</h1>;
  }

  return (
    <section className="p-8 md:py-0 max-w-7xl mx-auto text-gray-900 dark:text-white">
      {country.map((item) => (
        <div
          key={item.population}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:place-items-center md:h-screen"
        >
          <article>
            <img
              src={item.flags.svg}
              alt={`Flag of ${item.name.common}`}
              className="shadow-lg"
            />
          </article>

          <article>
            <h1 className="mb-8 font-bold text-4xl lg:text-6xl">
              {item.name.official}
            </h1>
            <ul className="my-4 flex flex-col items-start gap-2 text-gray-700 dark:text-gray-300">
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

            <h3 className="mt-4 font-semibold text-lg mb-2">Borders:</h3>
            <ul className="flex flex-wrap gap-2">
              {item.borders ? (
                item.borders.map((border, index) => (
                  <li
                    key={index}
                    className="bg-white dark:bg-gray-700 p-2 rounded text-sm tracking-wide shadow"
                  >
                    {border}
                  </li>
                ))
              ) : (
                <li>No border countries</li>
              )}
            </ul>
            <Link
              to="/"
              className="inline-block mt-8 bg-white dark:bg-gray-700 py-2 px-6 rounded shadow text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-150"
            >
              &larr; Back to Home
            </Link>
          </article>
        </div>
      ))}
    </section>
  );
}
