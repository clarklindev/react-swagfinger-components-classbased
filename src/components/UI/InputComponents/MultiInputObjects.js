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

    this.inputClasses = [classes.InputElement];
  }
  render() {
    const { addinput, removeinput, changed } = this.context;
    const deleteButton = (
      <Button
        title='Delete'
        type='WithBorder'
        className={classes.RemoveButton}
        onClick={(event) => {
          event.preventDefault();
          removeinput(this.props.name);
        }}>
        <Icon iconstyle='far' code='trash-alt' size='sm' />
      </Button>
    );

    const row = this.props.value.map((val, index) => {
      let tempClasses = [...this.inputClasses];
      console.log('is Obj:', val);
      // if (
      //   componentconfig.metadata[i].validation.isRequired &&
      //   !value.valid &&
      //   (value.touched || (!value.touched && !value.pristine))
      // ) {
      //   tempClasses.push(classes.Invalid);
      // }
      return Object.keys(val).map((each, i) => {
        console.log('item[each]: ', val[each]);
        console.log('this.props.name: ', this.props.name);
        console.log('index: ', index);
        console.log('i: ', i);
        return (
          <FlexRow
            flexGrow
            spacing='bottom-notlast'
            key={this.props.name + index + '_' + i}>
            <FlexColumn flexGrow spacing='bottom'>
              <label className={classes.Label}>{each}</label>
              <Input
                className={classes.tempClasses}
                componentconfig={this.props.componentconfig}
                validation={this.props.validation}
                value={{ data: val[each].data }}
                onChange={(event) =>
                  //pass in the name of the prop, and the index (if array item)
                  changed(event.target.value, this.props.name, index)
                }
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
              allowMultiOpen: false,
              openOnStartIndex: -1, //zero-index, negative value or invalid index to not open on start,
              name: this.props.name,
              onClick: () => {},
            }}
            removeButton={deleteButton}>
            {row}
          </AccordionWithRemove>
        </React.Fragment>

        <Button
          title='Add'
          type='WithBorder'
          onClick={(event) => addinput(event, this.props.name)}>
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
