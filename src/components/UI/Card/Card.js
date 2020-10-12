import classes from './Card.module.scss';
import React, { Component } from 'react';
import Divider from './Divider';

class Card extends Component {
  render() {
    let styleClasses = [];
    if (this.props.style) {
      styleClasses = this.props.style.map((each) => {
        return classes[each];
      });
      console.log('Card style classes:', styleClasses);
    }

    return this.props.hide ? null : (
      <div
        className={[
          classes.Card,
          this.props.className,
          ...styleClasses,
          classes[this.props.type],
        ].join(' ')}>
        {this.props.header ? (
          <React.Fragment>
            <div className={classes.CardHeader}>{this.props.header}</div>
            <Divider type='Horizontal'></Divider>
          </React.Fragment>
        ) : null}

        {this.props.children ? (
          <div className={classes.CardBody}>{this.props.children}</div>
        ) : null}

        {this.props.footer ? (
          <React.Fragment>
            <Divider type='Horizontal'></Divider>
            <div className={classes.CardFooter}>{this.props.footer}</div>
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default Card;
