import React from 'react';

import classes from './NavigationItems.module.scss';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      {/* <NavigationItem link="/auth">Auth</NavigationItem> */}
      
      {props.isAuthenticated ? 'hello'
      : null}

      
      {!props.isAuthenticated ? (
        <React.Fragment>
        <NavigationItem link='/login'>Login</NavigationItem>
        <NavigationItem link='/phonebook'>Phonebook</NavigationItem>
        <NavigationItem link='/phonebookadmin'>Phonebook Admin</NavigationItem>
        <NavigationItem link='/formbuilder'>Formbuilder</NavigationItem>
        <NavigationItem link='/faq'>FAQ</NavigationItem>
        </React.Fragment>
      ) : (
        <NavigationItem link='/logout'>Logout</NavigationItem>
      )}
    </ul>
  );
};

export default navigationItems;
