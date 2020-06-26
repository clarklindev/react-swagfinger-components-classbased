import React, { Component } from 'react';
import classes from './SelectToAccordion.module.scss';

class SelectToAccordion extends Component {
  render() {
    return <div className={classes.SelectToAccordion}>
      {this.props.children}
    </div>;
  }
}

export default SelectToAccordion;
