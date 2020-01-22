import React, { Component } from 'react';
import classes from './List.module.scss';
import Utils from '../../../Utils';

class List extends Component {
  render() {
    let classList = Utils.getClassNameString([
      classes.List,
      List.name,
      this.props.className
    ]);
    return (
      <div className={classList}>
        <ul>
          {(this.props.value.data || []).map((item, index) => {
            return <li key={'list' + index}>{item}</li>;
          })}
        </ul>
      </div>
    );
  }
}
export default List;
