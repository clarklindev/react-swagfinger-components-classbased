import React from 'react';
import InputSearch from "./InputSearch";
import PropTypes from 'prop-types';

export default {
  title: 'Examples/InputSearch',
  component: InputSearch
}

export const Example = (args) => {
  return (<InputSearch {...args} />)
}
Example.args = {
  name: 'InputSearch',
  label: 'InputSearch',
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
Example.storyName = 'InputSearch';