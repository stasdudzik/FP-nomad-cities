const R = require("ramda");
const fs = require("fs");
const table = require("text-table");
const percentile = require("./percentile.js");
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

const calcScore = (city) => {
  const { cost = 0, internetSpeed = 0 } = city;
  const costPercentile = percentile(groupedByProp.cost, cost);
  const internetSpeedPercentile = percentile(
    groupedByProp.internetSpeed,
    internetSpeed
  );
  const score = 100 * (1.0 - costPercentile) + 20 * internetSpeedPercentile;
  return R.merge(city, { score });
};

// take a look at arguments order pattern in ramda
const scoredCities = R.map(calcScore, updtCities);
// console.log(scoredCities);

// filter temperature and humidity

const filterByWeather = (city) => {
  const { temp = 0, humidity = 0 } = city;
  return temp > 68 && temp < 85 && humidity > 30 && humidity < 70;
};

const filteredCities = R.filter(filterByWeather, scoredCities);

// console.log(R.length(filteredCities));

const sortedCities = R.sortWith(
  [R.descend((city) => city.score)],
  filteredCities
);

// console.log(sortedCities);

const top10 = R.take(10, sortedCities);

// console.log(top10);
// console.log(R.length(top10));

console.log("********************");

/* pure functions so far 
-reusable
-easy to test
-easy to cache
-composable - good to create new functions
  - composition meaning: composing functions of smaller functions
  - makePie example
  - composed functions work from right to left 
  - pipe reverse that order (why both pipe and compose?)
*/

const cityToArray = (city) => {
  const { name, country, score, cost, temp, internetSpeed } = city;
  return [name, country, score, cost, temp, internetSpeed];
};

// composing a new function with R.pipe(pureFn1, pureFn2)

const interestingProps = [
  "name",
  "country",
  "score",
  "cost",
  "temp",
  "internetSpeed",
];
const topCities = R.pipe(
  R.map(updateTemp(KtoF)),
  R.filter(filterByWeather),
  R.map(calcScore),
  R.sortWith([R.descend((city) => city.score)]),
  R.take(10),
  R.map(cityToArray),
  R.prepend(interestingProps),
  table
)(cities);

console.log(topCities);
