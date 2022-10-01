import React from 'react';
import MultiSelect from "./MultiSelect";

export default {
  title: 'Examples/MultiSelect',
  component: MultiSelect
}

export const Example = (args) => {
  return (<MultiSelect {...args} />)
}
Example.args = {
  name: 'multiSelect',
   value: [],
  componentconfig: {
    validation: {
      isRequired: false
    },
    draggable: true,
  }
}
Example.storyName = 'MultiSelect';