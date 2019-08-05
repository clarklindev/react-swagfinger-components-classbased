import React from 'react';

import classes from './NavigationItems.module.scss';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = () => (
	<ul className={classes.NavigationItems}>
		<NavigationItem link="/auth">Auth</NavigationItem>
		<NavigationItem link="/phonebook">Phonebook</NavigationItem>
	</ul>
);

export default navigationItems;
