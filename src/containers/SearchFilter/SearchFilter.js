import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';

class SearchFilter extends Component {
  render() {
    return (
      <Input
        elementtype='input'
        elementconfig={{ type: 'text', placeholder: 'Enter your search' }}
        name='search'
        label='Search'
        value={{ data: this.props.value, valid: 'true', touched: 'false' }}
        changed={this.props.changed}
      />
    );
  }
}

export default SearchFilter;
