import React from "react";
import { Link } from "react-router-dom";

export default function Details({
  flags,
  name,
  population,
  region,
  subregion,
  languages,
  capital,
}) {
  return (
    <Link to={`/${name?.common}`}>
      <article className="bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all shadow overflow-hidden duration-150">
        <img
          src={flags?.svg}
          alt={`Flag of ${name?.common}`}
          className="md:h-72 w-full object-cover"
        />
        <div className="p-4">
          <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
            {name?.common || "N/A"}
          </h2>
          <ul className="flex flex-col items-start justify-start gap-2 text-gray-700 dark:text-gray-300">
            <li>Population: {population?.toLocaleString() || "N/A"}</li>
            <li>Region: {region || "N/A"}</li>
            <li>Subregion: {subregion || "N/A"}</li>
            <li>
              Languages:{" "}
              {languages ? Object.values(languages).join(", ") : "N/A"}
            </li>
            <li>Capital: {capital?.join(", ") || "N/A"}</li>
          </ul>
        </div>
      </article>
    </Link>
  );
}
