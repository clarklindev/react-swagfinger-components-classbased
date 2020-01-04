// Create Slider that contains value, valuemin, valuemax, and valuenow
import React, { Component } from 'react';
import classes from './MultiRangeSlider.module.scss';
import InputContext from '../../../context/InputContext';

class Slider extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);

    this.valueNow = null;
    this.railWidth = 0;
    this.railBorderWidth = 1;
    this.thumbWidth = 20;
    this.thumbHeight = 24;

    this.keyCode = Object.freeze({
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      pageUp: 33,
      pageDown: 34,
      end: 35,
      home: 36
    });
  }

  state = {
    valueNow: null,
    finalposition: null,
    labelNode: null
  };

  componentDidMount() {
    this.moveSliderTo(this.props.now);
  }

  moveSliderTo = (value) => {
    //if valueNow is higher
    if (value > this.props.max) {
      value = this.props.max;
    }
    //if valueNow is lower
    if (value < this.props.min) {
      value = this.props.min;
    }
    this.setState({ valueNow: value });
    this.railWidth = parseInt(this.props.railRef.current.offsetWidth);
    console.log('railWidth: ', this.railWidth);
    this.context.changed(
      {
        min: this.props.min,
        max: this.props.max,
        now: this.state.valueNow
      },
      this.props.name,
      this.props.index
    );

    //previous node
    if (this.props.index > 0) {
      this.context.changed(
        {
          min: this.props.sliders[this.props.index - 1].data.min,
          max: this.state.valueNow,
          now: this.props.sliders[this.props.index - 1].data.now
        },
        this.props.name,
        this.props.index - 1
      );
    }

    //next node
    if (this.props.index < this.props.sliders.length - 1) {
      this.context.changed(
        {
          min: this.state.valueNow,
          max: this.props.sliders[this.props.index + 1].data.max,
          now: this.props.sliders[this.props.index + 1].data.now
        },
        this.props.name,
        this.props.index + 1
      );
    }

    //pos
    let pos = Math.round(
      ((this.state.valueNow - this.props.railMin) *
        (this.railWidth - 2 * this.thumbWidth)) /
        (this.props.railMax - this.props.railMin)
    );

    console.log('POS! : ', pos);
    let finalposition = this.props.index > 0 ? pos + this.thumbWidth : pos;
    this.setState({ finalposition: finalposition });

    //set right label
    if (this.props.index > 0) {
      this.props.setLabelMax(
        finalposition +
          '|' +
          parseInt(
            ((finalposition - this.thumbWidth) /
              (this.railWidth - 2 * this.thumbWidth)) *
              100
          )
      );
    }
    //set left label
    if (this.props.index < this.props.sliders.length - 1) {
      this.props.setLabelMin(
        finalposition +
          '|' +
          parseInt(
            (finalposition / (this.railWidth - 2 * this.thumbWidth)) * 100
          )
      );
    }
  };

  onMouseMoveHandler = (event) => {
    console.log('MOVING');
    var diffX = event.pageX - this.props.railRef.current.offsetLeft;
    console.log('DIFX: ', diffX);
    console.log(
      'railMin: ',
      this.props.railMin,
      'railMax: ',
      this.props.railMax
    );
    let temp =
      this.props.railMin +
      ((this.props.railMax - this.props.railMin) * diffX) / this.railWidth;

    this.valueNow = parseInt(temp);
    console.log('valueNow: ', this.valueNow);

    this.moveSliderTo(this.valueNow);

    event.preventDefault();
    event.stopPropagation();
  };

  onMouseUpHandler = (event) => {
    console.log('UP');
    document.removeEventListener('mouseup', this.onMouseUpHandler);
    document.removeEventListener('mousemove', this.onMouseMoveHandler);
  };

  onMouseDownHandler = (event) => {
    console.log('MOUSE DOWN: ', this);

    document.addEventListener('mousemove', this.onMouseMoveHandler);
    document.addEventListener('mouseup', this.onMouseUpHandler);
    event.preventDefault();
    event.stopPropagation();
  };

  render() {
    return (
      <div
        style={{ position: 'absolute', left: this.state.finalposition }}
        className={classes.Slider}
        onMouseDown={this.onMouseDownHandler}>
        {/* {this.props.min}/{this.props.max}/{this.props.now} */}
      </div>
    );
  }
}
class MultiRangeSlider extends Component {
  constructor(props) {
    super(props);
    this.minLabelRef = React.createRef();
    this.maxLabelRef = React.createRef();
    this.railRef = React.createRef();
  }

  state = {
    labelMin: null,
    labelMax: null
  };

  setLabelMinHandler = (value) => {
    console.log('SETLABELMIN...');
    this.setState({ labelMin: value });
  };
  setLabelMaxHandler = (value) => {
    console.log('SETLABELMAX...');
    this.setState({ labelMax: value });
  };

  render() {
    return (
      <div className={classes.MultiRangeSlider}>
        <div className={classes.SliderLabel} ref={this.minLabelRef}>
          {this.state.labelMin}
        </div>
        <div ref={this.railRef} className={classes.Rail}>
          {this.props.value.map((each, index) => {
            return each.data ? (
              <Slider
                key={index}
                index={index}
                name={this.props.name}
                min={each.data.min}
                max={each.data.max}
                now={each.data.now}
                railRef={this.railRef}
                railMin={
                  index > 0
                    ? //has prev sibling
                      this.props.value[index - 1].data.min
                    : each.data.min
                }
                railMax={
                  index < this.props.value.length - 1
                    ? //has next sibling
                      this.props.value[index + 1].data.max
                    : each.data.max
                }
                sliders={this.props.value}
                setLabelMin={this.setLabelMinHandler}
                setLabelMax={this.setLabelMaxHandler}
              />
            ) : null;
          })}
        </div>
        <div className={classes.SliderLabel} ref={this.maxLabelRef}>
          {this.state.labelMax}
        </div>
      </div>
    );
  }
}

export default MultiRangeSlider;
