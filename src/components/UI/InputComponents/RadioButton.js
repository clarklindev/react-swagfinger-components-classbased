import React, { Component } from 'react';
import classes from './RadioButton.module.scss';

class RadioButton extends Component {
  render() {
    return (
      <div className={[classes.RadioButton, this.props.className].join(' ')}>
        <label className={classes.Container}>
          <input
            type='radio'
            name={this.props.name}
            checked={this.props.checked}
            value={this.props.value}
            onChange={(event) => this.props.onChange(event.target.value)}
          />
          <span
            className={[classes.Checkmark, classes[this.props.type]].join(
              ' '
            )}></span>
          {this.props.label}
        </label>
      </div>
    );
  }
}
export default RadioButton;
