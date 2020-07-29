import React, { Component } from 'react';
import classes from './Label.module.scss';
class Label extends Component {
  render() {
    return <label className={classes.Label}>{this.props.children}</label>;
  }
}

export default Label;
