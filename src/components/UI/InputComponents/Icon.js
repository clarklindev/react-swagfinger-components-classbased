import React, { Component } from 'react';
import classes from './Icon.module.scss';
// font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
  faBars,
  faTimes,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import {
  faEdit,
  faTrashAlt as farFaTrashAlt,
  faCalendarAlt
} from '@fortawesome/free-regular-svg-icons';

import Utils from '../../../Utils';
//add to fontawesome lib so we can reuse icons
library.add(
  faChevronLeft,
  faChevronRight,
  faEdit,
  faTimes,
  farFaTrashAlt,
  faPlus,
  faMinus,
  faBars,
  faCalendarAlt,
  faChevronDown,
  faSearch
);

class Icon extends Component {
  render() {
    let classList = Utils.getClassNameString([
      classes.Icon,
      Icon.name,
      this.props.className
    ]);
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
