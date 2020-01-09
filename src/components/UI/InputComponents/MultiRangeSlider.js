// Create Slider that contains value, valuemin, valuemax, and valuenow
import React, { Component } from 'react';
import classes from './MultiRangeSlider.module.scss';
import InputContext from '../../../context/InputContext';
import Utils from '../../../Utils';

class MultiRangeSlider extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.minLabelRef = React.createRef();
    this.maxLabelRef = React.createRef();
    this.railRef = React.createRef();
    this.sliderRef = React.createRef();
  }

  state = {
    currentindex: null,
    railwidth: 0,
    thumbwidth: 0,
    displayvalues: [],
    labelmin: '',
    labelmax: ''
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.setState({
      railwidth: parseInt(this.railRef.current.offsetWidth),
      thumbwidth: parseInt(this.sliderRef.current.offsetWidth)
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  updateDimensions = () => {
    console.log('update DIMENSIONS');
    this.setState({
      railwidth: parseInt(this.railRef.current.offsetWidth),
      thumbwidth: parseInt(this.sliderRef.current.offsetWidth)
    });
    let tempLabelMin = this.restrictActualBoundaries(this.state.labelmin, 0);
    let convertedMin = this.convertToDisplayValue(tempLabelMin, 0);
    this.stateDisplayValuesHandler(convertedMin, 0); //set state

    let tempLabelMax = this.restrictActualBoundaries(this.state.labelmax, 1);
    let convertedMax = this.convertToDisplayValue(tempLabelMax, 1);
    this.stateDisplayValuesHandler(convertedMax, 1); //set state
  };

  //props or state updates...
  componentDidUpdate() {
    let min = this.props.value[0];
    let max = this.props.value[1];

    if (
      min !== undefined &&
      min.data &&
      min.data !== this.state.labelmin &&
      max !== undefined &&
      max.data &&
      max.data !== this.state.labelmax
    ) {
      //we want to still store the actual values in the database, the display values should be converted from the actual values
      //update positions on screen
      let tempLabelMin = this.restrictActualBoundaries(min.data, 0);
      let convertedMin = this.convertToDisplayValue(tempLabelMin, 0);
      this.stateDisplayValuesHandler(convertedMin, 0); //set state

      let tempLabelMax = this.restrictActualBoundaries(max.data, 1);
      let convertedMax = this.convertToDisplayValue(tempLabelMax, 1);
      this.stateDisplayValuesHandler(convertedMax, 1); //set state

      //actual values
      //set state
      this.stateMinHandler(tempLabelMin);
      this.stateMaxHandler(tempLabelMax);
    }
  }

  restrictActualBoundaries = (value, index = this.state.currentindex) => {
    let min = this.props.elementconfig.min;
    let max = this.props.elementconfig.max;
    let updatedValue = null;
    if (isNaN(value)) {
      value = '';
    }
    //has a previous node...set min to previous nodes' slider value
    if (index > 0) {
      min = this.props.value[index - 1].data;
      //console.log('SETTING MIN...', min);
    }
    //has a next node...set max to next nodes' slider value
    if (index < this.props.value.length - 1) {
      //console.log('SETTING MAX...', max);
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
    //console.log('updated value: ', updatedValue);
    return updatedValue;
  };

  // converts ACTUAL value to DISPLAY value
  convertToDisplayValue = (value, index = this.state.currentindex) => {
    let min = this.props.elementconfig.min;
    let max = this.props.elementconfig.max;

    return parseInt(
      ((value - min) / (max - min)) *
        (this.state.railwidth - 2 * this.state.thumbwidth)
    );
  };

  //converts DISPLAY value to ACTUAL value
  convertToActualValue = (value, index = this.state.currentindex) => {
    let min = this.props.elementconfig.min;
    let max = this.props.elementconfig.max;
    return parseInt(
      (value / (this.state.railwidth - 2 * this.state.thumbwidth)) *
        (max - min) +
        min
    );
  };

  //state save DISPLAY value
  stateDisplayValuesHandler = (newValue, index = this.state.currentindex) => {
    //update the state (DOM position depends on this...)
    this.setState((prevState) => {
      let updatedDisplayValues = [...prevState.displayvalues];
      updatedDisplayValues[index] = newValue;
      return {
        displayvalues: updatedDisplayValues
      };
    });
  };

  //update label via value
  stateMinHandler = (value) => {
    // console.log('SETLABELMIN...');
    this.setState({ labelmin: value });
    //update database
    this.context.changed(value, this.props.name, 0);
  };

  //update label via value
  stateMaxHandler = (value) => {
    // console.log('SETLABELMAX...');
    this.setState({ labelmax: value });
    //update database
    this.context.changed(value, this.props.name, 1);
  };

  //updates label via event
  labelUpdateHandler = (index, event) => {
    let testValue = parseInt(event.target.value);

    if (isNaN(testValue)) {
      testValue = '';
    }
    //update value in position 0
    index === 0
      ? this.stateMinHandler(testValue)
      : this.stateMaxHandler(testValue);
  };

  onBlurHandler = (event, index) => {
    //console.log('ONBLUR: ', index);
    //check if incoming is a number

    let val = parseInt(event.target.value);
    let tempRestricted = this.restrictActualBoundaries(val, index);
    //console.log('restricted val: ', temp);
    //update label again
    index === 0
      ? this.stateMinHandler(tempRestricted)
      : this.stateMaxHandler(tempRestricted);

    //update positions on screen
    let converted = this.convertToDisplayValue(tempRestricted, index);
    this.stateDisplayValuesHandler(converted, index);
  };

  onMouseMoveHandler = (event) => {
    //console.log('MOUSEMOVE');
    // console.log('MOVING');
    event.preventDefault();
    event.stopPropagation();

    //calculates position of mouse within rail coordinates
    //point where mouse is, minus the starting point of rail (fixed)
    //= the difference between these values gives you the position on the rail
    //pageX - mouse position relative to left of document - goes out of bounds...
    //offsetLeft - offset within current element
    let offset =
      this.state.currentindex > 0
        ? -this.state.thumbwidth * 1.5
        : -this.state.thumbwidth * 0.5;
    var positionOnRail = event.pageX - this.railRef.current.offsetLeft + offset;
    //keep within limits of rail width min
    if (positionOnRail <= 0) {
      positionOnRail = 0;
    }
    //keep within limits of rail width max
    if (positionOnRail >= this.state.railwidth) {
      positionOnRail = this.state.railwidth;
    }
    console.log('positionOnRail:', positionOnRail);
    //---------------------------------------------------------
    this.populateSlider(positionOnRail, this.state.currentindex);
  };

  scrollClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // console.log('target:', event.target.classList);
    let reg = new RegExp('Rail', 'g');
    let results = Array.from(event.target.classList).filter((each) => {
      return reg.test(each);
    });

    if (results.length > 0) {
      console.log('RAIL CLICK');
      let getclosest = Utils.getClosestChildElement(event, '[class*="Slider"]');
      console.log('x clicked:', Utils.getClickPosition(event));
      let closestChildIndex = getclosest.index;
      this.setState({
        currentindex: closestChildIndex
      });
      console.log('closestChildIndex: ', closestChildIndex);
      //---------------------------------------------------------
      let offset =
        closestChildIndex === 1
          ? -this.state.thumbwidth * 1.5
          : -this.state.thumbwidth * 0.5;
      var positionOnRail =
        event.pageX - this.railRef.current.offsetLeft + offset;
      //keep within limits of rail width min
      if (positionOnRail <= 0) {
        positionOnRail = 0;
      }
      //keep within limits of rail width max
      if (positionOnRail >= this.state.railwidth) {
        positionOnRail = this.state.railwidth;
      }

      this.populateSlider(positionOnRail, closestChildIndex);
    }
  };

  populateSlider = (positionOnRail, index = this.state.currentindex) => {
    //calculate slider values - in relation to current values ranges...
    let tempActual = this.convertToActualValue(positionOnRail, index);
    console.log('ACTUAL: ', tempActual);
    //keep within bounds of limits
    let tempActualRestricted = this.restrictActualBoundaries(tempActual, index);

    //---------------------------------------------------------
    //set left label
    if (index < this.props.value.length - 1) {
      //console.log('LEFT LABEL: ', tempActual);
      this.stateMinHandler(tempActualRestricted);
    }
    //set right label
    if (index > 0) {
      //console.log('RIGHT LABEL: ', tempActual);
      this.stateMaxHandler(tempActualRestricted);
    }
    let tempConverted = this.convertToDisplayValue(tempActualRestricted, index);
    console.log('DISPLAY: ', tempConverted);
    this.stateDisplayValuesHandler(tempConverted, index);
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

  // onClickHandler = (index, event) => {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   this.setState({ currentindex: index });
  // };

  render() {
    return (
      <div className={classes.MultiRangeSlider}>
        {/* min label */}
        <div className={classes.SliderLabel} ref={this.minLabelRef}>
          <input
            type='text'
            value={this.state.labelmin}
            // onClick={(event) => this.onClickHandler(0, event)}
            onChange={(event) => this.labelUpdateHandler(0, event)}
            onBlur={(event) => {
              this.onBlurHandler(event, 0);
            }}
          />
        </div>

        {/* rail */}
        <div
          ref={this.railRef}
          className={classes.Rail}
          onClick={(event) => this.scrollClickHandler(event)}>
          {/* Sliders */}
          {(Array.from(this.props.value) || []).map((each, index) => {
            return (
              <div
                className={classes.Slider}
                ref={this.sliderRef}
                key={index}
                style={{
                  position: 'relative',
                  left: this.state.displayvalues[index] + 'px'
                }}
                // onClick={(event) => this.onClickHandler(index, event)}
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
            value={this.state.labelmax}
            // onClick={(event) => this.onClickHandler(1, event)}
            onChange={(event) => this.labelUpdateHandler(1, event)}
            onBlur={(event) => {
              this.onBlurHandler(event, 1);
            }}
          />
        </div>
      </div>
    );
  }
}

export default MultiRangeSlider;
