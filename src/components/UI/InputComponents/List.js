import React, { Component } from 'react';
import classes from './List.module.scss';

class List extends Component {
  render() {
    return (
      <div className={classes.List}>
        <ul>
          {this.props.value.data.map((item, index) => {
            return <li key={'list' + index}>{item}</li>;
          })}
        </ul>
      </div>
    );
  }
}
export default List;
