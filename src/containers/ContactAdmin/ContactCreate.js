import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SectionHeader from '../../components/UI/Headers/SectionHeader';
import classes from './ContactCreate.module.scss';
import Utils from '../../Utils';
import Input from '../../components/UI/Input/Input';
import Modal from '../../components/UI/Modal/Modal';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class ContactCreate extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ContactCreate,
      ContactCreate.name,
      this.props.className
    ]);
  }

  state = {
    contact: {
      name: '',
      lastname: '',
      contactnumbers: [{ number: '' }],
      emails: [{ email: '' }]
    }
  };

  reset = () => {
    this.setState({
      contact: {
        id: '',
        name: '',
        lastname: '',
        contactnumbers: [{ number: '' }],
        emails: [{ email: '' }]
      }
    });
  };

  nameChangeHandler = event => {
    // setState is "async", so by the time the function you pass to setState is executed (and the event is accessed), the event is no longer around.
    let val = event.target.value; //save the target before event dissapears

    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        name: val
      }
    }));
  };

  lastnameChangeHandler = event => {
    let val = event.target.value;
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        lastname: val
      }
    }));
  };

  //contact
  contactnumberAddHandler = event => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contactnumbers: prevState.contact.contactnumbers.concat([
          { number: '' }
        ])
      }
    }));
  };

  contactnumberRemoveHandler = i => event => {
    console.log('i:', i);
    let updatedContacts = this.state.contact.contactnumbers.filter(
      (_, index) => i !== index
    );
    console.log('updatedContacts: ', updatedContacts);

    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contactnumbers: updatedContacts
      }
    }));
  };

  contactnumberChangeHandler = i => event => {
    console.log('contactnumberChangeHandler: ', event.target.value);
    let val = event.target.value;
    const newContacts = this.state.contact.contactnumbers.map(
      (contactnumber, index) => {
        if (i !== index) {
          return contactnumber;
        }
        return { ...contactnumber, number: val }; //update the number of the one that has the same index
      }
    );
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contactnumbers: newContacts
      }
    }));
  };

  //email
  emailAddHandler = event => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        emails: prevState.contact.emails.concat([{ email: '' }])
      }
    }));
  };

  emailRemoveHandler = i => event => {
    console.log('i:', i);
    let updatedEmails = this.state.contact.emails.filter(
      (_, index) => i !== index
    );
    console.log('updatedContacts: ', updatedEmails);

    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        emails: updatedEmails
      }
    }));
  };

  emailChangeHandler = i => event => {
    console.log('emailChangeHandler: ', event.target.value);
    let val = event.target.value;

    const updatedEmails = this.state.contact.emails.map((email, index) => {
      if (i !== index) {
        return email;
      }
      return { ...email, email: val }; //update the number of the one that has the same index
    });
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        emails: updatedEmails
      }
    }));
  };

  render() {
    return (
      <React.Fragment>
        {/* add modal just in-case needed, show binds to state of true/false */}
        <Modal show={false}></Modal>

        <div className={this.className}>
          <div className="container">
            <div className={[classes.Wrapper, 'container'].join(' ')}>
              <div className="row">
                <div className="col">
                  <SectionHeader>Contact Create</SectionHeader>
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
                    value={this.state.contact.name}
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
                    value={this.state.contact.lastname}
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
                  {this.state.contact.contactnumbers.map(
                    (contactnumber, index) => {
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
                    }
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <label className={classes.Label}>Email</label>
                  <button
                    title="Add"
                    className={classes.AddButton}
                    onClick={this.emailAddHandler}>
                    <FontAwesomeIcon icon={['fas', 'plus']} /> Add Email
                  </button>
                  {this.state.contact.emails.map((each, index) => {
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
                        this.state.contact.name.trim() !== '' &&
                        this.state.contact.lastname.trim() !== '' &&
                        (this.state.contact.contactnumbers.length ||
                          this.state.contact.emails.length)
                      ) {
                        return this.props.onContactCreated(
                          {
                            name: this.state.contact.name,
                            lastname: this.state.contact.lastname,
                            contactnumbers: this.state.contact.contactnumbers,
                            emails: this.state.contact.emails
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
      </React.Fragment>
    );
  }
}

export default withErrorHandler(ContactCreate);
