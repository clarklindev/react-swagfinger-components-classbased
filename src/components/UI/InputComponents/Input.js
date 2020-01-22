import React, { Component } from 'react';

import classes from './Input.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';

class Input extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([classes.Input, Input.name]);
  }

  componentDidUpdate() {
    console.log('updated...', this.props.value.data);
  }
  render() {
    let tempClasses = [];
    let error = null;
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
      error = <ErrorList value={{ data: this.props.value.errors }} />;
    }
    if (this.props.readOnly) {
      tempClasses.push(classes.ReadOnly);
    }
    return (
      <React.Fragment>
        <input
          className={[this.className, tempClasses].join(' ')}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          {...this.props.elementconfig}
          value={this.props.value.data}
          onChange={(event) => {
            console.log('props.name: ', this.props.name);
            this.context.changed(event.target.value, this.props.name);
          }}
        />
        {error}
      </React.Fragment>
    );
  }
}

export default Input;
