import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import Contact from '../../components/Contact/Contact';

import classes from './AdminPhonebook.module.scss';
import Utils from '../../Utils';

class AdminPhonebook extends Component {
  componentDidMount() {
    this.props.onFetchContacts();
  }

  render() {
    const className = Utils.getClassNameString([
      classes.AdminPhonebook,
      AdminPhonebook.name,
      this.props.className
    ]);

    return (
      <div className={className}>
        <h1>Phonebook Admin</h1>

        <Link
          to={{
            pathname: '/addcontact'
          }}>
          Add Contact
        </Link>

        <div>
          <ul className={classes.Ul}>
            {console.log('here!!!: ', this.props.storedPhonebook)}
            {this.props.storedPhonebook.map(phonebookEntry => {
              return (
                <li className={classes.Li} key={phonebookEntry.id}>
                  <Contact
                    id={phonebookEntry.id}
                    name={phonebookEntry.name}
                    lastname={phonebookEntry.lastname}
                    contact={phonebookEntry.contact}
                    onUpdated={this.props.onContactUpdated}
                  />

                  <button>edit</button>

                  <button
                    onClick={() =>
                      this.props.onContactRemoved(phonebookEntry.id)
                    }>
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { storedPhonebook: state.phoneBook };
};

const mapDispatchToProps = dispatch => {
  return {
    onContactAdded: (contact, reset) => {
      dispatch(actions.processAddContact(contact));
      reset();
    },

    onContactRemoved: id => dispatch(actions.processRemoveContact(id)),

    onContactUpdated: contact => {
      dispatch(actions.processUpdateContact(contact));
    },

    onFetchContacts: () => {
      dispatch(actions.fetchContacts());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdminPhonebook);
