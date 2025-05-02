import axios from "axios";

export async function getAllCountries() {
  const res = await axios.get("https://restcountries.com/v3.1/all");
  return res.data;
}

export async function searchByName(name) {
  const res = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
  return res.data;
}

export async function filterByRegion(region) {
  const res = await axios.get(
    `https://restcountries.com/v3.1/region/${region}`
  );
  return res.data;
}

export async function getCountryDetails(name) {
  const res = await axios.get(
    `https://restcountries.com/v3.1/name/${name}?fullText=true`
  );
  return res.data;
}
