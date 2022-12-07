// get position of mouse/touch in relation to viewport
export const getPoint = function (e) {
  var scrollX =
      Math.max(
        0,
        window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0
      ) - (document.documentElement.clientLeft || 0),
    scrollY =
      Math.max(
        0,
        window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0
      ) - (document.documentElement.clientTop || 0),
    pointX = e ? Math.max(0, e.pageX || e.clientX || 0) - scrollX : 0,
    pointY = e ? Math.max(0, e.pageY || e.clientY || 0) - scrollY : 0;

  return { x: pointX, y: pointY };
};

// checks if mouse x/y is on top of an item
export const isOnTop = function (item, x, y) {
  var box = item.getBoundingClientRect(),
    isx = x > box.left && x < box.left + box.width,
    isy = y > box.top && y < box.top + box.height;
  return isx && isy;
};

//relative to container
export const getClickPosition = (event) => {
  let clickX = event.pageX - event.target.offsetLeft;
  let clickY = event.pageY - event.target.offsetTop;
  let mouseClick = { x: clickX, y: clickY };
  console.log('scrollClick: ', clickX, clickY);
  return mouseClick;
};
