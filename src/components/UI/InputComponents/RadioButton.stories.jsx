import React, { useState}  from 'react';
import RadioButton from "./RadioButton";

export default {
  title: 'Examples/RadioButton',
  component: RadioButton
}

export const Example = (args) => {
  return (<RadioButton {...args} />)
}
Example.args = {
  className: 'RadioBut',
  checked: false,
  value: true
}
Example.storyName = 'RadioButton';