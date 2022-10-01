import React from 'react';
import MultiRangeSlider from "./MultiRangeSlider";

export default {
  title: 'Examples/MultiRangeSlider',
  component: MultiRangeSlider
}

export const Example = (args) => {
  return (<MultiRangeSlider {...args} />)
}
Example.args = {
  name: 'MultiRangeSlider',
  value: { min: { data: 4, valid:true, touched:false, pristine: true, errors:[]}, max: {data:10, valid:true, touched:false, pristine: true, errors:[]} },
  componentconfig: {
    metadata: [{ label: 'min', value: 3 }, { label:'max', value:14}],
    validation: {
      isRequired: false
    },
  }
}
Example.storyName = 'MultiRangeSlider';