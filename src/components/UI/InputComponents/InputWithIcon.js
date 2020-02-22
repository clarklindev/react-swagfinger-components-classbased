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

  componentDidMount() {
    window.addEventListener('keydown', this.keyListener);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyListener);
  }

  keyListener = (event) => {
    if (event.key === 'Enter') {
      console.log('ENTER pressed');
      event.preventDefault();
    }
  };

  changeHandler = (event) => {
    console.log('TARGET VALUE: ', event.target.value);
    console.log('props.name: ', this.props.name, 'value: ', event.target.value);
    this.context.changed(event.target.value, this.props.name);
  };

  onClickHandler = (event) => {
    this.context.clear();
  };

  render() {
    console.log('this.props.value.data: ', this.props.value.data);
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
    //console.log('this.props.value: ', this.props.value);
    const buttonicon = (
      <Button
        type='NoStyle'
        onClick={(event) => {
          console.log('BUTTON PRESS>..');
          event.preventDefault();
          this.props.elementconfig.iconclick()();
        }}>
        <Icon
          iconstyle={this.props.elementconfig.iconstyle}
          code={this.props.elementconfig.iconcode}
          size={this.props.elementconfig.iconsize}
        />
      </Button>
    );
    const searchclose = (
      <Button type='NoStyle' onClick={this.onClickHandler}>
        <Icon
          iconstyle='fas'
          code='times'
          size={this.props.elementconfig.iconsize}
        />
      </Button>
    );

    const divider = <div className={classes.Divider} />;
    return (
      <div className={[this.className, ...tempClasses].join(' ')}>
        {this.props.elementconfig.iconposition === 'left' ? (
          <React.Fragment>
            {buttonicon}
            {this.props.elementconfig.hasdivider === true ? divider : null}
          </React.Fragment>
        ) : null}
        <input
          className={classes['icon-' + this.props.elementconfig.iconposition]}
          placeholder={this.props.elementconfig.placeholder}
          type={this.props.elementconfig.type}
          readOnly={this.props.readOnly}
          value={this.props.value.data}
          onChange={this.changeHandler}
        />
        {this.props.elementconfig.iconposition === 'left' &&
        this.props.elementconfig.type === 'search' &&
        this.props.value.data !== ''
          ? searchclose
          : null}
        {this.props.elementconfig.iconposition === 'right' ? (
          <React.Fragment>
            {this.props.elementconfig.hasdivider === true ? divider : null}
            {buttonicon}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default InputWithIcon;
