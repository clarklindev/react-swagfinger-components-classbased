import React, { PureComponent } from 'react';
import classes from './Counter.module.scss';
import InputContext from '../../../context/InputContext';
import Icon from '../InputComponents/Icon';
import Button from '../Button/Button';
import ErrorList from './ErrorList';

class Counter extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.counterRef = React.createRef();
  }

  decrement = () => {
    let tempVal =
      this.props.value.data === ''
        ? Number(this.props.elementconfig.default)
        : Number(this.props.value.data) -
          Number(this.props.elementconfig.increment);
    if (tempVal < this.props.elementconfig.min) {
      tempVal = this.props.elementconfig.min;
    }
    this.context.changed(tempVal.toFixed(2), this.props.name);
  };

  increment = () => {
    let tempVal =
      this.props.value.data === ''
        ? Number(this.props.elementconfig.default)
        : Number(this.props.value.data) +
          Number(this.props.elementconfig.increment);
    if (tempVal > this.props.elementconfig.max) {
      tempVal = this.props.elementconfig.max;
    }
    this.context.changed(tempVal.toFixed(2), this.props.name);
  };

  onBlur = (event) => {
    if (event.target.value <= this.props.elementconfig.min) {
      this.context.changed(this.props.elementconfig.min, this.props.name);
    }
    if (event.target.value >= this.props.elementconfig.max) {
      this.context.changed(this.props.elementconfig.max, this.props.name);
    }
    if (event.target.value === '') {
      this.context.changed('', this.props.name);
    }
  };

  onChangeHandler = (event) => {
    console.log('CHANGED: ', event.target.value);
    this.context.changed(event.target.value, this.props.name);
  };

  render() {
    let isMinBound =
      this.props.value.data !== '' &&
      this.props.value.data <= this.props.elementconfig.min
        ? true
        : false;
    let isMaxBound =
      this.props.value.data !== '' &&
      this.props.value.data >= this.props.elementconfig.max
        ? true
        : false;
    let actual = this.props.value;
    let tempClasses = [];
    let error = null;
    if (
      this.props.validation &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
      error = <ErrorList value={{ data: this.props.value.errors }} />;
    }
    return (
      <div className={classes.Counter}>
        <div
          className={[
            classes.FlexGroupRow,
            classes.Wrapper,
            ...tempClasses
          ].join(' ')}>
          <Button onClick={this.decrement} disabled={isMinBound}>
            <Icon iconstyle='fas' code='minus' size='sm' />
          </Button>
          <input
            step={this.props.elementconfig.increment}
            ref={this.counterRef}
            value={this.props.value.data}
            onChange={(event) => this.onChangeHandler(event)}
            onInput={(event) => this.onChangeHandler(event)}
            onBlur={(event) => this.onBlur(event)}
          />
          <Button onClick={this.increment} disabled={isMaxBound}>
            <Icon iconstyle='fas' code='plus' size='sm' />
          </Button>
        </div>
        {error}
      </div>
    );
  }
}

export default Counter;
