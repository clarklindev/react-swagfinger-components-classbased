import React, { PureComponent } from 'react';

import classes from './Input.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';

class Input extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Input,
      Input.name,
      classes[props.type],
      'Input',
      props.className,
    ]);
  }
  state = {
    value: '',
  };

  componentDidUpdate() {
    //console.log('updated...', this.props.value.data);
    if (this.props.value !== this.state.value) {
      this.setState({ value: this.props.value.data });
    }
  }

  inputChangeHandler = (event) => {
    if (this.props.onChange) {
      console.log('CALL PARENT ONCHANGE...');
      this.props.onChange(event);
    } else {
      this.context.changed(
        this.props.type,
        this.props.name,
        event.target.value
      );
    }
  };
  render() {
    let tempClasses = [];
    let error = null;
    //props
    const {
      validation,
      value,
      readOnly,
      placeholder,
      componentconfig,
    } = this.props;

    if (
      validation &&
      !value.valid &&
      (value.touched || (!value.touched && !value.pristine))
    ) {
      // console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
      error = <ErrorList value={{ data: value.errors }} />;
    }
    if (readOnly) {
      tempClasses.push(classes.ReadOnly);
    }
    return (
      <React.Fragment>
        <div className={classes.FlexGroupColumn}>
          <input
            className={[this.className, tempClasses].join(' ')}
            placeholder={this.props.componentconfig.placeholder} //needed for multiinput ...props
            readOnly={readOnly}
            name={this.props.name}
            type={this.props.componentconfig.type}
            value={this.state.value} //receives an object with {data: value} property
            onChange={this.inputChangeHandler}
            title={value.data}
          />
          {error}
        </div>
      </React.Fragment>
    );
  }
}

export default Input;
