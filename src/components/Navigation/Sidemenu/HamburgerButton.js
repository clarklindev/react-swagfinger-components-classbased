import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classes from './HamburgerButton.module.scss';
import Utils from '../../../Utils';

const hamburgerButton = props => {
  let classList = Utils.getClassNameString([
    props.className,
    'HamburgerButton',
    classes.HamburgerButton
  ]);

  return (
    <div className={classList} onClick={props.clicked}>
      <FontAwesomeIcon icon={['fas', 'bars']} />
    </div>
  );
};

export default hamburgerButton;
