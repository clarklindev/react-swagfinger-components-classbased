import React, { useState}  from 'react';
import RadioCollection from "./RadioCollection";

export default {
  title: 'Examples/RadioCollection',
  component: RadioCollection
}

export const Example = (args) => {
  return (<RadioCollection {...args} />)
}
Example.args = {
  //className: 'RadioBut',
  //checked: false,
  //value: true
  name: 'toggleName',
  value: {
    data: [true, false, false],
    valid: true,
    touched: false,
    pristine: true,
    errors: []
  },
  // placeholder: '',
  // readOnly: false,
  componentconfig: {
    options: 
      [{ value: true, displaytext:'a' }, { value: false,displaytext:'b' }, { value: false,displaytext:'c' }]
    
  //   validation: {
  //     isRequired:false
  //   }
   },

}
Example.storyName = 'RadioCollection';