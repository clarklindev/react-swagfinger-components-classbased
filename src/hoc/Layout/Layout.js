import React, { Component } from 'react';

import classes from './Layout.module.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideMenu from '../../components/Navigation/Sidemenu/SideMenu';

class Layout extends Component {
  state = {
    showSideMenu: false
  };
  sideMenuCloseHandler = () => {
    this.setState({ showSideMenu: false });
  };
  sideMenuOpenHandler = () => {
    this.setState({ showSideMenu: true });
  };

  render() {
    return (
      <React.Fragment>
        <Toolbar hamburgerButtonClicked={this.sideMenuOpenHandler} />
        <SideMenu
          open={this.state.showSideMenu}
          closed={this.sideMenuCloseHandler}
        />
        <main className={classes.Layout}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
