import React, { Component } from 'react';
import classes from './FlexRow.module.scss';
import * as alignClasses from '../../shared/alignFlex';

class FlexRow extends Component {
  render() {
    const spacingClasses = [];
    if (this.props.spacing === 'left') {
      spacingClasses.push(classes.Spacingleft);
    }
    if (this.props.spacing === 'right') {
      spacingClasses.push(classes.Spacingright);
    }
    if (this.props.spacing === 'top') {
      spacingClasses.push(classes.Spacingtop);
    }
    if (this.props.spacing === 'bottom') {
      spacingClasses.push(classes.Spacingbottom);
    }

    const justifyContent = alignClasses.justifyContent(
      this.props.justifyContent
    );
    const alignItems = alignClasses.alignItems(this.props.alignItems);
    const alignContent = alignClasses.alignContent(this.props.alignContent);
    const alignSelf = alignClasses.alignSelf(this.props.alignSelf);
    const flexShrink = this.props.flexShrink ? classes.Flexshrink : null;
    const flexGrow = this.props.flexGrow ? classes.Flexgrow : null;
    return (
      <div
        className={[
          classes.FlexRow,
          justifyContent,
          alignItems,
          alignContent,
          alignSelf,
          flexGrow,
          flexShrink,
          [...spacingClasses],
        ].join(' ')}
      >
        {this.props.children}
      </div>
    );
  }
}

export default FlexRow;
