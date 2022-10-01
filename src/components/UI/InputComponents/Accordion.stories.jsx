import React, { useState}  from 'react';
import Accordion from "./Accordion";

export default {
  title: 'Examples/Accordion',
  component: Accordion
}

export const Example = (args) => {
  return (<Accordion {...args}>
    <div>ha</div>
    <div>asd</div>
  </Accordion>)
}
Example.args = {
   name: 'toggleName',
  openOnStartIndex: 0,
  allowMultiOpen: false,

  hovereffect: false,
  style: {},
  onClick: () =>{},
  label:'accprdop'
}
Example.storyName = 'Accordion';