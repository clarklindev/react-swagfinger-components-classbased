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
    return (
      <div className={[classes.DraggableItem, ...extraClasses].join(' ')}>
        <div className={classes.Icon}>
          <Icon iconstyle='fas' code='grip-vertical' size='sm' />
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default DraggableItem;
