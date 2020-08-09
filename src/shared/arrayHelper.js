export const moveItemInArray = (arr, indexFrom, indexTo) => {
  if (indexFrom === indexTo) {
    return arr;
  }
  const newArray = [...arr];

  //item to move
  const targetEl = newArray[indexFrom];

  //which direction
  const incr = indexTo < indexFrom ? -1 : 1;

  for (let x = indexFrom; x !== indexTo; x += incr) {
    newArray[x] = newArray[x + incr];
  }

  newArray[indexTo] = targetEl;

  return newArray;
};

export const isEqual = (arr1, arr2) => {
  if (arr1 === undefined || arr2 === undefined) {
    return false;
  }
  if (arr1.length !== arr2.length) {
    return false;
  }
  //lengths equal
  arr1.forEach((val, index) => {
    if (val !== arr2[index]) {
      return false;
    }
  });

  return true;
};
