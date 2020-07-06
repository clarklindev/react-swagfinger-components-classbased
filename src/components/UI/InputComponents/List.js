import React, { Component } from 'react';
import classes from './List.module.scss';

class List extends Component {
  render() {
    return (
      <div className={classes.List}>
        <ul>
          {(Array.from(this.props.value.data) || []).map((item, index) => {
            //console.log('ITEM: ', item);
            return <li key={'list' + index}>{item}</li>;
          })}
        </ul>
      </div>
    );
  }
}
export default List;
