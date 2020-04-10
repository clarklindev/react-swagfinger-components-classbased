import React, { Component } from 'react';
import classes from './CircularLoader.module.scss';
import Icon from '../InputComponents/Icon';
class CircularLoader extends Component {
  render() {
    let progressClass = classes['Progress-' + this.props.progress];
    return (
      <div className={classes.CircularLoader}>
        {this.props.progress < 100 ? (
          <div className={[classes.PieWrapper, progressClass].join(' ')}>
            <span className={classes.Label}>
              {this.props.hidepercentage ? null : this.props.progress}
            </span>

            <div className={classes.Pie}>
              <div
                className={[classes.LeftSide, classes.HalfCircle].join(' ')}
              ></div>
              <div
                className={[classes.RightSide, classes.HalfCircle].join(' ')}
              ></div>
            </div>
          </div>
        ) : (
          <Icon
            type="WithRoundBorder"
            iconstyle="fas"
            code="check"
            size="sm"
            width={this.props.width}
            height={this.props.height}
          ></Icon>
        )}
      </div>
    );
  }
}

export default CircularLoader;
