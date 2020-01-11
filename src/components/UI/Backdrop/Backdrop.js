import React from 'react';
import classes from './Backdrop.module.scss';
import Utils from '../../../Utils';

const backdrop = (props) => {
  let classList = Utils.getClassNameString([
    classes.Backdrop,
    'Backdrop',
    props.className
  ]);

  return props.show ? (
    <div className={classList} onClick={props.onClick}></div>
  ) : null;
};

export default backdrop;
