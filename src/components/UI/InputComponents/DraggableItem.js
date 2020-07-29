import React, { Component } from 'react';
import classes from './DraggableItem.module.scss';
import Icon from './Icon';

class DraggableItem extends Component {
  render() {
    let extraClasses = [];
    if (this.props.style) {
      extraClasses = this.props.style.map((each) => {
        return classes[each];
      });
    }

    let validationClasses = [];
    if (this.props.isValid === false) {
      validationClasses.push(classes.Invalid);
    }

    return (
      <div
        className={[
          classes.DraggableItem,
          ...extraClasses,
          ...validationClasses,
        ].join(' ')}
        onClick={this.props.onClick}>
        <div className={classes.Icon}>
          <Icon iconstyle='fas' code='grip-vertical' size='sm' />
        </div>
      </div>
    );
  }
}

export default DraggableItem;
