import React, { Component } from 'react';
import classes from './FlexColumn.module.scss';
import * as alignClasses from '../../shared/alignFlex';

class FlexColumn extends Component {
  render() {
    const spacingClasses = [];
    if (this.props.spacing === 'left') {
      spacingClasses.push(classes.SpacingLeft);
    }
    if (this.props.spacing === 'right') {
      spacingClasses.push(classes.SpacingRight);
    }
    if (this.props.spacing === 'top') {
      spacingClasses.push(classes.SpacingTop);
    }
    if (this.props.spacing === 'bottom') {
      spacingClasses.push(classes.SpacingBottom);
    }
    
    //children spacing
    if (this.props.spacingchildren === 'left') {
      spacingClasses.push(classes.SpacingChildrenLeft);
    }
    if (this.props.spacingchildren === 'right') {
      spacingClasses.push(classes.SpacingChildrenRight);
    }
    if (this.props.spacingchildren === 'top') {
      spacingClasses.push(classes.SpacingChildrenTop);
    }
    if (this.props.spacingchildren === 'bottom') {
      spacingClasses.push(classes.SpacingChildrenBottom);
    }
    if (this.props.spacingchildren === 'bottom-notlast') {
      spacingClasses.push(classes.SpacingChildrenBottomNotLast);
    }

    const justifyContent = alignClasses.justifyContent(
      this.props.justifycontent
    );
    const alignItems = alignClasses.alignItems(this.props.alignItems);
    const alignContent = alignClasses.alignContent(this.props.alignContent);
    const alignSelf = alignClasses.alignSelf(this.props.alignSelf);
    const flexShrink =
      this.props.flexshrink === 'true' ? classes.Flexshrink : null;
    const flexGrow = this.props.flexgrow === 'true' ? classes.Flexgrow : null;
    let padding = null;
    if(this.props.padding === 'true'){
      padding = classes.Padding;
    }
    if(this.props.padding === 'not-bottom'){
      padding = classes.PaddingNotBottom;
    }


    return (
      <div
        className={[
          classes.FlexColumn,
          justifyContent,
          alignItems,
          alignContent,
          alignSelf,
          flexGrow,
          flexShrink,
          padding,
          ...spacingClasses,
        ].join(' ')}
        {...this.props}>
        {this.props.children}
      </div>
    );
  }
}

export default FlexColumn;
