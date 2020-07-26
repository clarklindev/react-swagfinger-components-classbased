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

    return (
      <div className={classes.MultiInput}>
        {this.props.value.map((val, index) => {
          let tempClasses = [...this.inputClasses];
          if (
            this.props.componentconfig.validation.isRequired &&
            !val.valid &&
            (val.touched || (!val.touched && !val.pristine))
          ) {
            tempClasses.push(classes.Invalid);
          }
          return (
            <div className={classes.FlexGroupRow} key={this.props.name + index}>
              <Input
                className={classes.tempClasses}
                componentconfig={this.props.componentconfig}
                validation={this.props.validation}
                value={val}
                onChange={(event) =>
                  //pass in the name of the prop, and the index (if array item)
                  changed('array', this.props.name, event.target.value, index)
                }
              />
              {this.props.value.length > 1 ? (
                <Button
                  title='Delete'
                  type='WithBorder'
                  className={classes.RemoveButton}
                  onClick={(event) => {
                    event.preventDefault();
                    removeinput(this.props.name, index);
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
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            addinput(this.props.type, this.props.name);
          }}>
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
