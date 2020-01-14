import React, { Component } from 'react';
import classes from './Faq.module.scss';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import Accordion from '../../components/UI/InputComponents/Accordion';
class Faq extends Component {
  render() {
    return (
      <div className={classes.Faq}>
        <DefaultPageLayout label={'FAQ'}>
          <Accordion></Accordion>
        </DefaultPageLayout>
      </div>
    );
  }
}
export default Faq;
