import React, { PureComponent } from 'react';
import classes from './MultiInputObjects.module.scss';
import InputContext from '../../../context/InputContext';
import Icon from '../Icon/Icon';
import PropTypes from 'prop-types';
import Button from '../../UI/Button/Button';

import DraggableItem from './DraggableItem';
import FlexRow from '../../../hoc/Layout/FlexRow';
import FlexColumn from '../../../hoc/Layout/FlexColumn';
import Input from './Input';
import Expandable from './Expandable';
import Label from '../Headers/Label';
import * as ArrayHelper from '../../../shared/arrayHelper';

class MultiInputObjects extends PureComponent {
  static contextType = InputContext;

  state = {
    isActive: [],
    clickIndex: null,
    toIndex: null,
  };

  componentDidMount() {
    console.log('mount: this.props.value: ', this.props.value);
  }
  componentDidUpdate() {
    if (this.state.isActive === []) {
      const updatedIsActive = this.props.value.map((item) => {
        return false;
      });
      this.setState({ isActive: updatedIsActive });
    }
  }

  //checks if row is valid
  checkAllValidity = (value, index) => {
    //all props in object true check...
    let allIsValid = Object.keys(value)
      .map((item) => {
        return value[item].valid;
      })
      .every((item) => {
        return item === true;
      });
    console.log('allIsValid: ', allIsValid);
    return allIsValid;
  };

  checkAllPristine = (value, index) => {
    let allIsPristine = Object.keys(value)
      .map((item) => {
        return value[item].pristine;
      })
      .every((item) => {
        return item === true;
      });
    return allIsPristine;
  };

  //@param index - the index of item we clicked on
  manageAccordion = (index) => {
    let arr = [...this.state.isActive];

    //check every key
    arr.forEach((item, i) => {
      //only check everything else we didnt click on
      if (i !== index) {
        //what to do with the others when item at index is clicked
        //if allowMultiOpen, then leave open, else close
        arr[i] =
          this.props.componentconfig.allowmultiopen === true
            ? this.state.isActive[i]
            : false;
      }
    });

    console.log('arr: ', arr);

    this.setState({ isActive: arr });
  };

  onClickHandler = (index, event) => {
    console.log('gets here...');

    this.setState(
      (prevState) => {
        let isActiveClone = [...prevState.isActive];
        if (
          isActiveClone[index] === undefined ||
          isActiveClone[index] === null
        ) {
          isActiveClone[index] = true;
        }
        //something there...toggle
        else {
          isActiveClone[index] = !prevState.isActive[index];
        }
        return {
          isActive: isActiveClone,
        };
      },

      this.manageAccordion.bind(this, index)
    );
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

    const clickIndex = this.state.clickIndex;
    const toIndex = this.state.toIndex;

    this.context.moveiteminarray(
      this.props.name,
      this.state.clickIndex,
      this.state.toIndex
    );

    const updatedArr = ArrayHelper.moveItemInArray(
      this.state.isActive,
      clickIndex,
      toIndex
    );

    //if clicked was active, keep it active
    this.setState((prevState) => {
      return {
        isActive: updatedArr,
      };
    });
  };

  resetIsActiveAtIndex = (index) => {
    this.setState(
      (prevState) => {
        let updatedIsActive = [...prevState.isActive];
        updatedIsActive[index] = undefined;
        return {
          isActive: updatedIsActive,
        };
      },
      () => {
        console.log('isActive: ', this.state.isActive);
      }
    );
  };

  render() {
    console.log('isActive: ', this.state.isActive);

    const { addinput, removeinput, changed } = this.context;
    const addButton = (
      <Button
        title='Add'
        type='WithBorder'
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log('this.state.isActive: ', this.state.isActive);
          addinput(this.props.type, this.props.name);
        }}>
        <Icon iconstyle='fas' code='plus' size='sm' />
        <p>Add</p>
      </Button>
    );

    // @props index item in array to remove
    const removeButton = (index) => (
      <Button
        onClick={async (event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log('index:', index);
          await this.resetIsActiveAtIndex(index);
          removeinput(this.props.name, index);
        }}
        title='Delete'
        type='WithBorder'
        className={classes.RemoveButton}>
        <Icon iconstyle='far' code='trash-alt' size='sm' />
      </Button>
    );

    const expandableContent = (val, index) => {
      return this.props.componentconfig.metadata.map((each, i) => {
        return (
          <FlexRow
            flexgrow='true'
            spacing='bottom-notlast'
            key={this.props.name + index + '_' + i}>
            <FlexColumn flexgrow='true' spacing='bottom'>
              <Label>{each.label}</Label>
              <Input
                label={each.label}
                name={each.name}
                componentconfig={{
                  type: each.type,
                  validation: each.validation,
                  placeholder: each.placeholder,
                }}
                value={{
                  data: val[each.name].data,
                  valid: val[each.name].valid,
                  touched: val[each.name].touched,
                  pristine: val[each.name].pristine,
                  errors: val[each.name].errors,
                }}
                onChange={(event) => {
                  changed(
                    'arrayofobjects',
                    this.props.name,
                    event.target.value,
                    index,
                    each.name //prop name in object
                  );
                }}
              />
            </FlexColumn>
          </FlexRow>
        );
      });
    };

    return (
      <div className={classes.MultiInputObjects}>
        {this.props.value.length
          ? this.props.value.map((val, index) => {
              console.log('val: ', val);
              console.log('rowValidity:', this.state.rowValidity);
              return (
                <FlexColumn
                  spacing='bottom'
                  key={index}
                  onDragStart={(event) => this.dragStartHandler(event, index)}
                  onDragEnter={(event) => this.dragEnterHandler(event, index)} //event triggers once
                  onDragOver={(event) => this.dragOverhandler(event, index)} //event triggers all the time
                  onDragLeave={(event) => this.dragLeaveHandler(event, index)}
                  onDrop={(event) => {
                    console.log('event.target: ', event.target);
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
                    console.log('event.target: ', event.target);
                    if (event.target.className.includes('DraggableItem')) {
                      console.log('event.target:', event.target);
                      console.log('event.currentTarget:', event.currentTarget);
                      event.currentTarget.setAttribute('draggable', 'true');
                    }
                  }}
                  onMouseUp={(event) => {
                    console.log('event.currentTarget: ', event.currentTarget);
                    event.currentTarget.setAttribute('draggable', 'false');
                  }}>
                  <FlexRow>
                    <Expandable
                      title={
                        <React.Fragment>
                          {this.props.value.length > 1 ? (
                            <DraggableItem
                              style={[
                                'Embedded',
                                this.state.isActive[index] === true
                                  ? 'Active'
                                  : null,
                              ]}
                            />
                          ) : null}
                          <div
                            className={classes.Title}
                            onClick={(event) => {
                              this.onClickHandler(index, event);
                            }}>
                            {val.url.data ? val.url.data : null}
                          </div>
                        </React.Fragment>
                      }
                      isActive={this.state.isActive[index]}
                      isValid={
                        this.checkAllValidity(val, index) ||
                        this.checkAllPristine(val, index)
                      }
                      onClick={(event) => {
                        console.log('clicked...', index);
                        this.onClickHandler(index, event);
                      }}>
                      {expandableContent(val, index)}
                    </Expandable>

                    {removeButton(index)}
                  </FlexRow>
                </FlexColumn>
              );
            })
          : null}
        {addButton}
      </div>
    );
  }
}

MultiInputObjects.propTypes = {
  className: PropTypes.string,
  value: PropTypes.array,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  componentconfig: PropTypes.object,
  name: PropTypes.string,
  changed: PropTypes.func,
};

MultiInputObjects.defaultProps = {
  name: 'multiinputobjects',
  label: 'multi input objects',

  value: [],
  componentconfig: {
    allowmultiopen: true,
    defaultinputs: 3,
    metadata: [
      {
        component: 'input',
        label: 'url',
        name: 'url',
        placeholder: 'url',
        type: 'string',
        validation: { isRequired: true },
      },
    ],
  },
};

export default MultiInputObjects;
