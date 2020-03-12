import React, { Component } from 'react';
import classes from './Faq.module.scss';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import Accordion from '../../components/UI/InputComponents/Accordion';
class Faq extends Component {
  constructor(props) {
    super(props);

    this.config = {
      value: [
        { title: 'question1', content: 'content1' },
        { title: 'question2', content: 'content2' },
        { title: 'question3', content: 'content3' }
      ],
      allowMultiOpen: false,
      openOnStartIndex: 0 //zero-index, negative value or invalid index to not open on start,
    };
  }
  render() {
    return (
      <div className={classes.Faq}>
        <DefaultPageLayout label={'FAQ'}>
          <Accordion {...this.config}></Accordion>
        </DefaultPageLayout>
      </div>
    );
  }
}
export default Faq;
