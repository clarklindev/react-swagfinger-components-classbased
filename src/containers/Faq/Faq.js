import React, { Component } from 'react';
import classes from './Faq.module.scss';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import Accordion from '../../components/UI/InputComponents/Accordion';
class Faq extends Component {
  constructor(props) {
    super(props);

    this.config = {
      allowMultiOpen: false,
      openOnStartIndex: -1, //zero-index, negative value or invalid index to not open on start,
      hovereffect: true,
      onClick: () => {
        console.log('ouside onclick');
      },
    };
  }
  render() {
    return (
      <div className={classes.Faq}>
        <DefaultPageLayout label={'FAQ'}>
          <Accordion {...this.config}>
            <div label={<strong>question1</strong>}>content1</div>
            <div label={<strong>question2</strong>}>content2</div>
            <div label={<strong>question3</strong>}>content3</div>
          </Accordion>
        </DefaultPageLayout>
      </div>
    );
  }
}
export default Faq;
