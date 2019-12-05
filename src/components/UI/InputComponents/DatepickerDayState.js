import React from 'react';
class DatepickerDayState {
  constructor(datepicker) {}

  //creates the header for days of week
  generateWeekdays = () => {
    let posInArray;
    return Object.keys(this.daysOfWeekLabels).map((each, i) => {
      switch (this.state.startOfWeek) {
        case this.daysOfWeekLabels[0]: //start of week is sunday
          posInArray = i;
          break;
        case this.daysOfWeekLabels[1]: //start of week is monday
          posInArray = i === 6 ? 0 : i + 1; //if i is 6 while looping, use 0,
          break;
      }
      return (
        <tr>
          <th>{this.daysOfWeekLabels[posInArray]}</th>
        </tr>
      );
    });
  };

  //creates the days of the month
  generateDaysOfMonth = (
    monthIndex = new Date().getMonth(),
    year = new Date().getFullYear()
  ) => {
    let firstDay = this.firstDayInMonthIndex(monthIndex, year);
    let daysInMonthCount = this.daysInMonth(monthIndex, year);
    let startCounting = false;
    let dayCount = 1;
    let rows = 5; //(weeks) in month, needs to be 5 to cater for 1st starting on last day of generated week (Sat) which would push another row

    return rows.map((each, i) => {
      return (
        <tr>
          {/*populate month from 1st on that day of week */
          this.daysOfWeekLabels.map((each, j) => {
            if (startCounting === false) {
              //has not started counting yet, firstDay is zeroIndexed starting with 0
              if (this.state.startOfWeek === 'mon') {
                //start counting at j or when j = 7 is a sun
                if (firstDay === j || (firstDay === 0 && j === 7)) {
                  console.log('start day of month: ', j);
                  startCounting = true;
                }
              } else if (this.startOfWeek === 'sun') {
                if (firstDay === j - 1) {
                  console.log('start day of month: ', j - 1);
                  startCounting = true;
                }
              }
            }

            let day = null;
            if (startCounting && dayCount <= daysInMonthCount) {
              day = <div className='day'>{dayCount}</div>;
              dayCount++;
            }

            if (
              this.state.pickedDate &&
              this.state.currentYear === this.state.pickedDate.getFullYear() &&
              this.state.currentMonth === this.state.pickedDate.getMonth()
            ) {
              //compare the text and picked date, if equal...
              if (
                parseInt({ dayCount }) ===
                parseInt(this.state.pickedDate.getDate())
              ) {
                day.classList.add('active');
                this.setState({ htmlPickedDay: day });
              }
            }
            return <td>{day}</td>;
          })}
        </tr>
      );
    });
  };

  draw() {
    return (
      <table className='calendar-dayview'>
        <thead className='calendar-daysofweek'>
          {/* {this.generateWeekdays} */}
          generateWeekdays
        </thead>
        <tbody
          className='calendar-daysofmonth'
          onClick={(event) => this.dayClickHandler(event)}>
          {/* {this.generateDaysOfMonth} */}
        </tbody>
      </table>
    );
  }
}
export default DatepickerDayState;
