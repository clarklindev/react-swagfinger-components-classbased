import React from 'react';

import classes from './Button.module.scss';
import Utils from '../../../Utils';

const button = (props) => {
  let classList = Utils.getClassNameString([
    classes.Button,
    'Button',
    classes[props.btnType],
    props.className
  ]);

  return (
    <button
      disabled={props.disabled}
      className={classList}
      onClick={props.onClick}
      onBlur={props.onBlur}
      onMouseOver={props.onMouseOver}>
      {props.children}
    </button>
  );
};

export default button;
