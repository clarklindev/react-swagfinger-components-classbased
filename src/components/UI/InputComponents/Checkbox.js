import React, { Component } from 'react';
import classes from './Checkbox.module.scss';

class Checkbox extends Component {
  render() {
    return (
      <div className={classes.Checkbox}>
        <input type='checkbox' id={'checkbox' + this.props.name} />
        <label htmlFor={'checkbox' + this.props.name}>{this.props.label}</label>
      </div>
    );
  }
}

export default Checkbox;
