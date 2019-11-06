import React, { Component } from 'react';

import classes from './Layout.module.scss';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

class Layout extends Component {
  render() {
    return (
      <React.Fragment>
        <Toolbar />
        <main className={classes.Layout}>{this.props.children}</main>
      </React.Fragment>
    );
  }
}

export default Layout;
