import React, { Component } from 'react';
import classes from './Icon.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Utils from '../../../Utils';
class Icon extends Component {
  render() {
    let classList = Utils.getClassNameString([classes.Icon, Icon.name]);
    return (
      <div className={classList}>
        <FontAwesomeIcon
          icon={[this.props.iconstyle, this.props.code]}
          size={this.props.size}
          fixedWidth
        />
      </div>
    );
  }
}

export default Icon;
