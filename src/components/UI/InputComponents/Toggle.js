import React, { Component } from 'react';
import classes from './Toggle.module.scss';
import InputContext from '../../../context/InputContext';

class Toggle extends Component {
  static contextType = InputContext;

  render() {
    return (
      <div className={classes.Toggle}>
        <label className={classes.Switch}>
          <input
            name={this.props.name}
            type='checkbox'
            defaultChecked={this.props.value.data}
            onChange={(event) => {
              this.context.changed(
                'single',
                this.props.name,
                event.target.checked
              );
            }}
          />
          <span className={[classes.Slider, classes.Round].join(' ')}></span>
        </label>
      </div>
    );
  }
}

export default Toggle;
