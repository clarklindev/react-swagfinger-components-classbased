import React, { Component } from 'react';
import classes from './Select.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';
import PropTypes from 'prop-types';

class Select extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([classes.Select, Select.name]);
  }

  state = {
    isOpen: false,
  };

  onBlurHandler = () => {
    if (this.state.isOpen) {
      this.setState((prevState) => {
        // console.log('isOpen: ', false);
        return {
          isOpen: false,
        };
      });
    }
  };
  onClickHandler = (event) => {
    //console.log('SELECT onClickHandler..');
    this.setState((prevState) => {
      // console.log('isOpen: ', !this.state.isOpen);
      return {
        isOpen: !prevState.isOpen,
      };
    });
  };

  onChangeHandler = (event) => {
    console.log('SELECT onChangeHandler...');
    // The selected option element
    this.context.changed('single', this.props.name, event.target.value);
  };

  //the 'value' prop on <select> element instead of 'selected' on <option>
  render() {
    let tempClasses = [];
    if (this.state.isOpen) {
      tempClasses.push(classes.IsOpen);
    }

    let error = null;
    if (
      this.props.componentconfig.validation &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      //console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
      error = <ErrorList value={{ data: this.props.value.errors }} />;
    }
    if (this.props.readOnly) {
      tempClasses.push(classes.ReadOnly);
    }

    return this.props.value ? (
      <div className={this.className}>
        <select
          name={this.props.name}
          className={[...tempClasses].join(' ')}
          value={this.props.value.data}
          onChange={
            this.props.onChange ? this.props.onChange : this.onChangeHandler
          }
          onClick={this.onClickHandler}
          onBlur={this.onBlurHandler}>
          {/* the placeholder will never be present on an update if this is a required input */}
          <option key='placeholder' value='' disabled>
            {this.props.componentconfig.placeholder}
          </option>

          {this.props.componentconfig.options.map(({ value, displaytext }) => (
            <option key={value} value={value}>
              {displaytext}
            </option>
          ))}
        </select>
        {error}
      </div>
    ) : null;
  }
}

Select.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  validation: PropTypes.object,
  value: PropTypes.shape({
    valid: PropTypes.bool,
    touched: PropTypes.bool,
    pristine: PropTypes.bool,
    data: PropTypes.string,
    errors: PropTypes.array,
  }),
  readOnly: PropTypes.bool,
  componentconfig: PropTypes.shape({
    options: PropTypes.array,
    placeholder: PropTypes.string,
  }),
};

Select.defaultProps = {
  name: 'select',
  label: 'Select',
  validation: { isRequired: false },
  value: {
    valid: false,
    touched: false,
    pristine: true,
    data: '',
    errors: [],
  },
  readOnly: false,
  componentconfig: {
    options: [
      { value: '1', displaytext: '1' },
      { value: '2', displaytext: '2' },
      { value: '3', displaytext: '3' },
    ],
  },
  placeholder: 'placeholder text',
};

export default Select;
