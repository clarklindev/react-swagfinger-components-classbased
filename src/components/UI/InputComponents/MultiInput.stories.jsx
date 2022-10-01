import React from 'react';
import MultiInput from "./MultiInput";

export default {
  title: 'Examples/MultiInput',
  component: MultiInput
}

export const Example = (args) => {
  return (<MultiInput {...args} />)
}
Example.args = {
  name: 'MultiInput',
  type: 'array',
  className: 'MultiInput',
  classList: '',

  value: [{valid:true, touched:false, pristine:true, errors:[]}, {valid:true, touched:false, pristine:true, errors:[]}],
  componentconfig: {
    type:'text',
    placeholder:'',
    draggable: true,
  //   metadata: [{ label: 'min', value: 3 }, { label:'max', value:14}],
    validation: {
      isRequired: false
    },
  }
}
Example.storyName = 'MultiInput';