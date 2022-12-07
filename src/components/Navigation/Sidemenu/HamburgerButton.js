import React from 'react';
import classes from './HamburgerButton.module.scss';
import { stringHelper } from '../../../shared';
import Icon from '../../UI/Icon/Icon';
const hamburgerButton = (props) => {
  let classList = stringHelper.getUniqueClassNameString([
    props.className,
    'HamburgerButton',
    classes.HamburgerButton
  ]);

  return (
    <div className={classList} onClick={props.onClick}>
      <Icon iconstyle="fas" code="bars" size="sm"></Icon>
    </div>
  );
};

export default hamburgerButton;
