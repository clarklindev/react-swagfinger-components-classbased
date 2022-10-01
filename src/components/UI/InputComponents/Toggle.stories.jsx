import React, { useState}  from 'react';
import Toggle from "./Toggle";

export default {
  title: 'Examples/Toggle',
  component: Toggle
}

export const ToggleExample = (args) => {
  return (<Toggle {...args} />)
}
ToggleExample.args = {
  name: 'toggleName',
  value: {
    data: true,
  }
}
ToggleExample.storyName = 'Toggle';