import React, { Component } from 'react';
import classes from './HorizontalSeparator.module.scss';

class HorizontalSeparator extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div
        className={[
          classes.HorizontalSeparator,
          classes[this.props.style],
          this.props.children ? classes.WithChildren : null,
        ].join(' ')}>
        {this.props.children}
      </div>
    );
  }
}

HorizontalSeparator.defaultProps = {
  style: 'Solid',
};

export default HorizontalSeparator;
