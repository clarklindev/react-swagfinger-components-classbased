import React, { Component } from 'react';
import Utils from '../../../Utils';
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

    this.className = Utils.getClassNameString([
      classes.MultiInput,
      MultiInput.name
    ]);

    this.inputClasses = [classes.InputElement];
  }
  render() {
    return (
      <div className={this.className}>
        {this.props.value.map((val, index) => {
          let tempClasses = [...this.inputClasses];
          if (
            this.props.validation.required &&
            !val.valid &&
            (val.touched || (!val.touched && !val.pristine))
          ) {
            tempClasses.push(classes.Invalid);
          }
          return (
            <div className={classes.FlexGroupRow} key={this.props.name + index}>
              <Input
                className={classes.tempClasses}
                placeholder={this.props.placeholder}
                {...this.props.elementconfig}
                validation={this.props.validation}
                value={val}
                onChange={(event) =>
                  //pass in the name of the prop, and the index (if array item)
                  this.context.changed(
                    event.target.value,
                    this.props.name,
                    index
                  )
                }
              />
              {this.props.value.length > 1 ? (
                <Button
                  title='Delete'
                  type='WithBorder'
                  className={classes.RemoveButton}
                  onClick={(event) =>
                    this.context.removeinput(event, this.props.name, index)
                  }>
                  <Icon iconstyle='far' code='trash-alt' size='sm' />
                </Button>
              ) : null}
            </div>
          );
        })}
        <Button
          title='Add'
          type='WithBorder'
          onClick={(event) => this.context.addinput(event, this.props.name)}>
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
  elementconfig: PropTypes.object,
  name: PropTypes.string,
  changed: PropTypes.func
};

export default MultiInput;
