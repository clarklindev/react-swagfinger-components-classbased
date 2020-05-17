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
      props.className
    ]);
  }

  componentDidUpdate() {
    //console.log('updated...', this.props.value.data);
  }

  inputChangeHandler = (event) => {
    if (this.props.onChange) {
      console.log('CALL PARENT ONCHANGE...');
      this.props.onChange(event);
    } else {
      //console.log('props.name: ', this.props.name);
      this.context.changed(event.target.value, this.props.name);
    }
  };
  render() {
    let tempClasses = [];
    let error = null;
    if (
      this.props.validation &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      // console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
      error = <ErrorList value={{ data: this.props.value.errors }} />;
    }
    if (this.props.readOnly) {
      tempClasses.push(classes.ReadOnly);
    }
    return (
      <React.Fragment>
        <div className={classes.FlexGroupColumn}>
          <input
            className={[this.className, tempClasses].join(' ')}
            placeholder={this.props.placeholder}
            readOnly={this.props.readOnly}
            {...this.props.elementconfig}
            value={this.props.value.data}
            onChange={this.inputChangeHandler}
          />
          {error}
        </div>
      </React.Fragment>
    );
  }
}

export default Input;
