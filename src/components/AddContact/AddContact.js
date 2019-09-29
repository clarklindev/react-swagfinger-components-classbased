import React, { Component } from 'react';
import classes from './AddContact.module.scss';
import Utils from '../../Utils';
import Input from '../../components/UI/Input/Input';
class AddContact extends Component {
  state = {
    name: '',
    lastname: '',
    contact: '',
    email: ''
  };

  reset = () => {
    this.setState({ name: '', lastname: '', contact: '', email: '' });
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

  emailChangeHandler = event => {
    this.setState({ email: event.target.value });
  };

  render() {
    let className = Utils.getClassNameString([
      classes.AddContact,
      AddContact.name,
      this.props.className
    ]);

    return (
      <div className={className}>
        <div>
          <Input
            inputtype="input"
            type="text"
            name="name"
            placeholder="name"
            label="name"
            changed={this.nameChangeHandler}
            value={this.state.name}
          />
        </div>
        <div>
          <Input
            inputtype="input"
            type="text"
            name="lastname"
            placeholder="lastname"
            label="last name"
            changed={this.lastnameChangeHandler}
            value={this.state.lastname}
          />
        </div>
        <div>
          <Input
            inputtype="input"
            type="text"
            name="contact"
            placeholder="contact"
            label="contact"
            changed={this.contactChangeHandler}
            value={this.state.contact}
          />

          <Input
            inputtype="input"
            type="text"
            name="contact"
            placeholder="contact"
            changed={this.contactChangeHandler}
            value={this.state.contact}
          />

          <button className={classes.IconButton}>add</button>
        </div>

        <div>
          <Input
            inputtype="input"
            type="email"
            name="email"
            placeholder="email"
            label="email"
            changed={this.emailChangeHandler}
            value={this.state.email}
          />

          <Input
            inputtype="input"
            type="email"
            name="email"
            placeholder="email"
            changed={this.emailChangeHandler}
            value={this.state.email}
          />

          <button className={classes.IconButton}>add</button>
        </div>

        <button
          onClick={() => {
            //validate
            if (
              this.state.name.trim() !== '' &&
              this.state.lastname.trim() !== '' &&
              this.state.contact.trim() !== '' &&
              this.state.email.trime() !== ''
            ) {
              return this.props.contactAdded(
                {
                  name: this.state.name,
                  lastname: this.state.lastname,
                  contact: this.state.contact,
                  email: this.state.email
                },
                this.reset
              );
            }
          }}>
          save
        </button>
      </div>
    );
  }
}
export default AddContact;
