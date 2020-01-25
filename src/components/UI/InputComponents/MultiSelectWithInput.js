import React, { Component } from 'react';

import Utils from '../../../Utils';
import classes from './MultiSelectWithInput.module.scss';
import InputContext from '../../../context/InputContext';
import Button from '../../UI/Button/Button';
import Icon from './Icon';

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
    isOpenList: {},
    dropdownSelectedList: {}
  };

  componenDidUpdate() {
    console.log('state:', this.state);
  }

  onClickHandler = (index, event) => {
    //console.log(index, event.target);
    let isOpenList = { ...this.state.isOpenList };
    this.setState((prevState) => {
      let updatedState =
        prevState.isOpenList[index] === undefined
          ? true
          : !this.state.isOpenList[index];
      // console.log('upated: ', updatedState);
      isOpenList[index] = updatedState;
      return {
        isOpenList: isOpenList
      };
    });
  };

  onBlurHandler = (index, event) => {
    console.log(index, event.target);
    let isOpenList = { ...this.state.isOpenList };
    this.setState((prevState) => {
      let updatedState = false;
      //console.log('upated: ', updatedState);
      isOpenList[index] = updatedState;
      return {
        isOpenList: isOpenList
      };
    });
  };

  onChangeHandler = (index, event) => {
    //val is the selector value...
    let val = event.target.value;

    let dropdownSelectedList = { ...this.state.dropdownSelectedList };
    this.setState((prevState) => {
      let updatedState = false;
      if (val !== '') {
        console.log('UPDATED STATE = true');
        updatedState = true;
      }
      dropdownSelectedList[index] = updatedState;
      return {
        dropdownSelectedList: dropdownSelectedList
      };
    });

    this.context.changed(
      {
        key: val,
        value: ''
      },
      this.props.name,
      index
    );
    console.log('--------------------------------state: ', this.state);
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
          let dropdownClasses = [];
          if (
            this.state.dropdownSelectedList[index] === true ||
            (tempKey !== '' && tempKey !== undefined && tempKey !== null) ||
            (tempVal !== undefined && tempVal !== '')
          ) {
            dropdownClasses.push(classes.ShowSocial);
          }

          return (
            <div className={classes.FlexGroupRow} key={this.props.name + index}>
              <div className={classes.SelectAndInputWrapper}>
                <select
                  multiple={false}
                  name={this.props.name}
                  value={tempKey}
                  className={[...tempClasses, ...dropdownClasses].join(' ')}
                  onClick={(event) => this.onClickHandler(index, event)}
                  onBlur={(event) => {
                    this.onBlurHandler(index, event);
                  }}
                  onChange={(event) => this.onChangeHandler(index, event)}>
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
                      onChange={(event) => {
                        //pass in the name of the prop, and the index (if array item)
                        this.context.changed(
                          { key: tempKey, value: event.target.value },
                          this.props.name,
                          index
                        );
                      }}
                    />
                  </React.Fragment>
                )}
              </div>

              <Button
                title='Delete'
                type='WithBorder'
                className={classes.RemoveButton}
                onClick={(event) => {
                  this.setState((prevState) => {
                    let open = Object.keys(prevState.isOpenList).filter(
                      (item, j) => {
                        return index !== j;
                      }
                    );

                    let dropdown = Object.keys(
                      prevState.dropdownSelectedList
                    ).filter((item, k) => {
                      return index !== k;
                    });
                    return { isOpenList: open, dropdownSelectedList: dropdown };
                  });
                  this.context.removeinput(event, this.props.name, index);
                }}>
                <Icon iconstyle='far' code='trash-alt' size='sm' />
              </Button>
            </div>
          ); //return
        })}

        <Button
          title='Add'
          type='WithBorder'
          className={classes.AddButton}
          onClick={(event) => {
            this.context.addinput(event, this.props.name);
          }}>
          <Icon iconstyle='fas' code='plus' size='sm' />
          <p>Add</p>
        </Button>
      </div>
    );
  }
}

export default MultiSelectWithInput;
