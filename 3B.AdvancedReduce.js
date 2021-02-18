const R = require("ramda");
const fs = require("fs");
const data = fs.readFileSync("./cities.json", "utf8");
const cities = JSON.parse(data);

const KtoC = (k) => k - 273.15;
const KtoF = (k) => (k * 9) / 5 - 459.67;
const updateTemp = R.curry((convertFn, city) => {
  const temp = Math.round(convertFn(city.temp));
  return { ...city, temp };
  // ramda way
  // return R.merge(city, { temp });}
});
const updtCities = R.map(updateTemp(KtoF), cities);
// console.log(updtCities);

// currying

const firstCity = cities[0];
const updatedCity = updateTemp(KtoC, firstCity);
// console.log(updatedCity);

// we can simplyfy this weird call with Ramda curry function
// how to disappear the second pair of parents?

const totalCostReducer = (acc, city) => {
  const { cost = 0 } = city;
  return acc + cost;
};

const cityCount = R.length(updtCities);
const totalCost = R.reduce(totalCostReducer, 0, updtCities);
// console.log(totalCost / cityCount);

const groupByPropReducer = (acc, city) => {
  const { cost = [], internetSpeed = [] } = acc;
  return R.merge(acc, {
    cost: R.append(city.cost, cost),
    internetSpeed: R.append(city.internetSpeed, internetSpeed),
  });
};

// object for properties : cost and internetspeed
// using an empty object to create a new object

const groupedByProp = R.reduce(groupByPropReducer, {}, updtCities);

// console.log(groupedByProp);
