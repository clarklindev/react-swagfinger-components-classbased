import React, { Component } from 'react';
import classes from './ErrorList.module.scss';
import { stringHelper } from '../../../shared';
import Icon from '../Icon/Icon';

class ErrorList extends Component {
  render() {
    let classList = stringHelper.getUniqueClassNameString([
      classes.ErrorList,
      ErrorList.name,
      this.props.className
    ]);
    return (
      <div className={classList}>
        <ul>
          {(this.props.value.data || []).map((item, index) => {
            return (
              <li key={'errorlist' + index}>
                <Icon
                  className={classes.Icon}
                  iconstyle="fas"
                  code={'exclamation-circle'}
                  size="sm"
                />
                {item}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
export default ErrorList;
