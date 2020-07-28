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

class MultiInputObjects extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.accordionRef = React.createRef();
  }

  state = {
    isActive: null,
  };

  onClickHandler = (index, event) => {
    this.setState((prevState) => {
      let dataClone = [...prevState.isActive];
      let updatedClone = dataClone.map((value, i) => {
        if (i === index) {
          return !value;
        } else {
          return this.props.allowMultiOpen === true ? value : false;
        }
      });

      return {
        isActive: updatedClone,
        removeIndex: null,
      };
    });
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
          //this.props.onRemove(this.props.name, index);
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
            flexGrow
            spacing='bottom-notlast'
            key={this.props.name + index + '_' + i}>
            <FlexColumn flexGrow spacing='bottom'>
              <label className={classes.Label}>{each.label}</label>
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
                  this.checkValidity(val, index);
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
          return (
            <div key={index} className={classes.RowWrapper}>
              <FlexRow>
                <DraggableItem
                  onClick={this.handleDrag}
                  style={['Wrapper']}></DraggableItem>
                <Expandable title={val.url.data}>
                  {expandableContent(val, index)}
                </Expandable>
                {removeButton(1)}
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
