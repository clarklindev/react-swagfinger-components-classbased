import React, { Component } from 'react';
import InputFactory from '../../components/UI/InputComponents/InputFactory';

class SearchFilter extends Component {
  render() {
    let obj = {
      elementtype: 'input',
      elementconfig: { type: 'text', placeholder: 'Enter your search' },
      name: 'search',
      label: 'Search',
      value: { data: this.props.value, valid: 'true', touched: 'false' }
    };
    return <InputFactory data={{ ...obj }} />;
  }
}

export default SearchFilter;
