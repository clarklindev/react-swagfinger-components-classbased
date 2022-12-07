import React, { useState } from 'react';
import Counter from './Counter';

export default {
  title: 'Examples/Counter',
  component: Counter
};

export const Example = (args) => {
  return <Counter {...args} />;
};

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
    increment: 1
  },

  validation: {
    isRequired: false
  }
};

Example.storyName = 'Counter';
