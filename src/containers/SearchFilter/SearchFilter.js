import React, { Component } from 'react';
import Input from '../../components/UI/Input/Input';

class SearchFilter extends Component {
  render() {
    return (
      <Input
        inputtype="input"
        type="text"
        name="search"
        placeholder="search"
        label="Search"
        changed={this.props.changed}
      />
    );
  }
}

export default SearchFilter;
