import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.module.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideMenu from '../../components/Navigation/Sidemenu/SideMenu';
class Layout extends Component {
  state = {
    showSideMenu: false,
  };
  sideMenuCloseHandler = () => {
    this.setState({ showSideMenu: false });
  };
  sideMenuOpenHandler = () => {
    this.setState({ showSideMenu: true });
  };

  render() {
    return (
      <div className={classes.Layout}>
        {this.props.hideToolbar ? null : (
          <React.Fragment>
            <Toolbar
              isAuth={this.props.isAuthenticated}
              hamburgerButtonClicked={this.sideMenuOpenHandler}
            />
            <SideMenu
              isAuth={this.props.isAuthenticated}
              open={this.state.showSideMenu}
              closed={this.sideMenuCloseHandler}
            />
          </React.Fragment>
        )}
        <main>{this.props.children}</main>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
    hideToolbar: state.ui.hideToolbar,
  };
};

export default connect(mapStateToProps)(Layout);
