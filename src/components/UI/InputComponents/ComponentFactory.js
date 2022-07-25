import React, { Component } from 'react';

import classes from './ComponentFactory.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';

//components
import MultiSelectWithInput from './MultiSelectWithInput';
import MultiInput from './MultiInput';
import MultiInputObjects from './MultiInputObjects';
import CheckboxCollection from './CheckboxCollection';
import RadioCollection from './RadioCollection';
import Select from './Select';
import Textarea from './Textarea';
import Input from './Input';
import Datepicker from './Datepicker';
import Toggle from './Toggle';
import GalleryManager from './GalleryManager';
//import Upload from '../Upload/Upload';
import UploadDrop from '../Upload/UploadDrop';
import Counter from './Counter';
import RangeSlider from './RangeSlider';
import MultiRangeSlider from './MultiRangeSlider';
import InputSearch from './InputSearch';
import InputPassword from './InputPassword';
import InputWithIcon from './InputWithIcon';
import List from './List';
import Label from '../Headers/Label';
import InputWithInput from './InputWithInput';
import ErrorList from './ErrorList';
class ComponentFactory extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.inputClasses = [classes.InputElement];
    this.inputElement = null;
    this.label = null;
    this.className = Utils.getClassNameString([
      classes.ComponentFactory,
      'ComponentFactory',
    ]);
  }

  render() {
    //add Invalid class if...
    switch (this.props.data.component) {
      case 'input':
        this.inputElement = <Input {...this.props.data} />;
        break;
      case 'inputsearch':
        this.inputElement = <InputSearch {...this.props.data} />;
        break;
      case 'inputpassword':
        this.inputElement = <InputPassword {...this.props.data} />;
        break;
      case 'inputwithicon':
        this.inputElement = <InputWithIcon {...this.props.data} />;
        break;
      case 'textarea':
        this.inputElement = <Textarea {...this.props.data} />;
        break;
      case 'datepicker':
        this.inputElement = <Datepicker {...this.props.data} />;
        break;
      case 'radio':
        this.inputElement = <RadioCollection {...this.props.data} />;
        break;
      case 'select':
        this.inputElement = <Select {...this.props.data} />;
        break;
      case 'multiselectwithinput':
        this.inputElement = <MultiSelectWithInput {...this.props.data} />;
        break;
      case 'inputwithinput':
        this.inputElement = <InputWithInput {...this.props.data} />;
        break;
      case 'multiinput':
        this.inputElement = <MultiInput {...this.props.data} />;
        break;
      case 'multiinputobjects':
        this.inputElement = <MultiInputObjects {...this.props.data} />;
        break;
      case 'checkbox':
        this.inputElement = <CheckboxCollection {...this.props.data} />;
        break;
      case 'counter':
        this.inputElement = <Counter {...this.props.data} />;
        break;
      case 'rangeslider':
        this.inputElement = <RangeSlider {...this.props.data} />;
        break;
      case 'multirangeslider':
        this.inputElement = <MultiRangeSlider {...this.props.data} />;
        break;
      case 'toggle':
        this.inputElement = <Toggle {...this.props.data} />;
        break;
      case 'gallerymanager':
        this.inputElement = <GalleryManager {...this.props.data} />;
        break;
      // case 'upload':
      //   this.inputElement = <Upload {...this.props.data} />;
      //   break;
      case 'uploaddrop':
        this.inputElement = <UploadDrop {...this.props.data} />;
        break;
      case 'list':
        this.inputElement = <List {...this.props.data} />;
        break;
      case 'errorlist':
        this.inputElement = <ErrorList {...this.props.data} />;
        break;
      case 'raw': //custom html passed to data property
        this.inputElement = this.props.data.value;
        break;
      default:
        this.inputElement = <p>specify input type</p>;
        break;
    }

    this.label = this.props.data ? (
      <Label>{this.props.data.label}</Label>
    ) : null;

    return (
      <div className={this.className}>
        {this.label}
        {this.inputElement}
      </div>
    );
  }
}

export default ComponentFactory;
