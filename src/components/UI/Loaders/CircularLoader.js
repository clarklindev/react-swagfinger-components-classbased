import React, { Component } from 'react';
import classes from './CircularLoader.module.scss';

class CircularLoader extends Component {
  render() {
    let progressClass = classes['Progress-' + this.props.progress];
    return (
      <div className={classes.CircularLoader}>
        <div className={[classes.PieWrapper, progressClass].join(' ')}>
          <span className={classes.Label}>
            {this.props.hidepercentage ? null : this.props.progress}
          </span>
          <div className={classes.Pie}>
            <div
              className={[classes.LeftSide, classes.HalfCircle].join(
                ' '
              )}></div>
            <div
              className={[classes.RightSide, classes.HalfCircle].join(
                ' '
              )}></div>
          </div>
        </div>
      </div>
    );
  }
}

export default CircularLoader;
