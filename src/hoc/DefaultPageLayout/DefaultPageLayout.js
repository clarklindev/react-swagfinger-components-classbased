import React, { Component } from 'react';
import SectionHeader from '../../components/UI/Headers/SectionHeader';
import classes from './DefaultPageLayout.module.scss';
import PropTypes from 'prop-types';

class DefaultPageLayout extends Component {
  render() {
    return (
      <div className={classes.DefaultPageLayout}>
        <div className='container'>
          <div className={[classes.Wrapper, 'container'].join(' ')}>
            <div className='row'>
              <div className='col'>
                <SectionHeader>{this.props.label}</SectionHeader>
              </div>
            </div>
            <div className='row'>
              <div className='col'>{this.props.children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

DefaultPageLayout.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};
export default DefaultPageLayout;
