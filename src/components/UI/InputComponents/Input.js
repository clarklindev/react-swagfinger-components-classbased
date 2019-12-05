import React, { Component } from 'react';

import classes from './Input.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';

class Input extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Input,
      Input.name,
      this.props.className
    ]);

    this.inputClasses = [classes.InputElement];
  }
  render() {
    let tempClasses = [...this.inputClasses];
    if (
      this.props.elementtype !== 'multiinput' &&
      this.props.elementtype !== 'select' &&
      this.props.validation &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
    }
    return (
      <input
        className={[this.className, tempClasses].join(' ')}
        placeholder={this.props.placeholder}
        readOnly={this.props.readOnly}
        {...this.props.elementconfig}
        value={this.props.value.data}
        onChange={(event) => {
          console.log('props.name: ', this.props.name);
          this.context.changed(event, this.props.name);
        }}
      />
    );
  }
}

export default Input;
