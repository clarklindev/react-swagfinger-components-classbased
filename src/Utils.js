class Utils {
  static getClassNameString = (props) => {
    return [...new Set(props)]
      .filter((item) => item !== null && item !== undefined)
      .join(' ');
  };

  static getDistance = (pointA, pointB) => {
    return Math.sqrt(
      Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2)
    );
  };

  //relative to container
  static getClickPosition = (event) => {
    let clickX = event.pageX - event.target.offsetLeft;
    let clickY = event.pageY - event.target.offsetTop;
    let mouseClick = { x: clickX, y: clickY };
    console.log('scrollClick: ', clickX, clickY);
    return mouseClick;
  };

  static getClosestChildElement = (event, selector) => {
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
    let closestElement = Array.from(el.querySelectorAll(selector))[
      closestIndex
    ];
    console.log('closestElement: ', closestElement);
    return {
      value: closestElement,
      index: closestIndex,
    };
  };
}
export default Utils;
