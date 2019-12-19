import React, { Component } from 'react';
import Checkbox from './Checkbox';
import classes from './CheckboxCollection.module.scss';

class CheckboxCollection extends Component {
  render() {
    return (
      <div className={classes.CheckboxCollection}>
        {this.props.elementconfig.options.map((each, index) => (
          <Checkbox label={each.displaytext} key={this.props.name + index} />
        ))}
      </div>
    );
  }
}

export default CheckboxCollection;
