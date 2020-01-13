import React from 'react';

import classes from './NavigationItems.module.scss';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    {/* <NavigationItem link="/auth">Auth</NavigationItem> */}
    <NavigationItem link='/phonebook'>Phonebook</NavigationItem>
    {props.isAuthenticated ? (
      <NavigationItem link='/phonebookadmin'>Phonebook Admin</NavigationItem>
    ) : null}
    {!props.isAuthenticated ? (
      <NavigationItem link='/login'>Login</NavigationItem>
    ) : (
      <NavigationItem link='/logout'>Logout</NavigationItem>
    )}
  </ul>
);

export default navigationItems;
