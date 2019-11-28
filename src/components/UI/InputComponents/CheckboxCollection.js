import React, { Component } from 'react';
import Checkbox from './Checkbox';
import classes from './CheckboxCollection.module.scss';

class CheckboxCollection extends Component {
  render() {
    return this.props.elementconfig.options.map((each, index) => (
      <div className={classes.FlexGroupRow} key={this.props.name + index}>
        <Checkbox label={each.displaytext} name={this.props.name + index} />
      </div>
    ));
  }
}

export default CheckboxCollection;
