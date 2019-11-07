import React from 'react';
import classes from './Modal.module.scss';
import Backdrop from '../Backdrop/Backdrop';

const modal = props => (
  <React.Fragment>
    <Backdrop show={props.show} />
    <div
      className={classes.Modal}
      style={{
        display: props.show ? 'block' : 'none'
      }}>
      {props.children}
    </div>
  </React.Fragment>
);

export default modal;
