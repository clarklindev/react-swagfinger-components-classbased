import React, { Component } from 'react';
import classes from './AddContact.module.scss';
import Utils from '../../Utils';

class AddContact extends Component {
  state = {
    name: '',
    lastname: '',
    contact: ''
  };

  reset = () => {
    this.setState({ name: '', lastname: '', contact: '' });
  };

  nameChangeHandler = event => {
    this.setState({ name: event.target.value });
  };

  lastnameChangeHandler = event => {
    this.setState({ lastname: event.target.value });
  };

  contactChangeHandler = event => {
    this.setState({ contact: event.target.value });
  };

  render() {
    let className = Utils.getClassNameString([
      classes.AddContact,
      AddContact.name,
      this.props.className
    ]);

    return (
      <div className={className}>
        <input
          type="text"
          placeholder="name"
          onChange={this.nameChangeHandler}
          value={this.state.name}
        />
        <input
          type="text"
          placeholder="lastname"
          onChange={this.lastnameChangeHandler}
          value={this.state.lastname}
        />
        <input
          type="text"
          placeholder="contact"
          onChange={this.contactChangeHandler}
          value={this.state.contact}
        />

        <button
          onClick={() => {
            //validate
            if (
              this.state.name.trim() !== '' &&
              this.state.lastname.trim() !== '' &&
              this.state.contact.trim() !== ''
            ) {
              return this.props.contactAdded(
                {
                  name: this.state.name,
                  lastname: this.state.lastname,
                  contact: this.state.contact
                },
                this.reset
              );
            }
          }}>
          Add contact
        </button>
      </div>
    );
  }
}
export default AddContact;
