import React from 'react';

import classes from './Button.module.scss';
import Utils from '../../../Utils';

const button = props => {
  let classList = Utils.getClassNameString([
    classes.Button,
    'Button',
    classes[props.btnType]
  ]);

  return (
    <button
      disabled={props.disabled}
      className={classList}
      onClick={props.clicked}>
      {props.children}
    </button>
  );
};

export default button;
