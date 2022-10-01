import React, { useState}  from 'react';
import Button from "./Button";

export default {
  title: 'Examples/Button',
  component: Button
}

export const Example = (args) => {
  return (<Button {...args}>hello</Button>)
}
Example.args = {
   name: 'button',
  tabIndex: 0,
  reference: '',
  disabled: false,
  onClick: () => { },
  onBlur: () => { },
  title: 'dasd',
  onMouseOver: () => { },
  onMouseOut: () => { },
  type:'WithBorder'
  
}
Example.storyName = 'Button';