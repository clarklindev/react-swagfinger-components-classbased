import React, { PureComponent } from 'react';
import Checkbox from './Checkbox';
import classes from './CheckboxCollection.module.scss';
import InputContext from '../../../context/InputContext';

class CheckboxCollection extends PureComponent {
  static contextType = InputContext;

  state = {
    checked: []
  };

  componentDidUpdate() {
    //console.log('\n==================================\n COMPONENTDIDUPDATE');
    if (this.props.value) {
      console.log('CheckboxCollection: ', this.props.value);
      let status = [];
      status = this.props.componentconfig.options.map((each) => {
        return false;
      });
      //console.log('STATUS:', status);

      status = (this.props.value || []).map((item, index) => {
        let bool = item.data === '' ? false : item.data;
        //console.log(`item.data (${index}):`, bool);
        if (this.state.checked[index] !== item.data) {
          //console.log('updating database: ', bool);
          this.context.changed('array', this.props.name, bool, index);
        }
        return bool;
      });
      //console.log('STATUS:', status);
      if (this.state.checked.toString() !== status.toString()) {
        //console.log('UPDATING CHECKBOX COLLECTION:', status);
        this.setState({ checked: status });
      }
    }
  }

  onChangeHandler = (index, isChecked, event) => {
    console.log('onChangeHandler CLICKED: ', index, isChecked);
    console.log('isChecked: ', isChecked);
    console.log('index: ', index);
    this.context.changed('array', this.props.name, isChecked, index);
  };

  render() {
    //console.log('state.checked: ', this.state.checked);
    return this.state.checked.length ? (
      <div className={classes.CheckboxCollection}>
        {this.props.componentconfig.options.map((each, index) => {
          //console.log(
          //`this.state.checked[${index}]: `,
          //this.state.checked[index]
          //);
          return (
            <Checkbox
              className={classes.Checkbox}
              key={this.props.name + index}
              label={each.displaytext}
              name={this.props.name}
              value={this.props.componentconfig.options[index].value}
              checked={this.state.checked[index] === false ? false : true}
              onChange={this.onChangeHandler(index)} //(index,checked,event)
            />
          );
        })}
      </div>
    ) : null;
  }
}

export default CheckboxCollection;
