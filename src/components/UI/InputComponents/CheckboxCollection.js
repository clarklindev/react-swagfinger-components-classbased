import React, { PureComponent } from 'react';
import Checkbox from './Checkbox';
import classes from './CheckboxCollection.module.scss';
import InputContext from '../../../context/InputContext';

class CheckboxCollection extends PureComponent {
  static contextType = InputContext;

  state = {
    checked: []
  };

  componentDidMount() {
    console.log(
      '\n==============================================\n COMPONENTDIDMOUNT'
    );
    let status = [];
    status = (this.props.value || []).map((item) => {
      return item.data;
    });
    this.setState({ checked: status });
  }

  componentDidUpdate() {
    console.log('\n==================================\n COMPONENTDIDUPDATE');
    let status = [];
    status = (this.props.value || []).map((item) => {
      return item.data;
    });
    if (this.state.checked.toString() !== status.toString()) {
      console.log('UPDATING CHECKBOX COLLECTION');
      this.setState({ checked: status });
    }
  }

  onChangeHandler = (index, isChecked, event) => {
    console.log('onChangeHandler CLICKED: ', index, isChecked);
    this.context.changed(isChecked, this.props.name, index);
  };

  render() {
    console.log('state.checked: ', this.state.checked);

    return (
      <div className={classes.CheckboxCollection}>
        {this.props.elementconfig.options.map((each, index) => {
          console.log(
            `this.state.checked[${index}]: `,
            this.state.checked[index]
          );
          return (
            <Checkbox
              key={this.props.name + index}
              label={each.displaytext}
              name={this.props.name}
              value={this.props.elementconfig.options[index].value}
              checked={this.state.checked[index]}
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
