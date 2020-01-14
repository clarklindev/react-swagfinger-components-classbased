import React, { Component } from 'react';
import classes from './Faq.module.scss';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';

class Faq extends Component {
  render() {
    return (
      <div className={classes.Faq}>
        <DefaultPageLayout label={'hi'}>poo</DefaultPageLayout>
      </div>
    );
  }
}
export default Faq;
