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
      console.log('isValid===false');
      validationClasses.push(classes.Invalid);
    }

    return (
      <React.Fragment>
        <div
          className={[
            classes.DraggableItem,
            ...extraClasses,
            ...validationClasses,
          ].join(' ')}
          onMouseDown={this.props.onMouseDown}
          onMouseUp={this.props.onMouseUp}>
          <div className={classes.Icon}>
            <Icon iconstyle='fas' code='grip-vertical' size='sm' />
          </div>
        </div>
        {this.props.children ? (
          <div className={classes.DraggableItemBody}>{this.props.children}</div>
        ) : null}
      </React.Fragment>
    );
  }
}

export default DraggableItem;
