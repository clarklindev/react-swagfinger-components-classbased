import React, { Component } from 'react';

import classes from './InputFactory.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';

//components
import SelectWithInput from './SelectWithInput';
import MultiInput from './MultiInput';
import CheckboxCollection from './CheckboxCollection';

class InputFactory extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.inputClasses = [classes.InputElement];
    this.inputElement = null;
    this.label = null;
    this.className = Utils.getClassNameString([
      classes.InputFactory,
      'InputFactory'
    ]);
  }

  render() {
    //add Invalid class if...
    let tempClasses = [...this.inputClasses];
    if (
      this.props.data.elementtype !== 'multiinput' &&
      this.props.data.elementtype !== 'select' &&
      this.props.data.validation &&
      !this.props.data.value.valid &&
      (this.props.data.value.touched ||
        (!this.props.data.value.touched && !this.props.data.value.pristine))
    ) {
      console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
    }

    this.label = this.props.data.label ? (
      <label className={classes.Label}>{this.props.data.label}</label>
    ) : null;
    switch (this.props.data.elementtype) {
      case 'input':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <input
              className={tempClasses.join(' ')}
              placeholder={this.props.data.placeholder}
              {...this.props.data.elementconfig}
              value={this.props.data.value.data}
              onChange={(event) => {
                console.log('props.data.name: ', this.props.data.name);
                this.context.changed(event, this.props.data.name);
              }}
            />
          </div>
        );
        break;

      case 'textarea':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <textarea
              className={this.inputClasses.join(' ')}
              placeholder={this.props.data.placeholder}
              {...this.props.data.elementconfig}
              value={this.props.data.value.data}
              onChange={(event) =>
                this.context.changed(event, this.props.data.name)
              }
            />
          </div>
        );
        break;

      case 'select':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <select
              className={this.inputClasses.join(' ')}
              value={this.props.data.value.data}
              onChange={(event) =>
                this.context.changed(event, this.props.data.name)
              }>
              {this.props.data.elementconfig.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.displaytext}
                </option>
              ))}
            </select>
          </div>
        );
        break;
      case 'selectwithinput':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <SelectWithInput {...this.props.data} />
          </div>
        );
        break;

      case 'multiinput':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <MultiInput {...this.props.data} />
          </div>
        );
        break;
      case 'checkbox':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <CheckboxCollection {...this.props.data} />
          </div>
        );
        break;

      default:
        this.inputElement = <p>specify input type</p>;
        break;
    }
    return this.inputElement;
  }
}

export default InputFactory;
