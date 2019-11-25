import React from 'react';

import classes from './Input.module.scss';
import Utils from '../../../Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const input = (props) => {
  let inputElement = null;
  let label = null;
  const inputClasses = [classes.InputElement];

  const className = Utils.getClassNameString([
    classes.Input,
    'Input',
    props.className
  ]);

  //add Invalid class if...
  if (
    props.elementtype !== 'multiinput' &&
    props.elementtype !== 'select' &&
    props.shouldValidate &&
    !props.value.valid &&
    (props.value.touched || (!props.value.touched && !props.value.pristine))
  ) {
    inputClasses.push(classes.Invalid);
  }
  label = props.label ? (
    <label className={classes.Label}>{props.label}</label>
  ) : null;

  switch (props.elementtype) {
    case 'input':
      inputElement = (
        <input
          className={inputClasses.join(' ')}
          placeholder={props.placeholder}
          {...props.elementconfig}
          value={props.value.data}
          onChange={(event) => props.changed(event, props.name)}
        />
      );
      break;

    case 'multiinput':
      inputElement = (
        <React.Fragment>
          {props.value.map((val, index) => {
            let tempClasses = [...inputClasses];
            if (
              props.shouldValidate &&
              !val.valid &&
              (val.touched || (!val.touched && !val.pristine))
            ) {
              tempClasses.push(classes.Invalid);
            }
            return (
              <div className={classes.ContactGroup} key={props.name + index}>
                <input
                  className={tempClasses.join(' ')}
                  placeholder={props.placeholder}
                  value={val.data}
                  {...props.elementconfig}
                  onChange={(event) => props.changed(event, props.name, index)}
                />
                {props.value.length > 1 ? (
                  <button
                    title='Delete'
                    type='button'
                    className={classes.RemoveButton}
                    onClick={(event) =>
                      props.removeInput(event, props.name, index)
                    }>
                    <FontAwesomeIcon icon={['far', 'trash-alt']} />
                  </button>
                ) : null}
              </div>
            );
          })}
          <button
            title='Add'
            className={classes.AddButton}
            onClick={(event) => props.addInput(event, props.name)}>
            <FontAwesomeIcon icon={['fas', 'plus']} /> Add
          </button>
        </React.Fragment>
      );
      break;

    case 'textarea':
      inputElement = (
        <textarea
          className={inputClasses.join(' ')}
          placeholder={props.placeholder}
          {...props.elementconfig}
          value={props.value.data}
          onChange={(event) => props.changed(event, props.name)}
        />
      );
      break;
    case 'select':
      inputElement = (
        <select
          className={inputClasses.join(' ')}
          value={props.value.data}
          onChange={(event) => props.changed(event, props.name)}>
          {props.elementconfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.displayValue}
            </option>
          ))}
        </select>
      );
      break;
    default:
      inputElement = <p>specify input type</p>;
  }

  return (
    <div className={className}>
      {label}
      {inputElement}
    </div>
  );
};

export default input;
