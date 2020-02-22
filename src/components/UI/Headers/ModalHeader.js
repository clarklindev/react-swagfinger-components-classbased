import React from 'react';
import classes from './ModalHeader.module.scss';

const modalHeader = (props) => {
  return (
    <div className={classes.ModalHeader}>
      <h3>{props.children}</h3>
    </div>
  );
};

export default modalHeader;
