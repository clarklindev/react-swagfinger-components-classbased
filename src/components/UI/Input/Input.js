import React from 'react';

import classes from './Input.module.scss';
import Utils from '../../../Utils';

const input = (props) => {
  let inputElement = null;
  let label = null;
  const inputClasses = [classes.InputElement];

  const className = Utils.getClassNameString([
    classes.Input,
    'Input',
    props.className
  ]);

  if (props.invalid && props.shouldValidate && props.touched) {
    inputClasses.push(classes.Invalid);
  }

  switch (props.elementType) {
    case 'input':
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          placeholder={props.placeholder}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case 'textarea':
      inputElement = (
        <textarea
          className={inputClasses.join(' ')}
          placeholder={props.placeholder}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          value={props.value}
          onChange={props.changed}>
          {props.elementConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          {...props.elementConfig}
          value={props.value}
          onChange={props.changed}
        />
      );
  }

  label = props.label ? (
    <label className={classes.Label}>{props.label}</label>
  ) : null;

  return (
    <div className={className}>
      {label}
      {inputElement}
    </div>
  );
};

export default input;
