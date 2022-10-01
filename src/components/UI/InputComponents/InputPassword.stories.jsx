import React from 'react';
import InputPassword from "./InputPassword";
import PropTypes from 'prop-types';

export default {
  title: 'Examples/InputPassword',
  component: InputPassword
}

export const Example = (args) => {
  return (<InputPassword {...args} />)
}
Example.args = {
  name: 'inputPassword',
  label: 'InputPassword',
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
Example.storyName = 'InputPassword';