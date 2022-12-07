import React, { PureComponent } from 'react';

import classes from './Input.module.scss';
import { stringHelper } from '../../../shared';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';
import PropTypes from 'prop-types';

class Input extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = stringHelper.getUniqueClassNameString([
      classes.Input,
      Input.name,
      classes[props.type],
      'Input',
      props.className,
      props.classlist
    ]);
  }
  state = {
    value: ''
  };

  componentDidMount() {
    //console.log('updated...', this.props.value.data);
    if (this.props.value !== this.state.value) {
      //console.log('value not same: ', this.props.value);
      this.setState({ value: this.props.value.data });
    }
  }

  componentDidUpdate() {
    // console.log('updated...', this.props.value.data);
    if (this.props.value !== this.state.value) {
      //console.log('value not same: ', this.props.value);
      this.setState({ value: this.props.value.data });
    }
  }

  inputChangeHandler = (event) => {
    if (this.props.onChange) {
      console.log('CALL PROP ONCHANGE...');
      this.props.onChange(event);
    } else {
      console.log('CALL CONTEXT ONCHANGE...');
      this.context.changed(
        this.props.type,
        this.props.name,
        event.target.value
      );
    }
  };
  render() {
    let styleClasses = [];
    if (this.props.style) {
      styleClasses = this.props.style.map((each) => {
        return classes[each];
      });
    }

    let tempClasses = [];

    let error = null;
    //props

    if (this.props.componentconfig.validation !== undefined) {
      if (
        this.props.componentconfig.validation.hasOwnProperty('isRequired') &&
        this.props.value.valid === false &&
        (this.props.value.touched === true ||
          (this.props.value.touched === false &&
            this.props.value.pristine === false))
      ) {
        console.log('pushing invalid: ');
        tempClasses.push(classes.Invalid);
        error = this.props.value.errors.length ? (
          <ErrorList value={{ data: this.props.value.errors }} />
        ) : null;
      }
    }

    if (this.props.readOnly) {
      tempClasses.push(classes.ReadOnly);
    }
    return (
      <div className={classes.Input}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input
            className={[...tempClasses, ...styleClasses].join(' ')}
            placeholder={this.props.componentconfig.placeholder} //needed for multiinput ...props
            readOnly={this.props.readOnly}
            name={this.props.name}
            type={this.props.componentconfig.type}
            value={this.state.value} //receives an object with {data: value} property
            onChange={this.inputChangeHandler}
            title={this.props.value.data}
          />
        </div>
        {error}
      </div>
    );
  }
}

Input.defaultProps = {
  name: 'input',
  label: 'Input',
  componentconfig: PropTypes.shape({
    placeholder: '',
    type: PropTypes.string,
    validation: {
      isRequired: false
    }
  }),
  value: {
    valid: false,
    touched: false,
    pristine: true,
    data: '',
    errors: []
  }
};

export default Input;
