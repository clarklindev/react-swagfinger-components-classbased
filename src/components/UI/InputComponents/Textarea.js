import React, { Component } from 'react';
import classes from './Textarea.module.scss';
import Utils from '../../../Utils';

class Textarea extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Textarea,
      Textarea.name
    ]);

    this.inputClasses = [classes.InputElement];
  }
  render() {
    return (
      <textarea
        className={this.inputClasses.join(' ')}
        placeholder={this.props.placeholder}
        {...this.props.elementconfig}
        value={this.props.value.data}
        onChange={(event) => this.context.changed(event, this.data.name)}
      />
    );
  }
}
export default Textarea;
