import React, { Component } from 'react';

import classes from './ComponentFactory.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';

//components
import MultiSelectWithInput from './MultiSelectWithInput';
import MultiInput from './MultiInput';
import CheckboxCollection from './CheckboxCollection';
import RadioCollection from './RadioCollection';
import Select from './Select';
import Textarea from './Textarea';
import Input from './Input';
import Datepicker from './Datepicker';
import Toggle from './Toggle';
import Upload from '../Upload/Upload';
import Counter from './Counter';
import RangeSlider from './RangeSlider';
import MultiRangeSlider from './MultiRangeSlider';

class ComponentFactory extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.inputClasses = [classes.InputElement];
    this.inputElement = null;
    this.label = null;
    this.className = Utils.getClassNameString([
      classes.ComponentFactory,
      'ComponentFactory'
    ]);
  }

  render() {
    //add Invalid class if...

    switch (this.props.data.elementtype) {
      case 'input':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <Input {...this.props.data} />
          </div>
        );
        break;

      case 'textarea':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <Textarea {...this.props.data} />
          </div>
        );
        break;

      case 'datepicker':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <Datepicker {...this.props.data} />
          </div>
        );
        break;

      case 'radio':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <RadioCollection {...this.props.data} />
          </div>
        );
        break;

      case 'select':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <Select {...this.props.data} />
          </div>
        );
        break;

      case 'selectwithinput':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <MultiSelectWithInput {...this.props.data} />
          </div>
        );
        break;

      case 'multiinput':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <MultiInput {...this.props.data} />
          </div>
        );
        break;

      case 'checkbox':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <CheckboxCollection {...this.props.data} />
          </div>
        );
        break;

      case 'counter':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <Counter {...this.props.data} />
          </div>
        );
        break;

      case 'rangeslider':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <RangeSlider {...this.props.data} />
          </div>
        );
        break;

      case 'multirangeslider':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <MultiRangeSlider {...this.props.data} />
          </div>
        );
        break;

      case 'toggle':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <Toggle {...this.props.data} />
          </div>
        );
        break;

      case 'upload':
        this.inputElement = (
          <div className={this.className}>
            {this.label}
            <Upload {...this.props.data} />
          </div>
        );
        break;

      default:
        this.inputElement = <p>specify input type</p>;
        break;
    }

    this.label = this.props.data.label ? (
      <label className={classes.Label}>{this.props.data.label}</label>
    ) : null;

    return this.inputElement;
  }
}

export default ComponentFactory;
