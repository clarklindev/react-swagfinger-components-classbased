import React from 'react';
import classes from './SectionHeader.module.scss';

const sectionHeader = props => {
  return (
    <div className={classes.SectionHeader}>
      <h2>{props.children}</h2>
    </div>
  );
};

export default sectionHeader;
