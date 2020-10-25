import React, { Component } from 'react';
import SectionHeader from '../../components/UI/Headers/SectionHeader';
import classes from './DefaultPageLayout.module.scss';
import PropTypes from 'prop-types';

class DefaultPageLayout extends Component {
  render() {
    return (
      <div className={classes.DefaultPageLayout}>
        <div
          className={[
            classes.Wrapper,
            classes[this.props.type],
          ].join(' ')}>
          {this.props.label?
          <SectionHeader>{this.props.label}</SectionHeader>:null
          }
          {this.props.children}
        </div>
      </div>
    );
  }
}

DefaultPageLayout.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
export default DefaultPageLayout;
