import React, { Component } from 'react';
import classes from './Datepicker.module.scss';

import { ReactComponent as CalendarIcon } from '../Icons/CalendarIcon.svg';

class Datepicker extends Component {
  constructor(props) {
    super(props);

    // DO NOT EDIT ORDER... this is tracked by this.startOfWeek
    this.daysOfWeekLabels = {
      0: 'sun',
      1: 'mon',
      2: 'tue',
      3: 'wed',
      4: 'thu',
      5: 'fri',
      6: 'sat'
    };

    this.monthsOfYear = [
      'january',
      'february',
      'march',
      'april',
      'may',
      'june',
      'july',
      'august',
      'september',
      'october',
      'november',
      'december'
    ];
    this.datepickerRef = React.createRef();
    this.inputRef = React.createRef();
    this.calendarBodyRef = React.createRef();
  }

  state = {
    startOfWeek: 'sun', //'mon' | 'sun'
    showCalendar: false,
    isInteracting: false,
    currentdate: new Date(),
    pickeddate: null,

    viewstate: 'daypicker',

    valid: null,
    touched: false,

    format: 'full', //'iso' (default) eg. '2000-10-13' || 'full' eg. 'Thursday, 12 December 2019'
    position: 'absolute', //'absolute' | 'relative'
    daypicker: { arrows: true, month: true, year: true },
    monthpicker: { arrows: false, month: false, year: false },
    yearpicker: { arrows: true, month: false, year: false }
  };

  //here because date is passed as prop, done intially only once...
  componentDidUpdate() {
    if (this.state.pickeddate === null && this.props.value.data !== '') {
      this.setState({
        pickeddate: new Date(this.props.value.data)
      });
    }
  }
  // helper functions

  //FINDS WHAT DAY OF THE WEEK IS THE 1st
  //pass in 2 optional props: month(zero indexed), year.
  //default uses current month and year
  //returns zero index day of week 0-sunday...6-saturday
  firstDayInMonthIndex = (
    monthIndex = new Date().getMonth(),
    year = new Date().getFullYear()
  ) => {
    let month = monthIndex + 1;
    return new Date(`${year}-${month}-01`).getDay();
  };

  //returns 0 or 1,
  //defaults to using current year
  isLeapYear = (year = new Date().getFullYear()) => {
    return year % 4 || (year % 100 === 0 && year % 400) ? 0 : 1;
  };

  getMonthIndexFromString(str) {
    let index = this.monthsOfYear.findIndex((item) => {
      return item.includes(str.toLowerCase());
    });

    console.log('getMonthIndexFromString      :', index);
    return index;
  }

  //get decade - returns YYYY where rounded to closest decade
  getDecade = (year = new Date().getFullYear()) => {
    //take the year, divide by ten, then rid the decimal by flooring it, then multiply by 10
    return Math.floor(year / 10) * 10;
  };

  //calculates amount of days in a month of specific year
  //default: current month, current year
  //NOTE: this function gives same results as when using Date() like:
  /*
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth()+1, 0); //the ,0 is getting the last day of previous month, and so we +1 to current month
    */
  daysInMonth = (
    monthIndex = new Date().getMonth(),
    year = new Date().getFullYear()
  ) => {
    let month = monthIndex + 1;
    return month === 2
      ? 28 + this.isLeapYear(year)
      : 31 - (((month - 1) % 7) % 2);
  };

  //print year 'eg. yyyy'
  printYear = (year = new Date().getFullYear()) => {
    return year;
  };

  //print month string 'eg. January'
  printMonth = (monthIndex = new Date().getMonth()) => {
    console.log('PRINTMONTH: ', monthIndex);
    let monthString = this.monthsOfYear[monthIndex];
    //Capitalize first letter
    return monthString.charAt(0).toUpperCase() + monthString.slice(1);
  };

  //print decade format 'eg. yyyy-yyyy'
  printDecade = (year = new Date().getFullYear()) => {
    let decadeString = this.getDecade(year);
    //format decade range to yyyy-yyyy (decade is 10 years, counting from 0-9 years)
    return `${decadeString}-${decadeString + 9}`;
  };
  //-----------------------------------------------------------

  //returns table rows with years.
  yearpicker = (year = this.state.currentdate.getFullYear()) => {
    let counter = -6; //adjust offset
    let rows = 4;
    let cols = 3;
    return (
      <table className='CalendarTable'>
        <tbody>
          {[...Array(rows)].map((_, i) => {
            return (
              <tr key={'yearrow' + i}>
                {[...Array(cols)].map((_, j) => {
                  let output = (
                    <td key={'year' + counter}>
                      <div
                        className='year'
                        onClick={(event) => this.clickHandler(event)}
                        onMouseOver={(event) => {
                          this.onMouseOver(event);
                        }}
                        onMouseOut={(event) => {
                          this.onMouseOut(event);
                        }}
                        onBlur={(event) => {
                          this.onBlurHandler(event);
                        }}>
                        {this.state.currentdate.getFullYear() + counter}
                      </div>
                    </td>
                  );
                  if (counter < rows * cols) {
                    counter++;
                  }
                  return output;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  //month picker
  monthpicker = () => {
    const rows = 4;
    const cols = 3;
    let counter = 0;
    return (
      <table className='CalendarTable'>
        <tbody>
          {[...Array(rows)].map((_, i) => {
            return (
              <tr key={'monthrow' + i}>
                {[...Array(cols)].map((_, j) => {
                  let monthString = this.monthsOfYear[counter];
                  let monthStringFormatted =
                    monthString.charAt(0).toUpperCase() +
                    monthString.slice(1, 3);
                  if (counter < this.monthsOfYear.length) {
                    counter++;
                  }
                  return (
                    <td key={'month' + counter}>
                      <div
                        className='month'
                        onClick={(event) => this.clickHandler(event)}
                        onMouseOver={(event) => {
                          this.onMouseOver(event);
                        }}
                        onMouseOut={(event) => {
                          this.onMouseOut(event);
                        }}
                        onBlur={(event) => {
                          this.onBlurHandler(event);
                        }}>
                        {monthStringFormatted}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  daypicker = (
    monthIndex = this.state.currentdate.getMonth(), //zero-indexed
    year = this.state.currentdate.getFullYear()
  ) => {
    let tableHead = (
      <tr>
        {Object.keys(this.daysOfWeekLabels).map((each, i) => {
          let posInArray;
          switch (this.state.startOfWeek) {
            case this.daysOfWeekLabels[0]: //start of week is sunday
              posInArray = i;
              break;
            case this.daysOfWeekLabels[1]: //start of week is monday
              posInArray = i === 6 ? 0 : i + 1; //if i is 6 while looping, use 0,
              break;
            default:
              console.log('.startOfWeek not set');
          }
          return (
            <th key={'dayheader' + i}>{this.daysOfWeekLabels[posInArray]}</th>
          );
        })}
      </tr>
    );

    //table body
    // console.log('monthIndex: ', monthIndex);
    let firstDay = this.firstDayInMonthIndex(monthIndex, year); //zero indexed day of week
    let daysInMonthCount = this.daysInMonth(monthIndex, year);
    let startCounting = false;
    let dayCount = 1;
    let rows = 6; //(weeks) in month, needs to be 6 to cater for 1st starting on last day of generated week (Sat) which would push another row
    // console.log('firstDay: ', firstDay);
    let tableBody = [...Array(rows)].map((each, k) => {
      return (
        <tr key={'dayrow' + k}>
          {/*populate month from 1st on that day of week */
          Object.keys(this.daysOfWeekLabels).map((each, j) => {
            //array is zero indexed (j)
            if (startCounting === false) {
              //has not started counting yet, firstDay is zeroIndexed starting with 0
              switch (this.state.startOfWeek) {
                case 'mon':
                  //start counting at j or when j = 6 is a sun
                  if (firstDay === j + 1 || (firstDay === 0 && j === 6)) {
                    // console.log('start day of month: ', j + 1);
                    startCounting = true;
                  }
                  break;
                case 'sun':
                  if (firstDay === j) {
                    // console.log('start day of month: ', j);
                    startCounting = true;
                  }
                  break;
                default:
                // console.log('.startOfWeek not set');
              }
            }

            let day = null;
            if (startCounting && dayCount <= daysInMonthCount) {
              let extraClasses = '';
              //add active state
              if (
                this.state.pickeddate &&
                this.state.currentdate.getFullYear() ===
                  this.state.pickeddate.getFullYear() &&
                this.state.currentdate.getMonth() ===
                  this.state.pickeddate.getMonth()
              ) {
                if (
                  parseInt(dayCount) ===
                  parseInt(this.state.pickeddate.getDate())
                ) {
                  console.log('same day...', dayCount, 'day: ', day);
                  extraClasses = 'active';
                }
              }
              day = (
                <div
                  className={[classes.Day, extraClasses].join(' ')}
                  onClick={(event) => this.dayClickHandler(event)}
                  onMouseOver={(event) => {
                    this.onMouseOver(event);
                  }}
                  onMouseOut={(event) => {
                    this.onMouseOut(event);
                  }}
                  onBlur={(event) => {
                    this.onBlurHandler(event);
                  }}>
                  {dayCount}
                </div>
              );
              dayCount++;
            }

            return (
              <td
                key={'day' + j + k * Object.keys(this.daysOfWeekLabels).length}>
                {day}
              </td>
            );
          })}
        </tr>
      );
    });

    return (
      <table className='CalendarTable'>
        <thead>{tableHead}</thead>
        <tbody>{tableBody}</tbody>
      </table>
    );
  };

  switchState = (newviewstate) => {
    console.log('viewstate: ', newviewstate);
    if (this.state.viewstate !== newviewstate) {
      this.setState((prevState) => {
        this.inputRef.current.focus();
        return {
          viewstate: newviewstate,
          isInteracting: false
        };
      });
    }
  };

  //when input or calendar icon is clicked
  onShowCalendar = (event) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('onShowCalendar');
    console.log('this.state: ', this.state);
    this.inputRef.current.focus();
    this.setState((prevState) => {
      return {
        showCalendar: true,
        viewstate: 'daypicker',
        currentdate: prevState.pickeddate ? prevState.pickeddate : new Date(),
        touched: true
      };
    });
  };

  onHideCalendar = (event) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('onHideCalendar');
    console.log('this.state: ', this.state);
    this.setState((prevState) => {
      return {
        showCalendar: false
      };
    });
  };

  onToggleCalendar = (event) => {
    this.state.showCalendar === false
      ? this.onShowCalendar(event)
      : this.onHideCalendar(event);
  };

  onBlurHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('BLUR!!');
    console.log('event: ', event);
    if (this.state.isInteracting === false) {
      this.setState({ showCalendar: false });
    } else {
      //set focus on input
      this.inputRef.current.focus();
    }
  };

  onMouseOver = (event) => {
    this.setState((prevState) => {
      console.log('isInteracting:', true);
      return { isInteracting: true };
    });
  };

  onMouseOut = (event) => {
    this.setState((prevState) => {
      console.log('isInteracting:', false);
      return { isInteracting: false };
    });
  };

  decrease = (event) => {
    Array.from(
      this.calendarBodyRef.current.querySelectorAll('.active')
    ).forEach((item) => {
      item.classList.remove('active');
    });

    switch (this.state.viewstate) {
      case 'daypicker':
        this.setState((prevState) => {
          //when current month gets to 0, make it 11
          if (prevState.currentdate.getMonth() - 1 < 0) {
            return {
              currentdate: new Date(
                prevState.currentdate.getFullYear() - 1,
                this.monthsOfYear.length - 1
              )
            };
          }
          console.log('current month: ', prevState.currentdate.getMonth());

          let updatedYear = prevState.currentdate.getFullYear();
          let updatedMonth = prevState.currentdate.getMonth() - 1;
          return {
            currentdate: new Date(updatedYear, updatedMonth)
          };
        });
        break;
      case 'yearpicker':
        this.setState((prevState) => {
          return {
            currentdate: new Date(
              prevState.currentdate.getFullYear() - 12,
              prevState.currentdate.getMonth(),
              prevState.currentdate.getDate()
            )
          };
        });

        break;
      default:
        break;
    }
  };
  increase = (event) => {
    Array.from(
      this.calendarBodyRef.current.querySelectorAll('.active')
    ).forEach((item) => {
      item.classList.remove('active');
    });

    switch (this.state.viewstate) {
      case 'daypicker':
        this.setState((prevState) => {
          //when current month gets to 11, make it 0
          if (
            prevState.currentdate.getMonth() + 1 >
            this.monthsOfYear.length - 1
          ) {
            return {
              currentdate: new Date(prevState.currentdate.getFullYear() + 1, 0)
            };
          }

          return {
            currentdate: new Date(
              prevState.currentdate.getFullYear(),
              prevState.currentdate.getMonth() + 1
            )
          };
        });
        break;
      case 'yearpicker':
        this.setState((prevState) => {
          return {
            currentdate: new Date(
              prevState.currentdate.getFullYear() + 12,
              prevState.currentdate.getMonth(),
              prevState.currentdate.getDate()
            )
          };
        });
        break;
      default:
        break;
    }
  };

  clickHandler = (event) => {
    // event.preventDefault();
    // event.stopPropagation();
    console.log('other:', event.target.className);
    console.log('TARGET: ', event.target);

    //if month/year set state isInteracting to false so misclick can close window
    this.setState({ isInteracting: false });
    this.inputRef.current.focus();

    let target = event.target;

    switch (target.className) {
      case 'year':
        this.setState((prevState) => {
          return {
            currentdate: new Date(
              target.innerHTML,
              prevState.currentdate.getMonth(),
              prevState.currentdate.getDate()
            ),
            viewstate: 'daypicker' //go to daypicker
          };
        });
        break;

      case 'month':
        this.setState((prevState) => {
          let newdate = new Date(
            prevState.currentdate.getFullYear(),
            this.getMonthIndexFromString(target.innerHTML),
            prevState.currentdate.getDate()
          );
          return {
            currentdate: newdate,
            viewstate: 'daypicker' //go to daypicker
          };
        });
        break;
      default:
        console.log('target.className does not exist');
    }
  };

  dayClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    //set isInteracting to false to window can close on misclick
    this.setState({ isInteracting: false });
    this.inputRef.current.focus();
    let target = event.target;

    console.log('MAGIC: ', this.calendarBodyRef.current);

    Array.from(
      this.calendarBodyRef.current.querySelectorAll('.active')
    ).forEach((item) => {
      item.classList.remove('active');
    });

    //add the active class to the one clicked
    target.classList.add('active');

    //save the DOM we clicked on in state as 'pickeddate'
    //and save the pickeddate as a Date() object
    this.setState((prevState) => {
      return {
        pickeddate: new Date(
          `${prevState.currentdate.getFullYear()}-${prevState.currentdate.getMonth() +
            1}-${Math.abs(target.innerHTML)}`
        ),
        valid: true,
        touched: true
      };
    });
  };

  render() {
    let tempClasses = [];

    if (
      (this.props.validation.required &&
        !this.state.valid &&
        this.state.touched &&
        !this.props.value.pristine) ||
      (!this.state.touched && !this.props.value.pristine)
    ) {
      console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
    }

    let dateinput = (
      <div
        className={[classes.Dateinput, ...tempClasses].join(' ')}
        onClick={(event) => this.onToggleCalendar(event)}
        onBlur={(event) => {
          this.onBlurHandler(event);
        }}>
        <input
          {...this.props}
          placeholder={this.props.placeholder}
          readOnly
          {...this.props.elementconfig}
          ref={this.inputRef}
          value={
            this.state.pickeddate
              ? this.state.format === 'full'
                ? // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
                  new Date(this.state.pickeddate).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long', //long | 2-digit
                    day: '2-digit'
                  })
                : new Date(this.state.pickeddate).toISOString().substr(0, 10)
              : ''
          }
          onChange={(event) => {
            console.log('props.name: ', this.props.name);
            this.context.changed(event.target.name, this.props.name);
          }}
          onClick={(event) => {
            this.onShowCalendar(event);
          }}
        />

        <button
          onMouseOver={(event) => {
            this.onMouseOver(event);
          }}
          onMouseOut={(event) => {
            this.onMouseOut(event);
          }}>
          <CalendarIcon />
        </button>
      </div>
    );
    let displayposition =
      this.state.position === 'relative' ? 'relative' : null;

    let calendar = this.state.showCalendar ? (
      <div
        className={[classes.Calendar, displayposition].join(' ')}
        onMouseOver={(event) => {
          this.onMouseOver(event);
        }}
        onMouseOut={(event) => {
          this.onMouseOut(event);
        }}>
        <div className={classes.CalendarHeader}>
          {this.state[this.state.viewstate].arrows ? (
            <button
              className={[classes.Chevron, classes.Decrease].join(' ')}
              onClick={(event) => {
                this.decrease(event);
              }}
              onMouseOver={(event) => {
                this.onMouseOver(event);
              }}
              onMouseOut={(event) => {
                this.onMouseOut(event);
              }}
              onBlur={(event) => {
                this.onBlurHandler(event);
              }}>
              left
            </button>
          ) : null}
          <div className='StateButtons'>
            {this.state[this.state.viewstate].year ? (
              <button
                className={classes.Year}
                onClick={() => this.switchState('yearpicker')}
                onMouseOver={(event) => {
                  this.onMouseOver(event);
                }}
                onMouseOut={(event) => {
                  this.onMouseOut(event);
                }}>
                {this.state.currentdate.getFullYear()}
              </button>
            ) : null}
            {this.state[this.state.viewstate].month ? (
              <button
                className={classes.Month}
                onClick={() => this.switchState('monthpicker')}
                onMouseOver={(event) => {
                  this.onMouseOver(event);
                }}
                onMouseOut={(event) => {
                  this.onMouseOut(event);
                }}>
                {console.log('currentdate: ', this.state.currentdate)}
                {this.printMonth(this.state.currentdate.getMonth())}
              </button>
            ) : null}
          </div>
          {this.state[this.state.viewstate].arrows ? (
            <button
              className={[classes.Chevron, classes.Increase].join(' ')}
              onClick={(event) => {
                this.increase(event);
              }}
              onMouseOver={(event) => {
                this.onMouseOver(event);
              }}
              onMouseOut={(event) => {
                this.onMouseOut(event);
              }}
              onBlur={(event) => {
                this.onBlurHandler(event);
              }}>
              right
            </button>
          ) : null}
        </div>
        <div className={classes.CalendarBody} ref={this.calendarBodyRef}>
          {this[this.state.viewstate]()}
        </div>
      </div>
    ) : null;

    return (
      <div className={classes.Datepicker} ref={this.datepickerRef}>
        {dateinput}
        {calendar}
      </div>
    );
  }
}

export default Datepicker;
