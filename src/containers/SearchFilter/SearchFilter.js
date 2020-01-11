import React, { Component } from 'react';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';

class SearchFilter extends Component {
  render() {
    let obj = {
      elementtype: 'inputwithicon',
      elementconfig: {
        type: 'search',
        placeholder: 'Enter your search',
        iconposition: 'left', //left || right
        iconstyle: 'fas',
        iconcode: 'search',
        iconsize: 'sm'
      },
      name: 'search',
      label: 'Search',
      value: { data: this.props.value, valid: 'true', touched: 'false' }
    };
    return <ComponentFactory data={{ ...obj }} />;
  }
}

export default SearchFilter;
