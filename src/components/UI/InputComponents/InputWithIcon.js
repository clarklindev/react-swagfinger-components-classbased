import React, { Component } from 'react';

import classes from './InputWithIcon.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';
import Icon from './Icon';
class InputWithIcon extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.InputWithIcon,
      InputWithIcon.name
    ]);
  }
  render() {
    let tempClasses = [];
    if (
      this.props.elementtype !== 'multiinput' &&
      this.props.elementtype !== 'select' &&
      this.props.validation &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
    }

    return (
      <div className={[this.className, tempClasses].join(' ')}>
        {this.props.elementconfig.iconposition === 'left' ? (
          <React.Fragment>
            <Icon
              iconstyle={this.props.elementconfig.iconstyle}
              code={this.props.elementconfig.iconcode}
              size={this.props.elementconfig.iconsize}
            />
            <div className={classes.Divider} />
          </React.Fragment>
        ) : null}
        <input
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          {...this.props.elementconfig}
          value={this.props.value.data}
          onChange={(event) => {
            console.log('props.name: ', this.props.name);
            this.context.changed(event.target.value, this.props.name);
          }}
        />
        {this.props.elementconfig.iconposition === 'right' ? (
          <React.Fragment>
            <div className={classes.Divider} />
            <Icon
              iconstyle={this.props.elementconfig.iconstyle}
              code={this.props.elementconfig.iconcode}
              size={this.props.elementconfig.iconsize}
            />
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default InputWithIcon;
