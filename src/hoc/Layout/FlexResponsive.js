import classes from './FlexResponsive.module.scss';
import React, { Component } from 'react';

class FlexResponsive extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className={classes.FlexResponsive}>{this.props.children}</div>;
  }
}

export default FlexResponsive;
