import React, { Component } from 'react';
import Checkbox from './Checkbox';
import classes from './CheckboxCollection.module.scss';
import InputContext from '../../../context/InputContext';

class CheckboxCollection extends Component {
  static contextType = InputContext;

  onChangeHandler = (index, isChecked, event) => {
    event.preventDefault();
    console.log('CLICKED: ', index, isChecked, event.target.value);

    this.context.changed(
      isChecked ? event.target.value : '',
      this.props.name,
      index
    );
  };

  render() {
    console.log('props.value: ', this.props.value);

    return (
      <div className={classes.CheckboxCollection}>
        {this.props.elementconfig.options.map((each, index) => {
          let isChecked = false; //initiate to false
          //go through values list, check if option is in this list,
          for (let i = 0; i < this.props.value.length; i++) {
            console.log(
              'this.props.value[i].data: ',
              this.props.value[i].data,
              '| each.value: ',
              each.value
            );
            if (this.props.value[i].data === each.value) {
              isChecked = true;
            }
          }

          console.log('isChecked: ', isChecked);
          // //if it is, make it checked
          return (
            <Checkbox
              {...this.props.elementconfig}
              label={each.displaytext}
              value={this.props.elementconfig.options[index].value}
              checked={isChecked}
              key={this.props.name + index}
              index={index}
              onChange={this.onChangeHandler} //(index,checked,event)
            />
          );
        })}
      </div>
    );
  }
}

export default CheckboxCollection;
