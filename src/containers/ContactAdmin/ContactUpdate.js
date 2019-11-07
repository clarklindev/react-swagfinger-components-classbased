import React, { Component } from 'react';
import classes from './ContactUpdate.module.scss';
import Utils from '../../Utils';
import axios from '../../axios-contacts';
import SectionHeader from '../../components/UI/Headers/SectionHeader';
import Input from '../../components/UI/Input/Input';

class ContactUpdate extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.ContactUpdate,
      ContactUpdate.name,
      this.props.className
    ]);
  }

  state = {
    loadedContact: false,
    contact: {
      id: '',
      name: '',
      lastname: '',
      contactnumbers: [{ number: '' }],
      emails: [{ email: '' }]
    }
  };
  reset = () => {
    this.setState({
      loadedContact: false,
      contact: {
        id: '',
        name: '',
        lastname: '',
        contactnumbers: [{ number: '' }],
        emails: [{ email: '' }]
      }
    });
  };
  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');

    if (id) {
      axios.get(`/contacts/${id}.json`).then(response => {
        console.log('response: ', response.data);

        this.setState(prevState => ({
          loadedContact: true,
          contact: {
            ...prevState.contact,
            id: id
          }
        }));

        Object.keys(response.data).map(item => {
          console.log('item: ', item);
          return this.setState(prevState => ({
            contact: {
              ...prevState.contact,
              [item]: response.data[item]
            }
          }));
        });
      });
    }
  }

  nameChangeHandler = event => {
    console.log('nameChangeHandler');
    let val = event.target.value; //save value as setState is async and event will get lost
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        name: val
      }
    }));
  };
  lastnameChangeHandler = event => {
    console.log('lastnameChangeHandler');
    let val = event.target.value; //save value as setState is async and event will get lost
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        lastname: val
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
        return { ...contactnumber, number: val };
      }
    );
    this.setState(prevState => ({
      contact: { ...prevState.contact, contactnumbers: newContacts }
    }));
  };

  emailChangeHandler = i => event => {
    console.log('emailChangeHandler: ', event.target.value);
    let val = event.target.value;

    const updatedEmails = this.state.contact.emails.map((email, index) => {
      if (i !== index) {
        return email;
      }
      return { ...email, email: val };
    });
    this.setState(prevState => ({
      contact: { ...prevState.contact, emails: updatedEmails }
    }));
  };

  render() {
    let contact;

    if (this.state.loadedContact === true) {
      let contactnumbers = this.state.contact['contactnumbers'].map(
        (each, index) => {
          return (
            <Input
              inputtype="input"
              type="text"
              name="contactnumber"
              placeholder="contact number"
              key={index}
              value={this.state.contact['contactnumbers'][index].number}
              changed={this.contactnumberChangeHandler(index)}
            />
          );
        }
      );
      let emails = this.state.contact['emails'].map((each, index) => {
        return (
          <Input
            inputtype="input"
            type="text"
            name="email"
            placeholder="email"
            key={index}
            value={this.state.contact['emails'][index].email}
            changed={this.emailChangeHandler(index)}
          />
        );
      });

      contact = (
        <React.Fragment>
          <div className={classes.LabelButtonGroup}>
            <Input
              inputtype="input"
              type="text"
              name="name"
              placeholder="name"
              label="Name"
              value={this.state.contact['name']}
              changed={this.nameChangeHandler}
            />
          </div>

          <div className={classes.LabelButtonGroup}>
            <Input
              inputtype="input"
              type="text"
              name="last name"
              placeholder="last name"
              label="Last name"
              value={this.state.contact['lastname']}
              changed={this.lastnameChangeHandler}
            />
          </div>

          <div className={classes.LabelButtonGroup}>
            <label>Contact number</label>
            <ul>{contactnumbers}</ul>
          </div>

          <div className={classes.LabelButtonGroup}>
            <label>Email</label>
            <ul>{emails}</ul>
          </div>
        </React.Fragment>
      );
    }
    return (
      <div className={this.className}>
        <div className="container">
          <div className={[classes.Wrapper, 'container'].join(' ')}>
            <div className="row">
              <div className="col">
                <SectionHeader>Contact Update</SectionHeader>
              </div>
            </div>
            <div className="row">
              <div className="col">{contact}</div>
            </div>
            <div className="row">
              <div className="col">
                <button
                  onClick={() => {
                    //validate (super simple...)
                    if (
                      this.state.contact.name.trim() !== '' &&
                      this.state.contact.lastname.trim() !== '' &&
                      (this.state.contact.contactnumbers.length ||
                        this.state.contact.emails.length)
                    ) {
                      return this.props.onContactUpdated(
                        {
                          id: this.state.contact.id,
                          name: this.state.contact.name,
                          lastname: this.state.contact.lastname,
                          contactnumbers: this.state.contact.contactnumbers,
                          emails: this.state.contact.emails
                        },
                        () => console.log('callback...')
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
export default ContactUpdate;
