import React, { PureComponent } from 'react';
import Checkbox from './Checkbox';
import classes from './CheckboxCollection.module.scss';
import InputContext from '../../../context/InputContext';

class CheckboxCollection extends PureComponent {
  static contextType = InputContext;

  state = {
    checked: [],
  };

  componentDidMount() {
    // console.log(
    //   '\n==============================================\n COMPONENTDIDMOUNT'
    // );
    let status = [];
    if (this.props.value) {
      status = this.props.componentconfig.options.map((each) => {
        return false;
      });
      //console.log('STATUS:', status);

      status = (this.props.value || []).map((item) => {
        return item.data === '' || item.data === undefined ? false : item.data;
      });
      //console.log('STATUS:', status);
    }
    this.setState({ checked: status });
  }

  componentDidUpdate() {
    //console.log('\n==================================\n COMPONENTDIDUPDATE');
    if (this.props.value) {
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
          this.context.changed(bool, this.props.name, index);
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
    this.context.changed(isChecked, this.props.name, index);
  };

  render() {
    //console.log('state.checked: ', this.state.checked);

    return (
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
              index={index}
              usecontext={true}
              onChange={this.onChangeHandler} //(index,checked,event)
            />
          );
        })}
      </div>
    );
  }
}

export default CheckboxCollection;
