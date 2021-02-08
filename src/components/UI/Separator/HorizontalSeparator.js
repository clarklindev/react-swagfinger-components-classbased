import React, { Component } from 'react';
import classes from './HorizontalSeparator.module.scss';

class HorizontalSeparator extends Component {

  render() {
    let padding = null;
    if(this.props.padding ==='true'){
      padding = classes.Padding;
    }
    return (
      <div
        className={[
          classes.HorizontalSeparator,
          classes[this.props.class],
          padding,
        ].join(' ')}>
        {this.props.children ? (
          <React.Fragment>
            <div className={classes.DividerLine}></div>
            <div className={classes.CenterElement}>{this.props.children}</div>
            <div className={classes.DividerLine}></div>
          </React.Fragment>
        ) : <div className={classes.DividerLine}></div>}
      </div>
    );
  }
}

export default HorizontalSeparator;
