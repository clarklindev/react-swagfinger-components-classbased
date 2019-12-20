import React, { Component } from 'react';

import Utils from '../../../Utils';
import classes from './SelectWithInput.module.scss';
import InputContext from '../../../context/InputContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SelectWithInput extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.SelectWithInput,
      SelectWithInput.name
    ]);

    this.inputClasses = [classes.InputElement];
  }

  render() {
    const tempElementConfig = {};
    return (
      <div className={this.className}>
        {this.props.value.map((val, index) => {
          let tempClasses = [];

          let tempKey =
            val.data !== (undefined || null) ? Object.keys(val.data)[0] : '';
          let tempVal =
            val.data !== (undefined || null) && tempKey
              ? val.data[tempKey]
              : '';

          return (
            <div className={classes.FlexGroupRow} key={this.props.name + index}>
              <div className={classes.SelectAndInputWrapper}>
                <select
                  multiple={false}
                  name={this.props.name}
                  value={tempKey}
                  onChange={(event) =>
                    this.context.changed(
                      { [event.target.value]: tempVal },
                      this.props.name,
                      index
                    )
                  }>
                  {this.props.elementconfig.options.map((option, index) => (
                    <option key={option.value} value={option.value}>
                      {option.displaytext}
                    </option>
                  ))}
                </select>
                <div className={classes.Divider} />
                <input
                  className={classes.InputElement}
                  placeholder={this.props.placeholder}
                  value={tempVal}
                  name={this.props.name}
                  // disabled={tempKey === (undefined || null)}
                  onChange={(event) =>
                    //pass in the name of the prop, and the index (if array item)
                    this.context.changed(
                      { [tempKey]: event.target.value },
                      this.props.name,
                      index
                    )
                  }
                />
              </div>
              <button
                title='Delete'
                type='button'
                className={classes.RemoveButton}
                onClick={(event) =>
                  this.context.removeinput(event, this.props.name, index)
                }>
                <FontAwesomeIcon icon={['far', 'trash-alt']} />
              </button>
            </div>
          ); //return
        })}

        <button
          title='Add'
          className={classes.AddButton}
          onClick={(event) => {
            this.context.addinput(event, this.props.name);
          }}>
          <FontAwesomeIcon icon={['fas', 'plus']} /> Add
        </button>
      </div>
    );
  }
}

export default SelectWithInput;
