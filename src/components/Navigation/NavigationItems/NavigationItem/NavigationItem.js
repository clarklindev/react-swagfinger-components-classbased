import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import classes from './NavigationItem.module.scss';
import MenuContext from '../../../../context/MenuContext';

const NavigationItem = (props) => {
  const menuContext = useContext(MenuContext);

  return (
    <li className={classes.NavigationItem}>
      <NavLink
        to={props.link}
        exact={props.exact}
        activeClassName={classes.active}
        onClick={menuContext.closeMenu}>
        {props.children}
      </NavLink>
    </li>
  );
};

export default NavigationItem;
