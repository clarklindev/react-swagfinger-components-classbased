import React from 'react';

import classes from './Toolbar.module.scss';
import NavigationItems from '../NavigationItems/NavigationItems';
import HamburgerButton from '../Sidemenu/HamburgerButton';

const toolbar = (props) => (
  <header className={classes.Toolbar}>
    <HamburgerButton clicked={props.hamburgerButtonClicked} />
    <nav className={classes.DesktopOnly}>
      <NavigationItems isAuthenticated={props.isAuth} />
    </nav>
  </header>
);

export default toolbar;
