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
