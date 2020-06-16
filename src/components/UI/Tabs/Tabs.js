import React, { Component } from 'react';
import Tab from './Tab';
import PropTypes from 'prop-types';
import classes from './Tabs.module.scss';

class Tabs extends Component {
  state = {
    activeTab: this.props.children[0].props.label,
  };

  onClickTabItem = (tab) => {
    console.log('TAB: ', tab);
    this.setState({ activeTab: tab });
  };

  render() {
    return (
      <div className={classes.Tabs}>
        <ol className={classes.Tablist}>
          {this.props.children.map((child) => {
            const label = child.props.label;

            return (
              <Tab
                activeTab={this.state.activeTab}
                key={label}
                label={label}
                onClick={this.onClickTabItem}
              />
            );
          })}
        </ol>

        <div className={classes.Tabcontent}>
          {this.props.children.map((child) => {
            if (child.props.label !== this.state.activeTab) {
              return undefined;
            }
            return child.props.children;
          })}
        </div>
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.instanceOf(Array).isRequired,
};

export default Tabs;
