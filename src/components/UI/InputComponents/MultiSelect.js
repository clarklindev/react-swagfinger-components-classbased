import React, { PureComponent } from 'react';

import classes from './MultiSelect.module.scss';
import InputContext from '../../../context/InputContext';
import Button from '../../UI/Button/Button';
import Icon from '../Icon/Icon';
import ErrorList from './ErrorList';
import DraggableItem from '../Draggable/DraggableItem';
import { stringHelper } from '../../../shared';

class MultiSelect extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = stringHelper.getUniqueClassNameString([
      classes.MultiSelect,
      MultiSelect.name
    ]);

    this.inputClasses = [classes.InputElement];
  }

  state = {
    isOpenList: {} //keeping track of arrow direction on select input,
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
    //console.log('ONCHANGEHANDLER...');
    //val is the selector value...
    let val = event.target.value;

    this.context.changed(
      'array',
      this.props.name,
      {
        key: val,
        value: ''
      },
      index
    );
    //console.log('--------------------------------state: ', this.state);
  };

  dragStartHandler = function (e, index) {
    console.log('FUNCTION dragStartHandler');
    console.log('e.currentTarget: ', e.currentTarget);
    console.log('e.target:', e.target);
    e.target.style.opacity = 0.3;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget);
    this.setState({ clickIndex: index });
  };

  dragEnterHandler = function (e, index) {
    console.log('FUNCTION dragEnterHandler');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    console.log('dragenter:', e.currentTarget);
    //set index if not same as current state
    if (this.state.toIndex !== index) {
      console.log('set index:', index);
      this.setState((prevState) => {
        return { toIndex: index };
      });
    }
  };
  dragOverhandler = function (e, index) {
    e.preventDefault();
    //console.log('FUNCTION dragOverhandler');
  };
  dragLeaveHandler = function (e, index) {
    console.log('FUNCTION dragLeaveHandler');
  };

  dragEndHandler = function (e) {
    console.log('FUNCTION dragEndHandler');
    e.target.style.opacity = '';
  };

  //this requires dragOverhandler() to have e.preventDefault() for it to work
  dropHandler = function (e) {
    e.preventDefault();

    this.context.moveiteminarray(
      this.props.name,
      this.state.clickIndex,
      this.state.toIndex
    );
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
            <div
              key={this.props.name + index}
              className={classes.FlexGroupRow}
              onDragStart={(event) => this.dragStartHandler(event, index)}
              onDragEnter={(event) => this.dragEnterHandler(event, index)} //event triggers once
              onDragOver={(event) => this.dragOverhandler(event, index)} //event triggers all the time
              onDragLeave={(event) => this.dragLeaveHandler(event, index)}
              onDrop={(event) => {
                if (event.target.className.includes('DraggableItem')) {
                  this.dropHandler(event);
                }
              }}
              onDragEnd={(event) => {
                event.currentTarget.setAttribute('draggable', false);
                this.dragEndHandler(event, index);
              }}
              onMouseDown={(event) => {
                console.log('mousedown');
                if (event.target.className.includes('DraggableItem')) {
                  console.log('event.target:', event.target);
                  console.log('event.currentTarget:', event.currentTarget);
                  event.currentTarget.setAttribute('draggable', 'true');
                }
              }}
              onMouseUp={(event) => {
                console.log('event.currentTarget: ', event.currentTarget);
                event.currentTarget.setAttribute('draggable', 'false');
              }}
            >
              <div className={classes.FlexGroupColumn}>
                <div
                  className={[
                    classes.SelectAndInputWrapper,
                    ...errorClasses
                  ].join(' ')}
                >
                  {this.props.componentconfig.draggable &&
                  this.props.value.length > 1 ? (
                    <DraggableItem style={['Embedded']}></DraggableItem>
                  ) : null}
                  <select
                    name={this.props.name + index}
                    value={tempKey}
                    className={[...tempClasses].join(' ')}
                    onClick={(event) => this.onClickHandler(index, event)}
                    onBlur={(event) => {
                      this.onBlurHandler(index, event);
                    }}
                    onChange={(event) => this.onChangeHandler(index, event)}
                  >
                    {this.props.componentconfig.options.map((option, index) => (
                      <option key={option.value} value={option.value}>
                        {option.displaytext}
                      </option>
                    ))}
                  </select>
                </div>

                {error}
              </div>
              <Button
                title="Delete"
                type="WithBorder"
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
                      isOpenList: open
                    };
                  });
                }}
              >
                <Icon iconstyle="far" code="trash-alt" size="sm" />
              </Button>
            </div>
          ); //return
        })}

        <Button
          title="Add"
          type="WithBorder"
          className={classes.AddButton}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            this.context.addinput(this.props.type, this.props.name, {
              key: '',
              value: ''
            });
          }}
        >
          <Icon iconstyle="fas" code="plus" size="sm" />
          <p>Add</p>
        </Button>
      </div>
    );
  }
}

export default MultiSelect;
