import React, { PureComponent } from 'react';

import Utils from '../../../Utils';
import classes from './MultiSelectWithInput.module.scss';
import InputContext from '../../../context/InputContext';
import Button from '../../UI/Button/Button';
import Icon from './Icon';
import ErrorList from './ErrorList';

class MultiSelectWithInput extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.MultiSelectWithInput,
      MultiSelectWithInput.name,
    ]);

    this.inputClasses = [classes.InputElement];
  }

  state = {
    isOpenList: {}, //keeping track of arrow direction on select input,
    //we need this because we cannot set a class to render() else all instances arrows change at same time
  };

  componenDidUpdate() {
    console.log('state:', this.state);
  }

  //function called when input type=select is clicked
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
        isOpenList: isOpenList,
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
        isOpenList: isOpenList,
      };
    });
  };

  onChangeHandler = (index, event) => {
    //console.log('ONCHANGEHANDLER...');
    //val is the selector value...
    let val = event.target.value;

    this.context.changed(
      'array',
      this.props.name,
      {
        key: val,
        value: '',
      },
      index
    );
    //console.log('--------------------------------state: ', this.state);
  };

  render() {
    //console.log('-------------------------------');
    //console.log('RENDER CYCLE>>>>>');
    return (
      <div className={this.className}>
        {this.props.value.map((val, index) => {
          // console.log('index: ', index);
          // console.log('val: ', val);
          // console.log('val.data.key: ', val.data.key);
          let tempKey = val.data.key;
          //console.log('tempKey: ', tempKey);

          let tempVal = val.data.value;
          let tempClasses = [];
          if (this.state.isOpenList[index] === true) {
            tempClasses.push(classes.IsOpen);
          }
          if (
            (tempKey !== '' && tempKey !== undefined && tempKey !== null) ||
            (tempVal !== '' && tempVal !== undefined && tempVal !== null)
          ) {
            tempClasses.push(classes.SelectStyling);
          }
          // console.log(
          //   'index: ',
          //   index,
          //   '| key: ',
          //   tempKey,
          //   '| value: ',
          //   tempVal
          // );
          let error = null;
          let errorClasses = [];
          if (
            this.props.componentconfig.validation.isRequired &&
            !val.valid &&
            (val.touched || (!val.touched && !val.pristine))
          ) {
            errorClasses.push(classes.Invalid);
            error = <ErrorList value={{ data: val.errors }} />;
          }

          return (
            <React.Fragment key={this.props.name + index}>
              <div className={classes.FlexGroupRow}>
                <div className={classes.FlexGroupColumn}>
                  <div
                    className={[
                      classes.SelectAndInputWrapper,
                      ...errorClasses,
                    ].join(' ')}>
                    <select
                      name={this.props.name + index}
                      value={tempKey}
                      className={[...tempClasses].join(' ')}
                      onClick={(event) => this.onClickHandler(index, event)}
                      onBlur={(event) => {
                        this.onBlurHandler(index, event);
                      }}
                      onChange={(event) => this.onChangeHandler(index, event)}>
                      {this.props.componentconfig.options.map(
                        (option, index) => (
                          <option key={option.value} value={option.value}>
                            {option.displaytext}
                          </option>
                        )
                      )}
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
                              'array',
                              this.props.name,
                              { key: tempKey, value: event.target.value },
                              index
                            );
                          }}
                        />
                      </React.Fragment>
                    )}
                  </div>

                  {error}
                </div>
                <Button
                  title='Delete'
                  type='WithBorder'
                  className={classes.RemoveButton}
                  onClick={(event) => {
                    event.preventDefault();
                    this.context.removeinput(this.props.name, index);

                    this.setState((prevState) => {
                      let open = Object.keys(prevState.isOpenList).filter(
                        (item, j) => {
                          return index !== j;
                        }
                      );

                      return {
                        isOpenList: open,
                      };
                    });
                  }}>
                  <Icon iconstyle='far' code='trash-alt' size='sm' />
                </Button>
              </div>
            </React.Fragment>
          ); //return
        })}

        <Button
          title='Add'
          type='WithBorder'
          className={classes.AddButton}
          onClick={(event) => {
            this.context.addinput(event, this.props.name, {
              key: '',
              value: '',
            });
          }}>
          <Icon iconstyle='fas' code='plus' size='sm' />
          <p>Add</p>
        </Button>
      </div>
    );
  }
}

export default MultiSelectWithInput;
