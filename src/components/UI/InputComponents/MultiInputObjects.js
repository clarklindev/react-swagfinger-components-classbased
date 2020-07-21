import React, { Component } from 'react';
import classes from './MultiInputObjects.module.scss';
import InputContext from '../../../context/InputContext';
import Icon from '../InputComponents/Icon';
import PropTypes from 'prop-types';
import Button from '../../UI/Button/Button';
import Input from '../../UI/InputComponents/Input';
import AccordionWithRemove from '../../UI/InputComponents/AccordionWithRemove';
import FlexColumn from '../../../hoc/Layout/FlexColumn';
import FlexRow from '../../../hoc/Layout/FlexRow';

class MultiInputObjects extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
  }

  state = {
    rowValidity: {}, //all rows
  };

  checkValidity = (value, index) => {
    //all props in object true check...
    let allIsValid = Object.keys(value)
      .map((item) => {
        return value[item].valid;
      })
      .every((item) => {
        return item === true;
      });

    this.setState(
      (prevState) => {
        let updated = { ...prevState.rowValidity };
        updated[index] = allIsValid;

        return {
          rowValidity: updated,
        };
      }
      // () => {
      //   console.log('rowIsValid: ', this.state.rowIsValid);
      // }
    );
  };

  render() {
    const { addinput, removeinput, changed } = this.context;

    const row = this.props.value.map((val, index) => {
      //ordered...by metadata array

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
    });

    console.log('ROW:', row);

    return (
      <div className={classes.MultiInputObjects}>
        <React.Fragment>
          <AccordionWithRemove
            {...{
              isValid: this.state.rowValidity,
              allowMultiOpen: false,
              openOnStartIndex: -1, //zero-index, negative value or invalid index to not open on start,
              name: this.props.name,
              onRemove: (name, index) => {
                console.log('MultiInputObjects accordion....');
                console.log('name: ', name);
                console.log('index: ', index);
                removeinput(this.props.name, index);
              },
            }}>
            {row}
          </AccordionWithRemove>
        </React.Fragment>

        <Button
          title='Add'
          type='WithBorder'
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            addinput('arrayofobjects', this.props.name);
          }}>
          <Icon iconstyle='fas' code='plus' size='sm' />
          <p>Add</p>
        </Button>
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
