import React, { Component } from 'react';
import classes from './Counter.module.scss';
import InputContext from '../../../context/InputContext';
import Icon from '../InputComponents/Icon';

class Counter extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.counterRef = React.createRef();
  }

  state = {
    prop: null,
    min: null,
    max: null
  };

  decrement = () => {
    let current = Number(this.counterRef.current.value);
    let tempVal = Number(current - this.props.elementconfig.step).toFixed(2);
    //console.log('current:', current, ' | DECREMENT: ', tempVal);
    this.counterRef.current.value = tempVal;
    var event = new Event('input', { bubbles: true });
    this.counterRef.current.dispatchEvent(event);
  };

  increment = () => {
    let current = Number(this.counterRef.current.value);
    let tempVal = Number(current + this.props.elementconfig.step).toFixed(2);
    //console.log('current:', current, ' | INCREMENT: ', tempVal);
    this.counterRef.current.value = tempVal;
    var event = new Event('input', { bubbles: true });
    this.counterRef.current.dispatchEvent(event);
  };

  onBlur = (event) => {
    if (event.target.value <= this.props.elementconfig.min) {
      this.context.changed(this.props.elementconfig.min, this.props.name);
    }
    if (event.target.value >= this.props.elementconfig.max) {
      this.context.changed(this.props.elementconfig.max, this.props.name);
    }
  };

  onChangeHandler = (event) => {
    console.log('CHANGED: ', this.props.name);
    this.context.changed(
      Number(event.target.value).toFixed(2),
      this.props.name
    );
  };

  render() {
    //console.log('PROP: ', this.props.value.data);
    //console.log('MIN: ', Number(this.props.elementconfig.min.toFixed(2)));
    //console.log('MAX: ', Number(this.props.elementconfig.max.toFixed(2)));
    let isMinBound =
      this.props.value.data <= this.props.elementconfig.min ? true : false;
    let isMaxBound =
      this.props.value.data >= this.props.elementconfig.max ? true : false;
    //console.log('min bound: ', isMinBound, ' | max bound: ', isMaxBound);
    return (
      <div className={classes.Counter}>
        <button disabled={isMinBound} onClick={this.decrement}>
          <Icon iconstyle='fas' code='minus' size='sm' />
        </button>
        <input
          min={Number(this.props.elementconfig.min.toFixed(2))}
          max={Number(this.props.elementconfig.max.toFixed(2))}
          step={Number(this.props.elementconfig.step).toFixed(2)}
          ref={this.counterRef}
          value={Number(this.props.value.data).toFixed(2)}
          onChange={(event) => this.onChangeHandler(event)}
          onInput={(event) => this.onChangeHandler(event)}
          onBlur={(event) => this.onBlur(event)}
        />
        <button disabled={isMaxBound} onClick={this.increment}>
          <Icon iconstyle='fas' code='plus' size='sm' />
        </button>
      </div>
    );
  }
}

export default Counter;
