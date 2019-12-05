import React from 'react';
class DatepickerYearState {
  constructor(datepicker) {}

  generateCalendarDecade = () => {
    const totalYears = 10;
    const rows = 5;
    const cols = 2;
    let counter = 0;
    let calendarYearsOfDecade;
    let decade = this.getDecade(this.state.currentDecade);

    return rows.map((each) => {
      return (
        <tr>
          {cols.map((each) => {
            let htmlcol;
            if (counter < totalYears) {
              counter++;
              htmlcol = (
                <td>
                  <div className='year'>{decade + counter}</div>
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
      <table className='calendar-yearview'>
        <tbody
          className='calendar-decades'
          onClick={(event) => this.decadeClickHandler(event)}>
          {this.generateCalendarDecade}
        </tbody>
      </table>
    );
  }
}
export default DatepickerYearState;
