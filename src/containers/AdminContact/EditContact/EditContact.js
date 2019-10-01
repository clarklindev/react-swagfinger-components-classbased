import React, { Component } from 'react';
import classes from './EditContact.module.scss';
import Utils from '../../../Utils';
import axios from '../../../axios-contacts';

import Input from '../../../components/UI/Input/Input';

class EditContact extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.EditContact,
      'EditContact',
      props.className
    ]);
  }

  state = {
    loadedContact: false,
    id: '',
    name: '',
    lastname: '',
    contactnumbers: [{ number: '' }],
    emails: [{ email: '' }]
  };
  reset = () => {
    this.setState({
      loadedContact: false,
      id: '',
      name: '',
      lastname: '',
      contactnumbers: [{ number: '' }],
      emails: [{ email: '' }]
    });
  };
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');
    if (id) {
      axios.get(`/contacts/${id}.json`).then(response => {
        console.log('response: ', response.data);
        this.setState({ loadedContact: true, id: id });
        Object.keys(response.data).map(item => {
          console.log('item: ', item);
          this.setState({ [item]: response.data[item] });
          return true;
        });
      });
    }
  }

  nameChangeHandler = event => {
    console.log('nameChangeHandler');
    this.setState({ name: event.target.value });
  };
  lastnameChangeHandler = event => {
    console.log('lastnameChangeHandler');
    this.setState({ lastname: event.target.value });
  };
  contactnumberChangeHandler = i => event => {
    console.log('contactnumberChangeHandler: ', event.target.value);
    const newContacts = this.state.contactnumbers.map(
      (contactnumber, index) => {
        if (i !== index) {
          return contactnumber;
        }
        return { ...contactnumber, number: event.target.value };
      }
    );
    this.setState({ contactnumbers: newContacts });
  };
  emailChangeHandler = i => event => {
    console.log('emailChangeHandler: ', event.target.value);
    const updatedEmails = this.state.emails.map((email, index) => {
      if (i !== index) {
        return email;
      }
      return { ...email, email: event.target.value };
    });
    this.setState({ emails: updatedEmails });
  };

  render() {
    let contact;

    if (this.state.loadedContact === true) {
      let contactnumbers = this.state['contactnumbers'].map((each, index) => {
        return (
          <Input
            inputtype="input"
            type="text"
            name="contactnumber"
            placeholder="contact number"
            label="contact number"
            key={index}
            value={this.state['contactnumbers'][index].number}
            changed={this.contactnumberChangeHandler(index)}
          />
        );
      });
      let emails = this.state['emails'].map((each, index) => {
        return (
          <Input
            inputtype="input"
            type="text"
            name="email"
            placeholder="email"
            label="email"
            key={index}
            value={this.state['emails'][index].email}
            changed={this.emailChangeHandler(index)}
          />
        );
      });

      contact = (
        <React.Fragment>
          <div className={classes.LabelButtonGroup}>
            <h3>Name</h3>
            <Input
              inputtype="input"
              type="text"
              name="name"
              placeholder="name"
              label="name"
              value={this.state['name']}
              changed={this.nameChangeHandler}
            />
          </div>

          <div className={classes.LabelButtonGroup}>
            <h3>last name</h3>
            <Input
              inputtype="input"
              type="text"
              name="last name"
              placeholder="last name"
              label="last name"
              value={this.state['lastname']}
              changed={this.lastnameChangeHandler}
            />
          </div>

          <div className={classes.LabelButtonGroup}>
            <h3>contacts</h3>
            <ul>{contactnumbers}</ul>
          </div>

          <div className={classes.LabelButtonGroup}>
            <h3>emails</h3>
            <ul>{emails}</ul>
          </div>
        </React.Fragment>
      );
    }
    return (
      <div className={this.className}>
        <h2>Edit contact</h2>
        <div>{contact}</div>

        <button
          onClick={() => {
            //validate
            if (
              this.state.name.trim() !== '' &&
              this.state.lastname.trim() !== '' &&
              (this.state.contactnumbers.length || this.state.emails.length)
            ) {
              return this.props.onContactUpdated(
                {
                  id: this.state.id,
                  name: this.state.name,
                  lastname: this.state.lastname,
                  contactnumbers: this.state.contactnumbers,
                  emails: this.state.emails
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
export default EditContact;
