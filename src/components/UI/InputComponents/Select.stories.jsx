import React, { useState}  from 'react';
import Select from "./Select";

export default {
  title: 'Examples/Select',
  component: Select
}

export const Example = (args) => {
  return (<Select {...args} />)
}
Example.args = {
  // name: 'toggleName',
  // value: {
  //   data: 'hello world',
  //   valid: true,
  //   touched: false,
  //   pristine: true,
  //   errors: []
  // },
  // placeholder: '',
  // readOnly: false,
  // componentconfig: {
  //   validation: {
  //     isRequired:false
  //   }
  // },

}
Example.storyName = 'Select';