import React, { Component } from 'react';
import classes from './Divider.module.scss';

class Divider extends Component {
  render() {
    return (
      <div
        className={[classes.Divider, classes[this.props.type]].join(' ')}></div>
    );
  }
}

export default Divider;
