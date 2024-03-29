import React, { Component } from 'react';
import classes from './Textarea.module.scss';
import { stringHelper } from '../../../shared';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';

class Textarea extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = stringHelper.getUniqueClassNameString([
      classes.Textarea,
      Textarea.name
    ]);
  }
  render() {
    let error = null;
    let tempClasses = [];
    if (
      this.props.componentconfig.validation.isRequired &&
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
    return (
      <div className={classes.FlexGroupColumn}>
        <textarea
          className={[this.className, ...tempClasses].join(' ')}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          {...this.props.componentconfig}
          value={this.props.value.data}
          onChange={(event) =>
            this.context.changed('single', this.props.name, event.target.value)
          }
        />
        {error}
      </div>
    );
  }
}
export default Textarea;
