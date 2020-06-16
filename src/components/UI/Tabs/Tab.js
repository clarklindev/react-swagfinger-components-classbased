import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from './Tab.module.scss';

class Tab extends Component {
  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render() {
    let extraClasses = [];

    if (this.props.activeTab === this.props.label) {
      extraClasses.push(classes.Tablistactive);
    }

    return (
      <li
        className={[classes.Tab, ...extraClasses].join(' ')}
        onClick={this.onClick}
      >
        {this.props.label}
      </li>
    );
  }
}

Tab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Tab;
