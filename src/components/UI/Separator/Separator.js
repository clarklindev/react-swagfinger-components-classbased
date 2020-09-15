import React from 'react';
import classes from './Separator.module.scss';

const Separator = (props) => {
  let separator = null;

  switch (props.direction) {
    case 'vertical':
      separator = (
        <div
          className={[
            classes.Separator,
            classes.VerticalSeparator,
            ...props.style.map((item) => classes[item]),
          ].join(' ')}
        />
      );
      break;
    case 'horizontal':
      separator = (
        <div
          className={[
            classes.Separator,
            classes.HorizontalSeparator,
            ...props.style.map((item) => classes[item]),
          ].join(' ')}
        />
      );
      break;
    default:
      throw new Error('direction prop required');
  }

  return separator;
};

export default Separator;
