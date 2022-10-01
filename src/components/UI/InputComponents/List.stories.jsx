import React, { useState}  from 'react';
import List from "./List";

export default {
  title: 'Examples/List',
  component: List
}

export const Example = (args) => {
  return (<List {...args} />)
}
Example.args = {
  className: 'List',
  value: {
    data:[1,2,3]
  }
}
Example.storyName = 'List';