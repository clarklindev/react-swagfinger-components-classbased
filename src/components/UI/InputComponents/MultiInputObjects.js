import React, { PureComponent } from 'react';
import classes from './MultiInputObjects.module.scss';
import InputContext from '../../../context/InputContext';
import Icon from '../InputComponents/Icon';
import PropTypes from 'prop-types';
import Button from '../../UI/Button/Button';

import DraggableItem from './DraggableItem';
import FlexRow from '../../../hoc/Layout/FlexRow';
import FlexColumn from '../../../hoc/Layout/FlexColumn';
import Input from './Input';
import Expandable from './Expandable';
import Label from '../Headers/Label';

class MultiInputObjects extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.draggableRef = React.createRef();
  }

  state = {
    isActive: {},
    rowValidity: {}, //all rows
    clickIndex: null,
    toIndex: null,
  };

  componentDidMount() {}
  componentDidUpdate() {}

  //checks if row is valid
  checkValidity = (value, index) => {
    //all props in object true check...
    let allIsValid = Object.keys(value)
      .map((item) => {
        return value[item].valid;
      })
      .every((item) => {
        return item === true;
      });

    this.setState((prevState) => {
      let updated = { ...prevState.rowValidity };
      updated[index] = allIsValid;

      return {
        rowValidity: updated,
      };
    });
  };

  //@param index - the index of item we clicked on
  manageAccordion = (index) => {
    let obj = { ...this.state.isActive };

    let keys = Object.keys(this.state.isActive);

    //check every key
    keys.forEach((key, i) => {
      //only check everything else we didnt click on
      if (i !== index) {
        //if allowMultiOpen, then leave open, else close

        obj[key] =
          this.props.componentconfig.allowmultiopen === true
            ? this.state.isActive[key]
            : false;
      }
    });

    console.log('obj: ', obj);

    this.setState({ isActive: obj });
  };

  onClickHandler = (index, event) => {
    console.log('gets here...');

    this.setState(
      (prevState) => {
        let isActiveClone = { ...prevState.isActive };
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

    this.context.moveiteminarray(
      this.props.name,
      this.state.clickIndex,
      this.state.toIndex
    );
  };

  render() {
    const { addinput, removeinput, changed } = this.context;
    const addButton = (
      <Button
        title='Add'
        type='WithBorder'
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          addinput(this.props.type, this.props.name);
        }}>
        <Icon iconstyle='fas' code='plus' size='sm' />
        <p>Add</p>
      </Button>
    );

    // @props index item in array to remove
    const removeButton = (index) => (
      <Button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          console.log('index:', index);
          removeinput(this.props.name, index);
        }}
        title='Delete'
        type='WithBorder'
        className={classes.RemoveButton}>
        <Icon iconstyle='far' code='trash-alt' size='sm' />
      </Button>
    );

    const rowTitle = (title, index) => {
      let classList = [
        'Embedded',
        this.state.isActive[index] === true ? 'Active' : null,
      ];
      console.log('classList: ', classList);
      return (
        <React.Fragment>
          {this.props.value.length > 1 ? (
            <DraggableItem style={classList} ref={this.draggableRef} />
          ) : null}
          <div className={classes.Title}>{title ? title : null}</div>
        </React.Fragment>
      );
    };

    const expandableContent = (val, index) => {
      return this.props.componentconfig.metadata.map((each, i) => {
        return (
          <FlexRow
            flexGrow
            spacing='bottom-notlast'
            key={this.props.name + index + '_' + i}>
            <FlexColumn flexGrow spacing='bottom'>
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

                  //order sensitive
                  //this.checkValidity(val, index);
                }}
              />
            </FlexColumn>
          </FlexRow>
        );
      });
    };

    return (
      <div className={classes.MultiInputObjects}>
        {this.props.value.map((val, index) => {
          console.log('val: ', val);
          console.log('rowValidity:', this.state.rowValidity);
          return (
            <div
              key={index}
              className={classes.RowWrapper}
              draggable
              onDragStart={(event) => this.dragStartHandler(event, index)}
              onDragEnter={(event) => this.dragEnterHandler(event, index)} //event triggers once
              onDragOver={(event) => this.dragOverhandler(event, index)} //event triggers all the time
              onDragLeave={(event) => this.dragLeaveHandler(event, index)}
              onDrop={(event) => {
                this.dropHandler(event);
              }}
              onDragEnd={(event) => this.dragEndHandler(event, index)}>
              <FlexRow>
                <Expandable
                  title={rowTitle(val.url.data, index)}
                  isActive={this.state.isActive[index]}
                  isValid={this.state.rowValidity[index]}
                  onClick={(event) => {
                    console.log('clicked...', index);
                    this.onClickHandler(index, event);
                  }}>
                  {expandableContent(val, index)}
                </Expandable>
                {removeButton(index)}
              </FlexRow>
            </div>
          );
        })}
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

export default MultiInputObjects;
