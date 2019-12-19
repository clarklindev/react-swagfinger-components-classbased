import React, { Component } from 'react';
import classes from './Toggle.module.scss';

class Toggle extends Component {
  render() {
    return (
      <div className={classes.Toggle}>
        <label className={classes.Switch}>
          <input type='checkbox' />
          <span className={[classes.Slider, classes.Round].join(' ')}></span>
        </label>
      </div>
    );
  }
}

export default Toggle;
