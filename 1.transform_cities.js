const R = require("ramda");
const fs = require("fs");

const data = fs.readFileSync("./cities.json", "utf8");
const cities = JSON.parse(data);

const KtoC = (k) => k - 273.15;
const updateTemp = (city) => {
  const temp = KtoC(city.temp);
  return { ...city, temp };
  // ramda way
  // return R.merge(city, { temp });
};
const updtCities = cities.map(updateTemp);
console.log(updtCities[2]);
