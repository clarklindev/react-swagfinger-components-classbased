import React, { Component } from 'react';
import classes from './RadioCollection.module.scss';
import RadioButton from './RadioButton';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';
class RadioCollection extends Component {
  static contextType = InputContext;

  onChangeHandler = (value) => {
    this.context.changed('single', this.props.name, value);
  };

  render() {
    let tempClasses = [];
    let error = null;
    if (
      this.props.componentconfig.hasOwnProperty('validation') &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      //console.log('pushing invalid: ');
      tempClasses.push('Invalid');
      error = <ErrorList value={{ data: this.props.value.errors }} />;
    }
    return (
      <div className={classes.RadioCollection}>
        {this.props.componentconfig.options.map((each, index) => {
          return this.props.value.data !== undefined ? (
            <RadioButton
              {...this.props}
              className={classes.RadioButton}
              type={[...tempClasses].join(' ')}
              key={this.props.name + index}
              name={this.props.name}
              value={each.value}
              checked={each.value === this.props.value.data ? true : false}
              label={each.displaytext}
              onChange={this.onChangeHandler}
            />
          ) : null;
        })}
        {error}
      </div>
    );
  }
}

export default RadioCollection;
