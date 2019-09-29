import React, { Component } from 'react';
import AddContact from './AddContact/AddContact';

class AdminContact extends Component {
  render() {
    return (
      <React.Fragment>
        <h1>Add Contact</h1>
        <AddContact contactAdded={this.props.onContactAdded}></AddContact>
      </React.Fragment>
    );
  }
}

export default AdminContact;
