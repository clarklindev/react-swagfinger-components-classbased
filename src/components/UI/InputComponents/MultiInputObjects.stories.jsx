import React from 'react';
import MultiInputObjects from "./MultiInputObjects";

export default {
  title: 'Examples/MultiInputObjects',
  component: MultiInputObjects
}

export const Example = (args) => {
  return (<MultiInputObjects {...args} />)
}
Example.args = {
  name: 'multiinputobjects',
  label: 'multi input objects',

  value: [],
  componentconfig: {
    allowmultiopen: true,
    defaultinputs: 3,
    metadata: [
      {
        component: 'input',
        label: 'url',
        name: 'url',
        placeholder: 'url',
        type: 'string',
        validation: { isRequired: true }
      }
    ]
  }
}
Example.storyName = 'MultiInputObjects';