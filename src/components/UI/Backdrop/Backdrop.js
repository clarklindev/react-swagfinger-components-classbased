import React from 'react';
import classes from './Backdrop.module.scss';
import { stringHelper } from '../../../shared';

const backdrop = (props) => {
  let classList = stringHelper.getUniqueClassNameString([
    classes.Backdrop,
    'Backdrop',
    props.className
  ]);

  return props.show ? (
    <div className={classList} onClick={props.onClick}></div>
  ) : null;
};

export default backdrop;
