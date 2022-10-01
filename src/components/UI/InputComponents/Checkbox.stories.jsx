import React, { useState}  from 'react';
import Checkbox from "./Checkbox";

export default {
  title: 'Examples/Checkbox',
  component: Checkbox
}

export const Example = (args) => {
  return (<Checkbox {...args} />)
}
Example.args = {
   name: 'toggleName',
  value: {
    data: 16,
    valid: true,
    touched: false,
    pristine: true,
    errors: []
  },
  // placeholder: '',
  // readOnly: false,
  componentconfig: {
    min: 10,
    max: 20,
    increment:1,
  },
  validation: {
    //isRequired:false
    }

}
Example.storyName = 'Checkbox';