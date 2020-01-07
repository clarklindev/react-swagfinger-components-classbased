import React, { Component } from 'react';
import classes from './Select.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';

class Select extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([classes.Select, Select.name]);
  }

  state = {
    selected: this.props.value.data,
    isOpen: false
  };

  onBlurHandler = () => {
    if (this.state.isOpen) {
      this.setState((prevState) => {
        // console.log('isOpen: ', false);
        return {
          isOpen: false
        };
      });
    }
  };
  onClickHandler = (event) => {
    this.setState((prevState) => {
      // console.log('isOpen: ', !this.state.isOpen);
      return {
        isOpen: !prevState.isOpen
      };
    });
  };

  onChangeHandler = (event) => {
    // console.log('onChange:', event.target.value);
    this.setState({
      selected: event.target.value
    });

    // The selected option element
    this.context.changed(event, this.props.name);
  };

  //the 'value' prop on <select> element instead of 'selected' on <option>
  render() {
    let tempClasses = [];
    if (this.state.isOpen) {
      tempClasses.push(classes.IsOpen);
    }

    return (
      <div className={this.className}>
        <select
          name={this.props.name}
          className={[...tempClasses].join('')}
          value={this.state.selected} //default value / selected value
          onChange={this.onChangeHandler}
          onClick={this.onClickHandler}
          onBlur={this.onBlurHandler}>
          {/* the placeholder will never be present on an update if this is a required input */}
          {/* <option value="" disabled>{this.props.elementconfig.placeholder}</option> */}
          {this.props.elementconfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displaytext}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default Select;