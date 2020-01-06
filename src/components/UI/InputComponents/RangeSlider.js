import React, { Component } from 'react';
import classes from './RangeSlider.module.scss';
import InputContext from '../../../context/InputContext';

class RangeSlider extends Component {
  static contextType = InputContext;

  onChange = (event) => {
    let testValue = parseInt(event.target.value);
    if (isNaN(testValue)) {
      testValue = '';
    }
    this.context.changed(testValue, this.props.name);
  };
  onBlur = (event) => {
    if (event.target.value <= this.props.elementconfig.min) {
      this.context.changed(this.props.elementconfig.min, this.props.name);
    }
    if (event.target.value >= this.props.elementconfig.max) {
      this.context.changed(this.props.elementconfig.max, this.props.name);
    }
    let tempValue = parseInt(event.target.value);
    if (isNaN(tempValue)) {
      tempValue = '';
    }
    if (tempValue < this.props.elementconfig.min) {
      tempValue = this.props.elementconfig.min;
    }
    if (tempValue > this.props.elementconfig.max) {
      tempValue = this.props.elementconfig.max;
    }
    this.context.changed(tempValue, this.props.name);
  };

  render() {
    return (
      <div className={classes.RangeSlider}>
        <input
          type='range'
          className={classes.Slider}
          min={this.props.elementconfig.min}
          max={this.props.elementconfig.max}
          step={this.props.elementconfig.step}
          value={this.props.value.data}
          onChange={(event) => this.onChange(event)}
        />
        <div className={classes.SliderValue}>
          <input
            min={this.props.elementconfig.min}
            max={this.props.elementconfig.max}
            value={this.props.value.data}
            onChange={(event) => this.onChange(event)}
            onBlur={(event) => {
              this.onBlur(event);
            }}
          />
        </div>
      </div>
    );
  }
}

export default RangeSlider;
