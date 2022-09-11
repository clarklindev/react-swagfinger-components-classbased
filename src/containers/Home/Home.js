import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';

import Card from '../../components/UI/Card/Card';
import {Accordion, Breadcrumb, Checkbox, CheckboxCollection, Counter, Datepicker, DraggableItem, ErrorList, Expandable, GalleryItem, GalleryManager, Input, InputPassword, InputSearch, InputWithIcon, InputWithInput, List, ListItem, MultiInput, MultiInputObjects, MultiRangeSlider, MultiSelect, MultiSelectWithInput, RadioButton, RadioCollection, RangeSlider, Select, SelectToAccordion, Text, TextArea, Toggle}  from '../../components/UI/InputComponents';
import React, { Component } from 'react';
class Home extends Component {

  state = {
    checkboxChecked: false
  }

  accordionConfig = {
    allowMultiOpen: false,
    openOnStartIndex: -1, //zero-index, negative value or invalid index to not open on start,
    hovereffect: true,
    onClick: () => {
      console.log('ouside onclick');
    },
    style: {},
  };

  checkboxConfig = {
    checked : this.state.checkboxChecked,
    onChange : (value)=>{
      this.setState({checkboxChecked:value});
    }
  };

  render(){
    return (
      <div>
        <DefaultPageLayout label='Components'>
          <Card style={['Padding']}>
              <h4>Accordion</h4>

              {/* accordion content must be passed in as children of Accordion element */}
              <Accordion {...this.accordionConfig}>
                <div label={<strong>question1</strong>}>content1</div>
                <div label={<strong>question2</strong>}>content2</div>
                <div label={<strong>question3</strong>}>content3</div>
              </Accordion>
              <br/>
              {/* specific to firebase <Breadcrumb></Breadcrumb> */}
  
                
              {/* basic checkbox */}
              <Checkbox {...this.checkboxConfig}/>

              {/* multicheckbox */}
              
          </Card>
        </DefaultPageLayout>
      </div>
    );
  }
  

};

export default Home;