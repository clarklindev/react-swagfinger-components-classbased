import React, { Component } from 'react';
import classes from './Datepicker.module.scss';
import Icon from './Icon';
import Button from '../Button/Button';
import ErrorList from './ErrorList';
import InputContext from '../../../context/InputContext';
import Input from './Input';
import { CheckValidity as validationCheck } from '../../../shared/validation';

class Datepicker extends Component {
  static contextType = InputContext;

  constructor(props) {
    super(props);
    this.datepickerRef = React.createRef();
    this.inputRef = React.createRef();
    this.calendarBodyRef = React.createRef();
  }

  state = {
    // DO NOT EDIT ORDER... this is tracked by this.startOfWeek
    daysOfWeekLabels: {
      0: 'sun',
      1: 'mon',
      2: 'tue',
      3: 'wed',
      4: 'thu',
      5: 'fri',
      6: 'sat',
    },

    monthsOfYear: [
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
      'december',
    ],
    daypicker: { arrows: true, month: true, year: true },
    monthpicker: { arrows: false, month: true, year: false },
    yearpicker: { arrows: true, month: false, year: true },
    startOfWeek: 'sun', //'mon' | 'sun'
    viewstate: 'daypicker',
    format: 'full', //'iso' (default) eg. '2000-10-13' || 'full' eg. 'Thursday, 12 December 2019'
    showCalendar: this.props.componentconfig.showcalendar,
    isInteracting: this.props.componentconfig.iscollapsible ? false : true,
    isCollapsible: this.props.componentconfig.iscollapsible,
    position: this.props.componentconfig.position, //'absolute' | 'relative'
    pickeddatestring: null,
    pickeddate: null, //the selected

    currentYear: null, //using individual numbers to keep track
    currentMonth: null, //using individual numbers to keep track
    currentDay: null, //using individual numbers to keep track
  };

  componentDidMount() {
    const currentDate = new Date();
    this.setState({
      currentYear: currentDate.getFullYear(),
      currentMonth: currentDate.getMonth(),
      currentDay: currentDate.getDay(),
    });
  }

  componentDidUpdate() {
    //string comparisons
    if (
      this.props.value.data !== '' &&
      this.props.value.data !== this.state.pickeddatestring
    ) {
      console.log('this.props.value: ', this.props.value); //string
      console.log('this.props.value.data: ', this.props.value.data); //string
      console.log('this.state.pickeddatestring: ', this.state.pickeddatestring); //string
      const updatedDate = new Date(this.props.value.data);
      console.log('updatedDate:', updatedDate);
      console.log('currentYear: ', updatedDate.getFullYear());
      console.log('currentMonth: ', updatedDate.getMonth());
      console.log('currentDay: ', updatedDate.getDay());

      this.setState({
        pickeddatestring: this.props.value.data,
        pickeddate: updatedDate,
        currentYear: updatedDate.getFullYear(),
        currentMonth: updatedDate.getMonth(),
        currentDay: updatedDate.getDay(),
      }); //sets to string format: 1948-1-12
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
    let index = this.state.monthsOfYear.findIndex((item) => {
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
    if (monthIndex !== null) {
      console.log('PRINTMONTH: ', monthIndex);
      let monthString = this.state.monthsOfYear[monthIndex];
      return monthString.substring(0, 1).toUpperCase() + monthString.slice(1);
    }
  };

  //print decade format 'eg. yyyy-yyyy'
  printDecade = (year = new Date().getFullYear()) => {
    let decadeString = this.getDecade(year);
    //format decade range to yyyy-yyyy (decade is 10 years, counting from 0-9 years)
    return `${decadeString}-${decadeString + 9}`;
  };

  //-----------------------------------------------------------
  //-----------------------------------------------------------

  //returns table rows with years.
  yearpicker = () => {
    let counter = -6; //adjust offset
    let rows = 4;
    let cols = 3;
    return (
      <table className={classes.CalendarTable}>
        <tbody>
          {[...Array(rows)].map((_, i) => {
            return (
              <tr key={'arrow' + i}>
                {[...Array(cols)].map((_, j) => {
                  let output = (
                    <td key={'year' + counter}>
                      <div
                        className={classes.Year}
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
                        {this.state.currentYear + counter}
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
  //-----------------------------------------------------------
  //-----------------------------------------------------------
  //month picker
  monthpicker = () => {
    const rows = 4;
    const cols = 3;
    let counter = 0;
    return (
      <table className={classes.CalendarTable}>
        <tbody>
          {[...Array(rows)].map((_, i) => {
            return (
              <tr key={'monthrow' + i}>
                {[...Array(cols)].map((_, j) => {
                  let monthString = this.state.monthsOfYear[counter];
                  let monthStringFormatted =
                    monthString.charAt(0).toUpperCase() +
                    monthString.slice(1, 3);
                  if (counter < this.state.monthsOfYear.length) {
                    counter++;
                  }
                  return (
                    <td key={'month' + counter}>
                      <div
                        className={classes.Month}
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
  //-----------------------------------------------------------
  //-----------------------------------------------------------
  daypicker = () => {
    let tableHead = (
      <tr>
        {Object.keys(this.state.daysOfWeekLabels).map((each, i) => {
          let posInArray;
          switch (this.state.startOfWeek) {
            case this.state.daysOfWeekLabels[0]: //start of week is sunday
              posInArray = i;
              break;
            case this.state.daysOfWeekLabels[1]: //start of week is monday
              posInArray = i === 6 ? 0 : i + 1; //if i is 6 while looping, use 0,
              break;
            default:
              console.log('.startOfWeek not set');
          }
          return (
            <th className={classes.DaysOfWeekLabel} key={'dayheader' + i}>
              {this.state.daysOfWeekLabels[posInArray]}
            </th>
          );
        })}
      </tr>
    );

    //table body
    const datenow = new Date();

    let monthIndex;
    if (this.state.currentMonth !== null) {
      monthIndex = this.state.currentMonth;
    } else {
      monthIndex = datenow.getMonth(); //zero-indexed
    }

    let year;
    if (this.state.currentYear !== null) {
      year = this.state.currentYear;
    } else {
      year = datenow.getFullYear();
    }

    let firstDay = this.firstDayInMonthIndex(monthIndex, year); //zero indexed day of week
    let daysInMonthCount = this.daysInMonth(monthIndex, year);
    let startCounting = false;
    let dayCount = 1;
    let rows = 6; //(weeks) in month, needs to be 6 to cater for 1st starting on last day of generated week (Sat) which would push another row
    // console.log('firstDay: ', firstDay);
    let tableBody = [...Array(rows)].map((each, k) => {
      return (
        <tr key={'dayrow' + k}>
          {
            /*populate month from 1st on that day of week */
            Object.keys(this.state.daysOfWeekLabels).map((each, j) => {
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
                  this.state.currentYear ===
                    this.state.pickeddate.getFullYear() &&
                  this.state.currentMonth === this.state.pickeddate.getMonth()
                ) {
                  if (
                    parseInt(dayCount) ===
                    parseInt(this.state.pickeddate.getDate())
                  ) {
                    //console.log('same day...', dayCount, 'day: ', day);
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
                  key={
                    'day' +
                    j +
                    k * Object.keys(this.state.daysOfWeekLabels).length
                  }>
                  {day}
                </td>
              );
            })
          }
        </tr>
      );
    });

    return (
      <table className={classes.CalendarTable}>
        <thead>{tableHead}</thead>
        <tbody>{tableBody}</tbody>
      </table>
    );
  };
  //-----------------------------------------------------------
  //-----------------------------------------------------------
  switchState = (newviewstate) => {
    console.log('viewstate: ', newviewstate);
    if (this.state.viewstate !== newviewstate) {
      this.setState((prevState) => {
        //this.inputRef.current.focus();
        return {
          viewstate: newviewstate,
          isInteracting: this.props.componentconfig.iscollapsible
            ? false
            : true,
        };
      });
    }
  };

  //when input or calendar icon is clicked
  onShowCalendar = (event) => {
    event.stopPropagation();
    event.preventDefault();
    // console.log('onShowCalendar');
    // console.log('this.state: ', this.state);
    //this.inputRef.current.focus();
    this.setState((prevState) => {
      console.log('onShowCalendar: ', prevState.pickeddate);
      let updatedate = prevState.pickeddate ? prevState.pickeddate : new Date();
      console.log('updateddate: ', updatedate);
      return {
        showCalendar: true,
        viewstate: 'daypicker',
        currentdate: updatedate,
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
        showCalendar: false,
      };
    });
  };

  onToggleCalendar = (event) => {
    if (this.state.isCollapsible) {
      this.state.showCalendar === false
        ? this.onShowCalendar(event)
        : this.onHideCalendar(event);
    }
  };

  onBlurHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    // console.log('BLUR!!');
    // console.log('event: ', event);
    if (
      this.state.isInteracting === false &&
      this.state.isCollapsible === true
    ) {
      this.setState({ showCalendar: false });
    } else {
      //set focus on input
      //this.inputRef.current.focus();
    }
  };

  onMouseOver = (event) => {
    this.setState((prevState) => {
      return { isInteracting: true };
    });
  };

  onMouseOut = (event) => {
    this.setState((prevState) => {
      return {
        isInteracting: this.props.componentconfig.iscollapsible ? false : true,
      };
    });
  };
  //-----------------------------------------------------------
  //-----------------------------------------------------------
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
          if (prevState.currentMonth - 1 < 0) {
            return {
              currentYear: prevState.currentYear - 1,
              currentMonth: this.state.monthsOfYear.length - 1,
            };
          }
          console.log('current month: ', prevState.currentMonth);

          let updatedYear = prevState.currentYear;
          let updatedMonth = prevState.currentMonth - 1;
          return {
            currentYear: updatedYear,
            currentMonth: updatedMonth,
          };
        });
        break;
      case 'yearpicker':
        this.setState((prevState) => {
          return {
            currentYear: parseInt(prevState.currentYear - 12),
            currentMonth: prevState.currentMonth,
            currentDay: prevState.currentDay,
          };
        });

        break;
      default:
        break;
    }
  };
  //-----------------------------------------------------------
  //-----------------------------------------------------------
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
          if (prevState.currentMonth + 1 > this.state.monthsOfYear.length - 1) {
            return {
              currentYear: prevState.currentYear + 1,
              currentMonth: 0,
            };
          }

          return {
            currentYear: prevState.currentYear,
            currentMonth: prevState.currentMonth + 1,
          };
        });
        break;
      case 'yearpicker':
        this.setState((prevState) => {
          return {
            currentYear: prevState.currentYear + 12,
            currentMonth: prevState.currentMonth,
            currentDay: prevState.currentDay,
          };
        });
        break;
      default:
        break;
    }
  };
  //-----------------------------------------------------------
  //-----------------------------------------------------------

  clickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('other:', event.target.className);
    console.log('TARGET: ', event.target);

    //if month/year set state isInteracting to false so misclick can close window
    this.setState({
      isInteracting: this.props.componentconfig.iscollapsible ? false : true,
    });
    //this.inputRef.current.focus();

    let target = event.target;

    switch (target.className) {
      case classes.Year:
        this.setState((prevState) => {
          return {
            currentYear: parseInt(target.innerHTML),
            currentMonth: prevState.currentMonth,
            viewstate: 'daypicker', //go to daypicker
          };
        });
        break;

      case classes.Month:
        this.setState((prevState) => {
          return {
            currentYear: prevState.currentYear,
            currentMonth: this.getMonthIndexFromString(target.innerHTML),
            currentDay: prevState.currentDay,
            viewstate: 'daypicker', //go to daypicker
          };
        });
        break;
      default:
        console.log('target.className does not exist');
    }
  };
  //-----------------------------------------------------------
  //-----------------------------------------------------------

  dayClickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();

    //set isInteracting to false to window can close on misclick
    this.setState({
      isInteracting: this.props.componentconfig.iscollapsible ? false : true,
    });
    //this.inputRef.current.focus();
    let target = event.target;

    Array.from(
      this.calendarBodyRef.current.querySelectorAll('.active')
    ).forEach((item) => {
      item.classList.remove('active');
    });

    //add the active class to the one clicked
    target.classList.add('active');

    console.log('CHANGED: ', this.inputRef.current.value);

    const pickeddatestring = `${this.state.currentYear}-${
      this.state.currentMonth + 1
    }-${Math.abs(target.innerHTML)}`;
    const pickeddate = new Date(pickeddatestring);

    console.log('pickeddate: ', pickeddate);

    this.context.changed('single', this.props.name, pickeddatestring);
    //save the DOM we clicked on in state as 'pickeddate'
    //and save the pickeddate as a Date() object
    this.setState((prevState) => {
      return {
        pickeddate: pickeddate,
        currentYear: this.state.currentYear,
        currentMonth: this.state.currentMonth,
        currentDay: Math.abs(target.innerHTML),
      };
    });
  };
  //-----------------------------------------------------------
  //-----------------------------------------------------------

  render() {
    let tempClasses = [];
    let error = null;
    if (
      (this.props.componentconfig.validation.hasOwnProperty('isRequired') &&
        this.props.value.valid === false &&
        this.props.value.touched === true) ||
      (this.props.value.touched === false &&
        this.props.value.pristine === false)
    ) {
      // console.log('pushing invalid: ');
      tempClasses.push(classes.Invalid);
      error = this.props.value.errors.length ? (
        <ErrorList value={{ data: this.props.value.errors }} />
      ) : null;
    }

    //note: with date calendar, if the iscollapsible property is 'false', position should be forced as to not be able to be set at absolute
    let viewPosition =
      this.state.position === 'relative' || this.state.isCollapsible === false
        ? 'relative'
        : null;

    //-----------------------------------------------------------
    //-----------------------------------------------------------

    return this.state.currentYear !== null &&
      this.state.currentMonth !== null &&
      this.state.currentDay !== null ? (
      <div className={classes.Datepicker} ref={this.datepickerRef}>
        <div
          className={[classes.Dateinput, ...tempClasses].join(' ')}
          onClick={(event) => this.onToggleCalendar(event)}
          onBlur={(event) => {
            this.onBlurHandler(event);
          }}>
          <Input
            componentconfig={{
              placeholder: this.props.componentconfig.placeholder,
              type: this.props.componentconfig.type,
              validation: this.props.componentconfig.validation,
            }}
            label={this.props.label}
            name={this.props.name}
            type={this.props.type}
            readOnly
            ref={this.inputRef}
            classlist={this.state.isCollapsible ? classes.Collapsible : null}
            value={{
              data: this.state.pickeddate
                ? this.state.format === 'full'
                  ? // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
                    this.state.pickeddate.toLocaleDateString('en-GB', {
                      // weekday: 'long',
                      year: 'numeric',
                      month: 'long', //long | 2-digit
                      day: 'numeric', //'2-digit'
                    })
                  : this.state.pickeddate.toISOString().substr(0, 10)
                : '',
              valid: this.props.value.valid,
              errors: this.props.value.errors,
            }}
            onChange={(event) => {
              console.log('something changed');
            }}
            onClick={(event) =>
              // console.log('SHOW CALENDAR!!');
              this.onShowCalendar(event)
            }
          />
          {this.state.isCollapsible ? (
            <Button
              onMouseOver={(event) => {
                this.onMouseOver(event);
              }}
              onMouseOut={(event) => {
                this.onMouseOut(event);
              }}>
              <Icon iconstyle='far' code='calendar-alt' size='sm' />
            </Button>
          ) : null}
        </div>

        {this.state.showCalendar ? (
          <div
            className={[classes.Calendar].join(' ')}
            onMouseOver={(event) => {
              this.onMouseOver(event);
            }}
            onMouseOut={(event) => {
              this.onMouseOut(event);
            }}>
            <div className={[classes.CalendarContent, viewPosition].join(' ')}>
              <div className={classes.CalendarHeader}>
                {/* Calendar Header - left arrow */}
                {this.state[this.state.viewstate].arrows ? (
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
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
                    <Icon iconstyle='fas' code='chevron-left' size='sm' />
                  </Button>
                ) : null}

                <div className={classes.StateButtons}>
                  {this.state[this.state.viewstate].year ? (
                    this.state.viewstate === 'yearpicker' ? (
                      <div className={[classes.Label, classes.Year].join(' ')}>
                        Year
                      </div>
                    ) : (
                      <Button
                        className={classes.Year}
                        onClick={() => this.switchState('yearpicker')}
                        onMouseOver={(event) => {
                          this.onMouseOver(event);
                        }}
                        onMouseOut={(event) => {
                          this.onMouseOut(event);
                        }}>
                        {this.printYear(this.state.currentYear)}
                      </Button>
                    )
                  ) : null}

                  {this.state[this.state.viewstate].month ? (
                    this.state.viewstate === 'monthpicker' ? (
                      <div className={[classes.Label, classes.Month].join(' ')}>
                        Month
                      </div>
                    ) : (
                      <Button
                        className={classes.Month}
                        onClick={() => this.switchState('monthpicker')}
                        onMouseOver={(event) => {
                          this.onMouseOver(event);
                        }}
                        onMouseOut={(event) => {
                          this.onMouseOut(event);
                        }}>
                        {this.printMonth(this.state.currentMonth)}
                      </Button>
                    )
                  ) : null}
                </div>
                {/* Calendar Header - right arrow */}
                {this.state[this.state.viewstate].arrows ? (
                  <Button
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
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
                    <Icon iconstyle='fas' code='chevron-right' size='sm' />
                  </Button>
                ) : null}
              </div>
              <div className={classes.CalendarBody} ref={this.calendarBodyRef}>
                {this[this.state.viewstate]()}
              </div>
            </div>
          </div>
        ) : null}
        {/*{error} */}
      </div>
    ) : null;
  }
}

export default Datepicker;
