import React, { Component } from 'react';
import classes from './MultiInput.module.scss';
import InputContext from '../../../context/InputContext';
import Icon from '../InputComponents/Icon';
import PropTypes from 'prop-types';
import Button from '../../UI/Button/Button';
import Input from '../../UI/InputComponents/Input';

class MultiInput extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.inputClasses = [classes.InputElement];
  }
  render() {
    const { addinput, removeinput, changed } = this.context;
    const { value, componentconfig, name, validation } = this.props;
    return (
      <div className={classes.MultiInput}>
        {value.map((val, index) => {
          let tempClasses = [...this.inputClasses];
          if (
            componentconfig.validation.isRequired &&
            !val.valid &&
            (val.touched || (!val.touched && !val.pristine))
          ) {
            tempClasses.push(classes.Invalid);
          }
          return (
            <div className={classes.FlexGroupRow} key={name + index}>
              <Input
                className={classes.tempClasses}
                componentconfig={componentconfig}
                validation={validation}
                value={val}
                onChange={(event) =>
                  //pass in the name of the prop, and the index (if array item)
                  changed(event.target.value, name, index)
                }
              />
              {value.length > 1 ? (
                <Button
                  title='Delete'
                  type='WithBorder'
                  className={classes.RemoveButton}
                  onClick={(event) => {
                    event.preventDefault();
                    removeinput(name, index);
                  }}>
                  <Icon iconstyle='far' code='trash-alt' size='sm' />
                </Button>
              ) : null}
            </div>
          );
        })}
        <Button
          title='Add'
          type='WithBorder'
          onClick={(event) => addinput(event, name)}>
          <Icon iconstyle='fas' code='plus' size='sm' />
          <p>Add</p>
        </Button>
      </div>
    );
  }
}

MultiInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.array,
  validation: PropTypes.object,
  placeholder: PropTypes.string,
  componentconfig: PropTypes.object,
  name: PropTypes.string,
  changed: PropTypes.func,
};

export default MultiInput;
