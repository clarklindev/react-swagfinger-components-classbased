import React, { Component } from 'react';
import classes from './Textarea.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';

class Textarea extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Textarea,
      Textarea.name
    ]);
  }
  render() {
    let tempClasses = [];
    if (
      this.props.validation.required &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
    }
    return (
      <textarea
        className={[this.className, ...tempClasses].join(' ')}
        placeholder={this.props.placeholder}
        {...this.props.elementconfig}
        value={this.props.value.data}
        onChange={(event) =>
          this.context.changed(event.target.value, this.props.name)
        }
      />
    );
  }
}
export default Textarea;
