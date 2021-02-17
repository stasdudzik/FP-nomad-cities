const R = require("ramda");
const fs = require("fs");

const data = fs.readFileSync("./cities.json", "utf8");
const cities = JSON.parse(data);

const KtoC = (k) => k - 273.15;
const KtoF = (k) => (k * 9) / 5 - 459.67;
const updateTemp = (convertFn) => {
  return (city) => {
    const temp = Math.round(convertFn(city.temp));
    return { ...city, temp };
    // ramda way
    // return R.merge(city, { temp });}
  };
};
const updtCities = cities.map(updateTemp(KtoF));
console.log(updtCities);

// currying

const firstCity = cities[0];
const updatedCity = updateTemp(KtoC)(firstCity);
console.log(updatedCity);

// we can simplify this weird call with Ramda curry function
// how to disappear the second pair of parents?
