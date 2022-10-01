import React, { useState}  from 'react';
import Textarea from "./Textarea";

export default {
  title: 'Examples/Textarea',
  component: Textarea
}

export const Example = (args) => {
  return (<Textarea {...args} />)
}
Example.args = {
  name: 'toggleName',
  value: {
    data: 'hello world',
    valid: true,
    touched: false,
    pristine: true,
    errors: []
  },
  placeholder: '',
  readOnly: false,
  componentconfig: {
    validation: {
      isRequired:false
    }
  },

}
Example.storyName = 'Textarea';