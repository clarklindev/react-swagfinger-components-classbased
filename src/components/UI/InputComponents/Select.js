import React, { Component } from 'react';
import classes from './Select.module.scss';
import Utils from '../../../Utils';
class Select extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([classes.Select, Select.name]);

    this.inputClasses = [classes.InputElement];
  }
  render() {
    return (
      <select
        className={this.className}
        value={this.props.value.data}
        onChange={(event) => this.context.changed(event, this.props.name)}>
        {this.props.elementconfig.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.displaytext}
          </option>
        ))}
      </select>
    );
  }
}

export default Select;
