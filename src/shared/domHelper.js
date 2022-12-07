export const getClosestChildElement = (event, selector) => {
  let el = event.target;
  let mouseClick = this.getClickPosition(event);

  let distances = Array.from(el.querySelectorAll(selector)).map(
    (each, index) => {
      let sliderPosition = { x: each.offsetLeft, y: each.offsetTop };
      return this.getDistance(mouseClick, sliderPosition);
    }
  );

  //get min index = closest
  let closestIndex = distances.indexOf(Math.min(...distances));
  console.log('closestIndex: ', closestIndex);

  //closest Element
  let closestElement = Array.from(el.querySelectorAll(selector))[closestIndex];
  console.log('closestElement: ', closestElement);
  return {
    value: closestElement,
    index: closestIndex
  };
};
