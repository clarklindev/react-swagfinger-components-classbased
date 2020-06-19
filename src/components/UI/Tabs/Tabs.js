import React, { Component } from 'react';
import Tab from './Tab';
import PropTypes from 'prop-types';
import classes from './Tabs.module.scss';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: this.props.tabheaders[0],
    };
  }

  onClickTabItem = (tab) => {
    console.log('TAB: ', tab);
    this.setState({ activeTab: tab });
    this.props.onClick(tab);
  };

  render() {
    return (
      <div className={classes.Tabs}>
        <ol className={classes.Tablist}>
          {this.props.tabheaders.map((header) => {
            return (
              <Tab
                activeTab={this.state.activeTab}
                key={header}
                label={header}
                onClick={this.onClickTabItem}
              />
            );
          })}
        </ol>
      </div>
    );
  }
}

Tabs.propTypes = {
  tabheaders: PropTypes.array.isRequired,
};

export default Tabs;
