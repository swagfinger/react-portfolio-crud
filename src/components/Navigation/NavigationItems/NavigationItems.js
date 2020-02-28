import React from 'react';

import classes from './NavigationItems.module.scss';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => {
  return (
    <ul className={classes.NavigationItems}>
      {/* <NavigationItem link="/auth">Auth</NavigationItem> */}
      <NavigationItem link='/phonebook'>Phonebook</NavigationItem>
      {props.isAuthenticated ? (
        <NavigationItem link='/phonebookadmin'>Phonebook Admin</NavigationItem>
      ) : null}
      {props.isAuthenticated ? (
        <NavigationItem link='/upload'>Upload</NavigationItem>
      ) : null}
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
