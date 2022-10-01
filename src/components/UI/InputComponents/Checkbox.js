import React from 'react';
import classes from './Checkbox.module.scss';

const Checkbox = (props) => {
  return (
    <div className={[classes.Checkbox, props.className].join(' ')}>
      <label className={classes.Container}>
        <input
          type="checkbox"
          defaultChecked={props.checked}
          name={props.name}
          onChange={(event) => {
            props.onChange(event.target.checked);
          }}
          disabled={props.isDisabled}
        />

        {props.indeterminate === true ? (
          <span className={[classes.Indeterminate].join(' ')}></span>
        ) : (
          <span className={[classes.Checkmark].join(' ')}></span>
        )}

        {props.label}
      </label>
    </div>
  );
};

export default Checkbox;
