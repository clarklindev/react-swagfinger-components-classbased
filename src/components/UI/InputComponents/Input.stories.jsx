import React from 'react';
import Input from "./Input";
import PropTypes from 'prop-types';

export default {
  title: 'Examples/Input',
  component: Input
}

export const Example = (args) => {
  return (<Input {...args} />)
}
Example.args = {
  name: 'input',
  label: 'Input',
  componentconfig: PropTypes.shape({
    placeholder: '',
    type: PropTypes.string,
    validation: {
      isRequired: false,
    },
  }),
  value: {
    valid: false,
    touched: false,
    pristine: true,
    data: '1',
    errors: [],
  },

}
Example.storyName = 'Input';