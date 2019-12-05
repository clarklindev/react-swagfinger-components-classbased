import React from 'react';
class DatepickerMonthState {
  constructor(datepicker) {}

  generateCalendarMonths = () => {
    const totalMonths = Object.keys(this.monthsOfYear).length;
    const rows = 4;
    const cols = 3;
    let counter = 0;

    return rows.map(() => {
      return (
        <tr>
          {cols.map(() => {
            let htmlcol;
            if (counter < totalMonths) {
              let monthString = this.monthsOfYear[counter];
              let monthStringFormatted =
                monthString.charAt(0).toUpperCase() + monthString.slice(1, 3);
              counter++;
              htmlcol = (
                <td>
                  <div className='month'>{monthStringFormatted}</div>
                </td>
              );
            }
            return htmlcol;
          })}
        </tr>
      );
    });
  };

  draw() {
    return (
      <table className='calendar-monthview'>
        <tbody
          className='calendar-monthsofyear'
          onClick={(event) => this.monthClickHandler(event)}>
          {/* {this.generateCalendarMonths} */}
          generateCalendarMonths
        </tbody>
      </table>
    );
  }
}
export default DatepickerMonthState;
