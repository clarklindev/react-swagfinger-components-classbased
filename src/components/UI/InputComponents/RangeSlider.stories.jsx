import React, { useState}  from 'react';
import RangeSlider from "./RangeSlider";

export default {
  title: 'Examples/RangeSlider',
  component: RangeSlider
}

export const Example = (args) => {
  return (<RangeSlider {...args} />)
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
    step: 1,
  },
  validation: {
    //isRequired:false
    }

}
Example.storyName = 'RangeSlider';