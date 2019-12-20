import React, { Component } from 'react';
import Utils from '../../../Utils';
import classes from './MultiInput.module.scss';
import InputContext from '../../../context/InputContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

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
              <input
                className={tempClasses.join(' ')}
                placeholder={this.props.placeholder}
                value={val.data}
                {...this.props.elementconfig}
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
                <button
                  title='Delete'
                  type='button'
                  className={classes.RemoveButton}
                  onClick={(event) =>
                    this.context.removeinput(event, this.props.name, index)
                  }>
                  <FontAwesomeIcon icon={['far', 'trash-alt']} />
                </button>
              ) : null}
            </div>
          );
        })}
        <button
          title='Add'
          className={classes.AddButton}
          onClick={(event) => this.context.addinput(event, this.props.name)}>
          <FontAwesomeIcon icon={['fas', 'plus']} /> Add
        </button>
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
