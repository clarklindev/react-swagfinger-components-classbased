import React, { PureComponent } from 'react';
import classes from './Counter.module.scss';
import InputContext from '../../../context/InputContext';
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import ErrorList from './ErrorList';

class Counter extends PureComponent {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.counterRef = React.createRef();
  }

  decrement = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let tempVal =
      this.props.value.data === ''
        ? Number(this.props.componentconfig.default)
        : Number(this.props.value.data) -
          Number(this.props.componentconfig.increment);
    if (tempVal < this.props.componentconfig.min) {
      tempVal = this.props.componentconfig.min;
    }
    this.context.changed('single', this.props.name, tempVal.toFixed(2));
  };

  increment = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let tempVal =
      this.props.value.data === ''
        ? Number(this.props.componentconfig.default)
        : Number(this.props.value.data) +
          Number(this.props.componentconfig.increment);
    if (tempVal > this.props.componentconfig.max) {
      tempVal = this.props.componentconfig.max;
    }
    this.context.changed('single', this.props.name, tempVal.toFixed(2));
  };

  onBlur = (event) => {
    if (event.target.value <= this.props.componentconfig.min) {
      this.context.changed(
        'single',
        this.props.name,
        this.props.componentconfig.min
      );
    }
    if (event.target.value >= this.props.componentconfig.max) {
      this.context.changed(
        'single',
        this.props.name,
        this.props.componentconfig.max
      );
    }
    if (event.target.value === '') {
      this.context.changed('single', this.props.name, '');
    }
  };

  onChangeHandler = (event) => {
    console.log('CHANGED: ', event.target.value);
    this.context.changed('single', this.props.name, event.target.value);
  };

  render() {
    let isMinBound =
      this.props.value.data !== '' &&
      this.props.value.data <= this.props.componentconfig.min
        ? true
        : false;
    let isMaxBound =
      this.props.value.data !== '' &&
      this.props.value.data >= this.props.componentconfig.max
        ? true
        : false;
    let tempClasses = [];
    let error = null;
    if (
      this.props.validation &&
      !this.props.value.valid &&
      (this.props.value.touched ||
        (!this.props.value.touched && !this.props.value.pristine))
    ) {
      //console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
      error = <ErrorList value={{ data: this.props.value.errors }} />;
    }
    return (
      <div className={classes.Counter}>
        <div
          className={[
            classes.FlexGroupRow,
            classes.Wrapper,
            ...tempClasses,
          ].join(' ')}>
          <Button onClick={this.decrement} disabled={isMinBound}>
            <Icon iconstyle='fas' code='minus' size='sm' />
          </Button>
          <input
            step={this.props.componentconfig.increment}
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
