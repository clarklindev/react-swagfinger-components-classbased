import React, { Component } from 'react';
import classes from './Checkbox.module.scss';

class Checkbox extends Component {
  render() {
    return (
      <div className={classes.Checkbox}>
        <label className={classes.Container}>
          <input
            type='checkbox'
            defaultChecked={this.props.checked}
            value={this.props.value}
            checked={this.props.checked}
            onChange={(event) => {
              this.props.onChange(
                this.props.index,
                event.target.checked,
                event
              );
            }}
          />
          <span className={[classes.Checkmark].join(' ')}></span>
          {this.props.label}
        </label>
      </div>
    );
  }
}

export default Checkbox;
