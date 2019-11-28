import React, { Component } from 'react';

import Utils from '../../../Utils';
import classes from './SelectWithInput.module.scss';
import InputContext from '../../../context/InputContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SelectWithInput extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.SelectWithInput,
      SelectWithInput.name
    ]);

    this.inputClasses = [classes.InputElement];
  }

  render() {
    return (
      <div className={this.className}>
        {this.props.value.map((val, index) => {
          let tempClasses = [...this.inputClasses];
          if (
            this.props.validation &&
            !val.valid &&
            (val.touched || (!val.touched && !val.pristine))
          ) {
            tempClasses.push(classes.Invalid);
          }
          return (
            <div className={classes.FlexGroupRow} key={this.props.name + index}>
              {/* row wrapper */}
              <div className={classes.SelectAndInputWrapper}>
                <select
                  name={this.props.name + index}
                  value={this.props.value.data}
                  onChange={(event) =>
                    this.context.changed(event, this.props.name, index)
                  }>
                  {this.props.elementconfig.options.map((option, index) => (
                    <option key={option.value} value={option.value}>
                      {option.displaytext}
                    </option>
                  ))}
                </select>
                <div className={classes.Divider} />
                <input
                  className={tempClasses.join(' ')}
                  placeholder={this.props.placeholder}
                  value={val.data}
                  name={this.props.name + index}
                  {...this.props.elementconfig}
                  onChange={(event) =>
                    //pass in the name of the prop, and the index (if array item)
                    this.context.changed(event, this.props.name, index)
                  }
                />
              </div>
              <button
                title='Delete'
                type='button'
                className={classes.RemoveButton}
                onClick={(event) =>
                  this.context.removeinput(event, this.props.name, index)
                }>
                <FontAwesomeIcon icon={['far', 'trash-alt']} />
              </button>
            </div>
          ); //return
        }) //map
        }
        <button
          title='Add'
          className={classes.AddButton}
          onClick={(event) => {
            this.context.addinput(event, this.props.name);
          }}>
          <FontAwesomeIcon icon={['fas', 'plus']} /> Add
        </button>
      </div>
    );
  }
}

export default SelectWithInput;
