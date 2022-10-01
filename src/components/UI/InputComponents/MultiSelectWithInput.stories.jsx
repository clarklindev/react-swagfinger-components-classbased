import React from 'react';
import MultiSelectWithInput from "./MultiSelectWithInput";

export default {
  title: 'Examples/MultiSelectWithInput',
  component: MultiSelectWithInput
}

export const Example = (args) => {
  return (<MultiSelectWithInput {...args} />)
}
Example.args = {
  name: 'multiSelectwithInput',
  value: [{data:'x', key:'asdasd'}],
  componentconfig: {
    draggable: true,
    options: [{ value: 'asdsd', displayText: 'asdasd' }],
    validation: {
      isRequired: false
    },
  },
  placeholder: 'xsdads',
  type:'object'
 
}
Example.storyName = 'MultiSelectWithInput';