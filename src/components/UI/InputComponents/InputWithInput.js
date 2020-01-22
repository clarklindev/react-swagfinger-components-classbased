import React, { Component } from 'react';
import classes from './InputWithInput.module.scss';

class InputWithInput extends Component {
  render() {
    let extraClasses = [];
    if (this.props.readOnly) {
      extraClasses.push(classes.ReadOnly);
    }
    return (
      <div className={classes.InputWithInput}>
        <div className={classes.InputAndInputWrapper}>
          <input
            className={[...extraClasses].join(' ')}
            value={this.props.attribute}
            readOnly={this.props.readOnly}
          />
          <div className={classes.Divider} />
          <input
            className={[...extraClasses].join(' ')}
            value={this.props.value}
            readOnly={this.props.readOnly}
          />
        </div>
      </div>
    );
  }
}
export default InputWithInput;
