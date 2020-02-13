import classes from './Card.module.scss';
import React, { Component } from 'react';

class Card extends Component {
  render() {
    return <div className={classes.Card}>{this.props.children}</div>;
  }
}

export default Card;
