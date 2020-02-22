import React, { Component } from 'react';
import ComponentFactory from './ComponentFactory';

class SearchFilter extends Component {
  render() {
    let obj = {
      component: 'inputwithicon',
      elementconfig: {
        type: 'search',
        placeholder: 'Enter your search',
        iconposition: 'left', //left || right
        iconstyle: 'fas',
        iconcode: 'search',
        iconsize: 'sm',
        hasdivider: true
      },
      name: 'search',
      label: 'Search',
      value: {
        data: this.props.value,
        valid: true,
        touched: false,
        pristine: true,
        errors: null
      }
    };
    return <ComponentFactory data={{ ...obj }} />;
  }
}

export default SearchFilter;
