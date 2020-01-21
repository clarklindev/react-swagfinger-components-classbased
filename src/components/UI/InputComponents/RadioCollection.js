import React, { Component } from 'react';
import classes from './RadioCollection.module.scss';
import RadioButton from './RadioButton';
import InputContext from '../../../context/InputContext';

class RadioCollection extends Component {
  static contextType = InputContext;

  onChangeHandler = (value) => {
    this.context.changed(value, this.props.name);
  };

  render() {
    return (
      <div className={classes.RadioCollection}>
        {this.props.elementconfig.options.map((each, index) => {
          return this.props.value.data !== undefined ? (
            <RadioButton
              {...this.props}
              key={this.props.name + index}
              className={classes.RadioButton}
              name={this.props.name}
              value={each.value}
              checked={each.value === this.props.value.data ? true : false}
              label={each.displaytext}
              onChange={this.onChangeHandler}
            />
          ) : null;
        })}
      </div>
    );
  }
}

export default RadioCollection;
