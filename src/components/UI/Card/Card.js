import classes from './Card.module.scss';
import React, { Component } from 'react';

class Card extends Component {
  render() {
    return this.props.hide ? null : (
      <div className={[classes.Card, this.props.className].join(' ')}>
        {this.props.children}
      </div>
    );
  }
}

export default Card;
