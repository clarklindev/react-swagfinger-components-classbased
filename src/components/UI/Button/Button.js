import React from 'react';

import classes from './Button.module.scss';
import Utils from '../../../Utils';

const button = (props) => {
  let classList = Utils.getClassNameString([
    classes.Button,
    'Button',
    classes[props.type],
    classes[props.color],
    props.className,
    classes[props.className]
  ]);

  return (
    <button
      tabIndex={props.tabIndex}
      // ref={props.reference}
      disabled={props.disabled}
      className={classList}
      onClick={props.onClick}
      onBlur={props.onBlur}
      title={props.title}
      onMouseOver={props.onMouseOver}
      onMouseOut={props.onMouseOut}
    >
      {props.children}
    </button>
  );
};

export default button;
