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
      InputWithIcon.name,
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
    //console.log('TARGET VALUE: ', event.target.value);
    //console.log('props.name: ', this.props.name, 'value: ', event.target.value);
    this.context.changed(event.target.value, this.props.field);
  };

  onClickHandler = (event) => {
    this.context.clear();
  };

  render() {
    //console.log('this.props.value.data: ', this.props.value.data);
    let tempClasses = [];
    if (
      this.props.type !== 'multiinput' &&
      this.props.type !== 'select' &&
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
          this.props.componentconfig.iconclick()();
        }}>
        <Icon
          iconstyle={this.props.componentconfig.iconstyle}
          code={this.props.componentconfig.iconcode}
          size={this.props.componentconfig.iconsize}
        />
      </Button>
    );
    const searchclose = (
      <Button type='NoStyle' onClick={this.onClickHandler}>
        <Icon
          iconstyle='fas'
          code='times'
          size={this.props.componentconfig.iconsize}
        />
      </Button>
    );

    const divider = <div className={classes.Divider} />;
    return (
      <div className={[this.className, ...tempClasses].join(' ')}>
        {this.props.componentconfig.iconposition === 'left' ? (
          <React.Fragment>
            {buttonicon}
            {this.props.componentconfig.hasdivider === true ? divider : null}
          </React.Fragment>
        ) : null}
        <input
          className={classes['icon-' + this.props.componentconfig.iconposition]}
          placeholder={this.props.componentconfig.placeholder}
          type={this.props.componentconfig.type}
          readOnly={this.props.readOnly}
          value={this.props.value.data}
          onChange={this.changeHandler}
        />
        {this.props.componentconfig.iconposition === 'left' &&
        this.props.componentconfig.type === 'search' &&
        this.props.value.data !== ''
          ? searchclose
          : null}
        {this.props.componentconfig.iconposition === 'right' ? (
          <React.Fragment>
            {this.props.componentconfig.hasdivider === true ? divider : null}
            {buttonicon}
          </React.Fragment>
        ) : null}
      </div>
    );
  }
}

export default InputWithIcon;
