import React, { Component } from 'react';

import classes from './InputWithIcon.module.scss';
import Utils from '../../../Utils';
import InputContext from '../../../context/InputContext';
import Icon from './Icon';
import Button from '../Button/Button';
class InputWithIcon extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.InputWithIcon,
      InputWithIcon.name
    ]);
  }

  changeHandler = (event) => {
    console.log('props.name: ', this.props.name, 'value: ', event.target.value);
    this.context.changed(event, this.props.name);
  };

  onClickHandler = (event) => {
    this.context.clear();
  };

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
    console.log('this.props.value: ', this.props.value);

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
          className={classes['icon-' + this.props.elementconfig.iconposition]}
          placeholder={this.props.placeholder}
          readOnly={this.props.readOnly}
          {...this.props.elementconfig}
          value={this.props.value.data}
          onChange={(event) => this.changeHandler(event)}
        />
        {this.props.elementconfig.iconposition === 'left' &&
        this.props.elementconfig.type === 'search' &&
        this.props.value.data !== '' ? (
          <Button type='NoStyle' onClick={this.onClickHandler}>
            <Icon
              iconstyle='fas'
              code='times'
              size={this.props.elementconfig.iconsize}
            />
          </Button>
        ) : null}
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
