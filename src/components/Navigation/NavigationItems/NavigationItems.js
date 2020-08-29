import React from 'react';

import classes from './NavigationItems.module.scss';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      {/* <NavigationItem link="/auth">Auth</NavigationItem> */}
      {props.isAuthenticated ? (
        <React.Fragment>
          <NavigationItem link='/phonebook'>Phonebook</NavigationItem>
          <NavigationItem link='/phonebookadmin'>
            Phonebook Admin
          </NavigationItem>
        </React.Fragment>
      ) : null}
      <NavigationItem link='/formbuilder'>Formbuilder</NavigationItem>
      <NavigationItem link='/faq'>FAQ</NavigationItem>
      {!props.isAuthenticated ? (
        <NavigationItem link='/login'>Login</NavigationItem>
      ) : (
        <NavigationItem link='/logout'>Logout</NavigationItem>
      )}
    </ul>
  );
};

export default navigationItems;
