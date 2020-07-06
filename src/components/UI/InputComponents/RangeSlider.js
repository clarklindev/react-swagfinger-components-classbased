import React, { Component } from 'react';
import classes from './RangeSlider.module.scss';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';

class RangeSlider extends Component {
  static contextType = InputContext;

  onChange = (event) => {
    let testValue = event.target.value;
    if (isNaN(testValue)) {
      testValue = '';
    }
    console.log('onChange testValue: ', testValue);
    this.context.changed(testValue, this.props.name);
  };
  onBlur = (event) => {
    let tempValue = event.target.value;

    if (tempValue < this.props.componentconfig.min && tempValue !== '') {
      tempValue = this.props.componentconfig.min;
    }
    if (tempValue > this.props.componentconfig.max && tempValue !== '') {
      tempValue = this.props.componentconfig.max;
    }
    if (isNaN(tempValue)) {
      tempValue = '';
    }
    if (tempValue === '') {
      tempValue = '';
    }
    console.log('tempValue: ', tempValue);
    this.context.changed(tempValue, this.props.name);
  };

  render() {
    let tempClasses = [];
    let error = null;
    if (
      this.props.validation &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      //console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
      error = <ErrorList value={{ data: this.props.value.errors }} />;
    }
    if (this.props.readOnly) {
      tempClasses.push(classes.ReadOnly);
    }

    return (
      <div className={classes.RangeSlider}>
        <div className={classes.FlexGroupRow}>
          <input
            type='range'
            className={[classes.Slider, ...tempClasses].join(' ')}
            min={this.props.componentconfig.min}
            max={this.props.componentconfig.max}
            step={this.props.componentconfig.step}
            value={this.props.value.data}
            onChange={(event) => this.onChange(event)}
          />
          <div className={classes.SliderValue}>
            <input
              className={[...tempClasses].join(' ')}
              min={this.props.componentconfig.min}
              max={this.props.componentconfig.max}
              value={this.props.value.data}
              onChange={(event) => this.onChange(event)}
              onBlur={(event) => {
                this.onBlur(event);
              }}
            />
          </div>
        </div>
        {error}
      </div>
    );
  }
}

export default RangeSlider;
