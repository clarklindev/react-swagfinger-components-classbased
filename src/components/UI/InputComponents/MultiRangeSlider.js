// Create Slider that contains value, valuemin, valuemax, and valuenow
import React, { Component } from 'react';
import classes from './MultiRangeSlider.module.scss';
import InputContext from '../../../context/InputContext';
// import Utils from '../../../Utils';

class MultiRangeSlider extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.minLabelRef = React.createRef();
    this.maxLabelRef = React.createRef();
    this.railRef = React.createRef();
    this.sliderRef = React.createRef();

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
    currentindex: null,
    railWidth: 0,
    thumbWidth: 0,
    labelMin: '',
    labelMax: '',
    displayvalues: []
  };

  componentDidMount() {
    this.setState({
      railWidth: parseInt(this.railRef.current.offsetWidth),
      thumbWidth: parseInt(this.sliderRef.current.offsetWidth)
    });
  }
  componentDidUpdate() {
    let min = this.props.value[0];
    let max = this.props.value[1];

    if (
      min !== undefined &&
      min.data &&
      min.data !== this.state.labelMin &&
      max !== undefined &&
      max.data &&
      max.data !== this.state.labelMax
    ) {
      let tempLabelMin = this.restrictBoundaries(min.data, 0);
      let tempLabelMax = this.restrictBoundaries(max.data, 1);

      this.setState({
        labelMin: tempLabelMin,
        labelMax: tempLabelMax
      });

      //update positions on screen
      this.convertToDisplayValues(tempLabelMin, 0);
      this.convertToDisplayValues(tempLabelMax, 1);
      //we want to still store the actual values in the database, the display values should be converted from the actual values
      this.context.changed(tempLabelMin, this.props.name, 0);
      this.context.changed(tempLabelMax, this.props.name, 1);
    }
  }

  setLabelMinHandler = (value) => {
    // console.log('SETLABELMIN...');
    this.setState({ labelMin: value });
  };
  setLabelMaxHandler = (value) => {
    // console.log('SETLABELMAX...');
    this.setState({ labelMax: value });
  };

  labelUpdate = (index, event) => {
    let testValue = parseInt(event.target.value);

    if (isNaN(testValue)) {
      testValue = '';
    }
    //update value in position 0
    index === 0
      ? this.setLabelMinHandler(testValue)
      : this.setLabelMaxHandler(testValue);
  };

  onBlur = (event, index) => {
    console.log('ONBLUR: ', index);
    //check if incoming is a number

    let val = parseInt(event.target.value);
    let temp = this.restrictBoundaries(val, index);
    console.log('restricted val: ', temp);

    if (temp < this.props.elementconfig.min) {
      this.context.changed(
        this.props.elementconfig.min,
        this.props.name,
        index
      );
      this.setLabelMinHandler(this.props.elementconfig.min);
    }
    if (temp > this.props.elementconfig.max) {
      this.context.changed(
        this.props.elementconfig.max,
        this.props.name,
        index
      );
      this.setLabelMaxHandler(this.props.elementconfig.max);
    }

    //update label again
    index === 0 ? this.setLabelMinHandler(temp) : this.setLabelMaxHandler(temp);

    this.convertToDisplayValues(temp, index);
    this.context.changed(temp, this.props.name, index);
  };

  restrictBoundaries = (value, index = this.state.currentindex) => {
    let min = this.props.elementconfig.min;
    let max = this.props.elementconfig.max;
    let updatedValue = 0;
    if (isNaN(value)) {
      value = 0;
    }
    //has a previous node...set min to previous nodes' slider value
    if (index > 0) {
      min = this.props.value[index - 1].data;
      console.log('SETTING MIN...', min);
    }
    //has a next node...set max to next nodes' slider value
    if (index < this.props.value.length - 1) {
      console.log('SETTING MAX...', max);
      max = this.props.value[index + 1].data;
    }
    //keep within bounds of chosen values
    updatedValue = value;
    if (value < min) {
      updatedValue = min;
    }
    if (value > max) {
      updatedValue = max;
    }
    console.log('updated value: ', updatedValue);
    return updatedValue;
  };

  onMouseMoveHandler = (event) => {
    console.log('MOUSEMOVE');
    // console.log('MOVING');
    event.preventDefault();
    event.stopPropagation();

    //calculates position of mouse within rail coordinates
    //point where mouse is, minus the starting point of rail (fixed)
    //= the difference between these values gives you the position on the rail
    //pageX - mouse position relative to left of document - goes out of bounds...
    //offsetLeft - offset within current element
    var diffX = event.pageX - this.railRef.current.offsetLeft;
    //keep within limits of rail width min
    if (diffX <= 0) {
      diffX = 0;
    }
    //keep within limits of rail width max
    if (diffX >= this.state.railWidth) {
      diffX = this.state.railWidth;
    }
    console.log(
      `pageX:${event.pageX}, railOffset: ${this.railRef.current.offsetLeft}, diffX: ${diffX}`
    );
    //-----------------------------------------------------------------
    //slider relationship bounds of values
    //range values eg. 0, 10000
    //max / min bounds for current node
    let min = this.props.elementconfig.min;
    let max = this.props.elementconfig.max;
    //has a previous node...set min to previous nodes' slider value
    if (this.state.currentindex > 0) {
      min = this.props.value[this.state.currentindex - 1].data;
    }
    //has a next node...set max to next nodes' slider value
    if (this.state.currentindex < this.props.value.length - 1) {
      max = this.props.value[this.state.currentindex + 1].data;
    }

    //calculate slider values - in relation to current values ranges...
    let temp = parseInt(min + ((max - min) * diffX) / this.state.railWidth);
    //keep within bounds of limits
    temp = this.restrictBoundaries(temp);

    //set left label
    if (this.state.currentindex < this.props.value.length - 1) {
      console.log('LEFT LABEL: ', temp);
      this.setLabelMinHandler(temp);
    }

    //set right label
    if (this.state.currentindex > 0) {
      console.log('RIGHT LABEL: ', temp);
      this.setLabelMaxHandler(temp);
    }

    //we want to still store the actual values in the database, the display values should be converted from the actual values
    this.context.changed(temp, this.props.name, this.state.currentindex);
    console.log('SLIDER VALUE: ', temp);

    //==========================================================
    //up till now the values are relative to the range,
    //we need to convert values relative to width of rail
    this.convertToDisplayValues(temp, this.state.currentindex);
  };

  convertToDisplayValues = (value, index = this.state.currentindex) => {
    //corrected to rail offset values
    //set the registration point of slider

    let correctedVal =
      index > 0
        ? //right
          ((parseInt(value) - this.props.elementconfig.min) /
            (this.props.elementconfig.max - this.props.elementconfig.min)) *
            (this.state.railWidth - 2 * this.state.thumbWidth) +
          this.state.thumbWidth
        : //left
          ((parseInt(value) - this.props.elementconfig.min) /
            (this.props.elementconfig.max - this.props.elementconfig.min)) *
          (this.state.railWidth - 2 * this.state.thumbWidth);

    //update the state (DOM position depends on this...)
    this.setState((prevState) => {
      let updatedDisplayValues = [...prevState.displayvalues];
      updatedDisplayValues[index] = correctedVal;
      return {
        displayvalues: updatedDisplayValues
      };
    });
  };

  scrollClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // console.log('target:', event.target.classList);

    let reg = new RegExp('Rail', 'g'); //check if we hit rail
    let results = Array.from(event.target.classList).filter((each) => {
      return reg.test(each);
    });

    if (results.length > 0) {
      console.log('RAIL CLICK');
      //     let getclosest = Utils.getClosestChildElement(event, '[class*="Slider"]');
      //     let closestChild = getclosest.value;

      //     let closestChildIndex = getclosest.index;

      //     //manually trigger click
      //     console.log('closestChild: ', closestChild);
      //     console.log('closestChildIndex: ', closestChildIndex);

      //     console.log('min: ', closestChild.min);
    }
  };

  onMouseUpHandler = (event) => {
    console.log('UP');
    document.removeEventListener('mouseup', this.onMouseUpHandler);
    document.removeEventListener('mousemove', this.onMouseMoveHandler);
  };

  onMouseDownHandler = (index, event) => {
    document.addEventListener('mousemove', this.onMouseMoveHandler);
    document.addEventListener('mouseup', this.onMouseUpHandler);
    this.setState({ currentindex: index });
  };

  onClickHandler = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ currentindex: index });
  };

  render() {
    return (
      <div className={classes.MultiRangeSlider}>
        <div className={classes.SliderLabel} ref={this.minLabelRef}>
          {/* min label */}
          <input
            type='text'
            value={this.state.labelMin}
            onClick={(event) => this.onClickHandler(0, event)}
            onChange={(event) => this.labelUpdate(0, event)}
            onBlur={(event) => {
              this.onBlur(event, 0);
            }}
          />
        </div>

        {/* rail */}
        <div
          ref={this.railRef}
          className={classes.Rail}
          onClick={(event) => this.scrollClickHandler(event)}>
          {/* Sliders */}
          {this.props.value.map((each, index) => {
            return (
              <div
                className={classes.Slider}
                ref={this.sliderRef}
                key={index}
                style={{
                  position: 'absolute',
                  left: this.state.displayvalues[index] + 'px'
                }}
                onClick={(event) => this.onClickHandler(index, event)}
                onMouseDown={(event) => {
                  this.onMouseDownHandler(index, event);
                }}></div>
            );
          })}
        </div>

        {/* max label */}
        <div className={classes.SliderLabel} ref={this.maxLabelRef}>
          <input
            type='text'
            value={this.state.labelMax}
            onClick={(event) => this.onClickHandler(1, event)}
            onChange={(event) => this.labelUpdate(1, event)}
            onBlur={(event) => {
              this.onBlur(event, 1);
            }}
          />
        </div>
      </div>
    );
  }
}

export default MultiRangeSlider;
