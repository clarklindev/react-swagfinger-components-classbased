import React, { Component } from 'react';
import AddContact from './AddContact/AddContact';
import SectionHeader from '../../components/UI/Headers/SectionHeader';

class AdminContact extends Component {
  render() {
    return (
      <React.Fragment>
        <SectionHeader>Add Contact</SectionHeader>
        <AddContact contactAdded={this.props.onContactAdded}></AddContact>
      </React.Fragment>
    );
  }
}

export default AdminContact;
