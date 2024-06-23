export const groupLiaisons = liaisons => {
  liaisons.sort(function(a, b) {
    var aSize = a.county;
    var bSize = b.county;
    var aLow = a.state;
    var bLow = b.state;
    if (aSize === bSize) {
      return aLow < bLow ? -1 : aLow > bLow ? 1 : 0;
    } else {
      return aSize < bSize ? -1 : 1;
    }
  });
  const data = {};
  liaisons.forEach(element => {
    if (!data[element.county]) {
      data[element.county] = [];
    }
    data[element.county].push(element);
  });
  return data;
};
