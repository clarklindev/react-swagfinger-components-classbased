import React, { Component } from 'react';
import * as align from '../../shared/align.module.scss';
import classes from './GroupHorizontal.module.scss';

class GroupHorizontal extends Component {
  render() {
    const spacingClasses = [];
    if (this.props.spacing === 'left') {
      spacingClasses.push(classes.Spacingleft);
    }
    if (this.props.spacing === 'right') {
      spacingClasses.push(classes.Spacingright);
    }
    return (
      <div
        className={[
          align.FlexStart,
          classes.GroupHorizontal,
          [...spacingClasses],
        ].join(' ')}
      >
        {this.props.children}
      </div>
    );
  }
}

export default GroupHorizontal;
