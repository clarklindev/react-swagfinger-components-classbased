import React, { useState}  from 'react';
import CheckboxCollection from "./CheckboxCollection";

export default {
  title: 'Examples/CheckboxCollection',
  component: CheckboxCollection
}

export const Example = (args) => {
  return (<CheckboxCollection {...args} />)
}
Example.args = {
  name: 'CheckboxCollection',
  value: [{
    data: [],
    valid: true,
    touched: false,
    pristine: true,
    errors: []
  }],
 
  componentconfig: {
    options: 
      [{ value: true, displaytext:'a' }, { value: false,displaytext:'b' }, { value: false,displaytext:'c' }]
    

   },

}
Example.storyName = 'CheckboxCollection';