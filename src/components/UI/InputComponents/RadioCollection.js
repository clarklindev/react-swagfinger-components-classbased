import React, { Component } from 'react';
import classes from './RadioCollection.module.scss';
import RadioButton from './RadioButton';

class RadioCollection extends Component {
  render() {
    return (
      <div className={classes.RadioCollection}>
        {this.props.elementconfig.options.map((each, index) => {
          return (
            <RadioButton
              {...this.props}
              key={this.props.name + index}
              className={classes.RadioButton}
              label={each.displaytext}
            />
          );
        })}
      </div>
    );
  }
}

export default RadioCollection;