import React, { Component } from 'react';
import classes from './EditContact.module.scss';
import Utils from '../../../Utils';
import axios from '../../../axios-contacts';

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
    loadedContact: null
  };

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    //get id in url query params
    const id = query.get('id');
    if (id) {
      axios.get(`/contacts/${id}.json`).then(response => {
        console.log(response);
        this.setState({ loadedContact: response.data });
      });
    }
  }

  render() {
    let contact;

    if (this.state.loadedContact) {
      let contactnumbers = this.state.loadedContact['contactnumbers'].map(
        (each, index) => {
          return <input key={index} value={each.number} />;
        }
      );
      let emails = this.state.loadedContact['emails'].map((each, index) => {
        return <input key={index} value={each.email} />;
      });

      contact = (
        <React.Fragment>
          <div className={classes.LabelButtonGroup}>
            <h3>Name</h3>
            <input value={this.state.loadedContact['name']} />
          </div>
          <div className={classes.LabelButtonGroup}>
            <h3>last name</h3>
            <input value={this.state.loadedContact['lastname']} />
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
