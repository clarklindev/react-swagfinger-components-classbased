import React, { Component } from 'react';

class Checkbox extends Component {
  render() {
    return (
      <div className='checkbox'>
        <input type='checkbox' id={'checkbox' + this.props.name} />
        <label htmlFor={'checkbox' + this.props.name}>{this.props.label}</label>
      </div>
    );
  }
}

export default Checkbox;
