import React from 'react';
import InputWithIcon from "./InputWithIcon";
import PropTypes from 'prop-types';

export default {
  title: 'Examples/InputWithIcon',
  component: InputWithIcon
}

export const Example = (args) => {
  return (<InputWithIcon {...args} />)
}
Example.args = {
  name: 'InputWithIcon',
  label: 'InputWithIcon',
  componentconfig: {
    placeholder: '',
    type: PropTypes.string,
    validation: {
      isRequired: false,
    },
    hasdivider: true,
    iconclick: () => { },
    iconcode: 'search',
    type: 'text',
    iconposition: 'right',
    iconsize: 'sm',
    iconstyle: 'fas',
  },
  value: {
    valid: false,
    touched: false,
    pristine: true,
    data: '1',
    errors: [],
  },

}
Example.storyName = 'InputWithIcon';

