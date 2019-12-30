import React, { Component } from 'react';

import Utils from '../../../Utils';
import classes from './MultiSelectWithInput.module.scss';
import InputContext from '../../../context/InputContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class MultiSelectWithInput extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.MultiSelectWithInput,
      MultiSelectWithInput.name
    ]);

    this.inputClasses = [classes.InputElement];
  }

  render() {
    return (
      <div className={this.className}>
        {this.props.value.map((val, index) => {
          let tempKey = val.data === null ? '' : val.data.key;
          console.log('val', val);
          console.log('tempKey: ', tempKey);

          let tempVal = val.data === null ? '' : val.data.value;

          return (
            <div className={classes.FlexGroupRow} key={this.props.name + index}>
              <div className={classes.SelectAndInputWrapper}>
                <select
                  multiple={false}
                  name={this.props.name}
                  value={tempKey}
                  onChange={(event) =>
                    this.context.changed(
                      {
                        key: event.target.value,
                        value: ''
                      },
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
                {val.data === null ||
                tempKey === undefined ||
                val.data.key === '' ? null : (
                  <React.Fragment>
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
                          { key: tempKey, value: event.target.value },
                          this.props.name,
                          index
                        )
                      }
                    />
                  </React.Fragment>
                )}
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

export default MultiSelectWithInput;
