import React, { Component } from 'react';
import AddContact from '../../../containers/AddContact/AddContact';

class ContactAdmin extends Component {
  render() {
    return (
      <React.Fragment>
        <h1>Add Contact</h1>
        <AddContact contactAdded={this.props.onContactAdded}></AddContact>
      </React.Fragment>
    );
  }
}

export default ContactAdmin;
