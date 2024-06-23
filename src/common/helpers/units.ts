/* eslint-disable no-sequences */
export const groupUnits = units => {
  units.sort(function(a, b) {
    var aSize = a.type;
    var bSize = b.type;
    var aLow = a.name;
    var bLow = b.name;
    if (aSize === bSize) {
      return aLow < bLow ? -1 : aLow > bLow ? 1 : 0;
    } else {
      return aSize < bSize ? -1 : 1;
    }
  });

  const data = { Statewide: [] };

  units.forEach(element => {
    if (element.region.name === "Statewide") {
      data.Statewide.push(element);
    }
  });

  units.forEach(element => {
    if (!data[element.region.name]) {
      data[element.region.name] = [];
    }
    if (element.region.name !== "Statewide") {
      data[element.region.name].push(element);
    }
  });
  Object.keys(data).forEach(key => {
    if (data[key].length === 0) {
      delete data[key];
    }
  });
  var resultHash = {};
  if (data["Statewide"]) {
    resultHash["Statewide"] = data["Statewide"];
    delete data["Statewide"];
  }
  return { ...resultHash, ...sortObjectByKeys(data) };
};

function sortObjectByKeys(o) {
  return Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});
}
