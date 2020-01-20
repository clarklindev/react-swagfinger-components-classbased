import React, { Component } from 'react';
import Checkbox from './Checkbox';
import classes from './CheckboxCollection.module.scss';
import InputContext from '../../../context/InputContext';

class CheckboxCollection extends Component {
  static contextType = InputContext;

  onChangeHandler = (index, isChecked, event) => {
    this.context.changed(
      { key: this.props.value[index].data.key, value: isChecked },
      this.props.name,
      index
    );
  };

  render() {
    return (
      <div className={classes.CheckboxCollection}>
        {this.props.elementconfig.options.map((each, index) => {
          return this.props.value[index] !== undefined ? (
            <Checkbox
              label={each.displaytext}
              checked={this.props.value[index].data.value}
              key={this.props.name + index}
              index={index}
              onChange={this.onChangeHandler}
            />
          ) : null;
        })}
      </div>
    );
  }
}

export default CheckboxCollection;
