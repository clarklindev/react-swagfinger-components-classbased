import React, { Component } from 'react';
import SectionHeader from '../../components/UI/Headers/SectionHeader';
import classes from './AddContact.module.scss';
import Utils from '../../Utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Input from '../../components/UI/Input/Input';

class AdminContact extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.AdminContact,
      AdminContact.name,
      this.props.className
    ]);
  }

  state = {
    name: '',
    lastname: '',
    contactnumbers: [{ number: '' }],
    emails: [{ email: '' }]
  };

  reset = () => {
    this.setState({
      name: '',
      lastname: '',
      contactnumbers: [{ number: '' }],
      emails: [{ email: '' }]
    });
  };

  nameChangeHandler = event => {
    this.setState({ name: event.target.value });
  };

  lastnameChangeHandler = event => {
    this.setState({ lastname: event.target.value });
  };

  //contact
  contactnumberAddHandler = event => {
    this.setState({
      contactnumbers: this.state.contactnumbers.concat([{ number: '' }])
    });
  };

  contactnumberRemoveHandler = i => event => {
    console.log('i:', i);
    let updatedContacts = this.state.contactnumbers.filter(
      (_, index) => i !== index
    );
    console.log('updatedContacts: ', updatedContacts);

    this.setState({
      contactnumbers: updatedContacts
    });
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

  //email
  emailAddHandler = event => {
    this.setState({
      emails: this.state.emails.concat([{ email: '' }])
    });
  };

  emailRemoveHandler = i => event => {
    console.log('i:', i);
    let updatedEmails = this.state.emails.filter((_, index) => i !== index);
    console.log('updatedEmails: ', updatedEmails);

    this.setState({
      emails: updatedEmails
    });
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
    return (
      <div className={this.className}>
        <div className="container">
          <div className={[classes.Wrapper, 'container'].join(' ')}>
            <div className="row">
              <div className="col">
                <SectionHeader>Add Contact</SectionHeader>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <Input
                  inputtype="input"
                  type="text"
                  name="name"
                  placeholder="name"
                  label="Name"
                  changed={this.nameChangeHandler}
                  value={this.state.name}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <Input
                  inputtype="input"
                  type="text"
                  name="lastname"
                  placeholder="last name"
                  label="Last name"
                  changed={this.lastnameChangeHandler}
                  value={this.state.lastname}
                />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <label className={classes.Label}>Contact number</label>
                <button
                  title="Add"
                  className={classes.AddButton}
                  onClick={this.contactnumberAddHandler}>
                  <FontAwesomeIcon icon={['fas', 'plus']} /> Add Number
                </button>
                {this.state.contactnumbers.map((contactnumber, index) => {
                  console.log('index', index);
                  return (
                    <div className={classes.ContactGroup} key={index}>
                      <Input
                        inputtype="input"
                        type="text"
                        name="contactnumber"
                        placeholder="contact number"
                        changed={this.contactnumberChangeHandler(index)}
                        value={contactnumber.number}
                      />
                      <button
                        title="Delete"
                        type="button"
                        className={classes.RemoveButton}
                        onClick={this.contactnumberRemoveHandler(index)}>
                        <FontAwesomeIcon icon={['far', 'trash-alt']} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="row">
              <div class="col">
                <label className={classes.Label}>Email</label>
                <button
                  title="Add"
                  className={classes.AddButton}
                  onClick={this.emailAddHandler}>
                  <FontAwesomeIcon icon={['fas', 'plus']} /> Add Email
                </button>
                {this.state.emails.map((each, index) => {
                  console.log('index', index);
                  return (
                    <div className={classes.ContactGroup} key={index}>
                      <Input
                        inputtype="input"
                        type="text"
                        name="email"
                        placeholder="email"
                        changed={this.emailChangeHandler(index)}
                        value={each.email}
                      />
                      <button
                        title="Delete"
                        type="button"
                        className={classes.RemoveButton}
                        onClick={this.emailRemoveHandler(index)}>
                        <FontAwesomeIcon icon={['far', 'trash-alt']} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="row">
              <div className="col">
                <button
                  onClick={() => {
                    //validate
                    if (
                      this.state.name.trim() !== '' &&
                      this.state.lastname.trim() !== '' &&
                      (this.state.contactnumbers.length ||
                        this.state.emails.length)
                    ) {
                      return this.props.onContactAdded(
                        {
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminContact;
