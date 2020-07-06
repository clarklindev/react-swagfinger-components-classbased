import React, { Component } from 'react';
import classes from './Textarea.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';
import ErrorList from './ErrorList';

class Textarea extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Textarea,
      Textarea.name,
    ]);
  }
  render() {
    let error = null;
    let tempClasses = [];
    if (
      this.props.validation.required &&
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
            this.context.changed(event.target.value, this.props.name)
          }
        />
        {error}
      </div>
    );
  }
}
export default Textarea;
