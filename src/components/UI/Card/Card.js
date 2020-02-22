import classes from './Card.module.scss';
import React, { Component } from 'react';
import Divider from './Divider';

class Card extends Component {
  render() {
    return this.props.hide ? null : (
      <div
        className={[
          classes.Card,
          this.props.className,
          classes[this.props.type]
        ].join(' ')}>
        {this.props.header ? (
          <React.Fragment>
            <div className={classes.CardHeader}>{this.props.header}</div>
            <Divider type='Horizontal'></Divider>
          </React.Fragment>
        ) : null}

        <div className={classes.CardBody}>{this.props.children}</div>

        {this.props.footer ? (
          <React.Fragment>
            <div className={classes.CardFooter}>{this.props.footer}</div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default Card;
