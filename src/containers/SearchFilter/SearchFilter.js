import React, { Component } from 'react';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';

class SearchFilter extends Component {
  render() {
    let obj = {
      elementtype: 'input',
      elementconfig: { type: 'text', placeholder: 'Enter your search' },
      name: 'search',
      label: 'Search',
      value: { data: this.props.value, valid: 'true', touched: 'false' }
    };
    return <ComponentFactory data={{ ...obj }} />;
  }
}

export default SearchFilter;
