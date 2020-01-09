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

  state = {
    isOpenList: {}
  };

  componenDidUpdate() {
    console.log('state:', this.state);
  }

  onClickHandler = (index, event) => {
    console.log(index, event.target);
    let stateList = { ...this.state.isOpenList };
    this.setState((prevState) => {
      let updatedState =
        prevState.isOpenList[index] === undefined
          ? true
          : !this.state.isOpenList[index];
      console.log('upated: ', updatedState);
      stateList[index] = updatedState;
      return {
        isOpenList: stateList
      };
    });
  };

  onBlurHandler = (index, event) => {
    console.log(index, event.target);
    let stateList = { ...this.state.isOpenList };
    this.setState((prevState) => {
      let updatedState = false;
      console.log('upated: ', updatedState);
      stateList[index] = updatedState;
      return {
        isOpenList: stateList
      };
    });
  };

  render() {
    return (
      <div className={this.className}>
        {this.props.value.map((val, index) => {
          let tempKey = val.data === null ? '' : val.data.key;
          //console.log('val', val);
          //console.log('tempKey: ', tempKey);

          let tempVal = val.data === null ? '' : val.data.value;
          let tempClasses = [];
          if (this.state.isOpenList[index] === true) {
            tempClasses.push(classes.IsOpen);
          }
          return (
            <div className={classes.FlexGroupRow} key={this.props.name + index}>
              <div className={classes.SelectAndInputWrapper}>
                <select
                  multiple={false}
                  name={this.props.name}
                  value={tempKey}
                  className={[...tempClasses].join('')}
                  onClick={(event) => this.onClickHandler(index, event)}
                  onBlur={(event) => {
                    this.onBlurHandler(index, event);
                  }}
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
