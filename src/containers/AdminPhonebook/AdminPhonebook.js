import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import Contact from '../../components/Phonebook/Contact/Contact';

import classes from './AdminPhonebook.module.scss';
import Utils from '../../Utils';
import SearchFilter from '../../containers/SearchFilter/SearchFilter';

class AdminPhonebook extends Component {
  state = {
    filterText: ''
  };

  searchChangedHandler = event => {
    //match string
    console.log('input:', event.target.value);
    this.setState({ filterText: event.target.value });
  };

  //highlighting - matching regular expression (useful for search matching)
  output = (str, regex) => {
    return str.replace(regex, str => `<span>${str}</span>`);
  };

  componentDidMount() {
    this.props.onFetchContacts();
  }

  editContactHandler = id => {
    console.log('clicked id: ', id);
    //navigate programatically
    this.props.history.push({
      pathname: `/editcontact`,
      search: `?id=${id}`
    });
  };

  render() {
    let filtered = this.props.storedPhonebook
      .filter(item => {
        let combinedString = `${item.name} ${item.lastname}`;
        return combinedString.includes(this.state.filterText);
      })
      .map(phonebookEntry => {
        let regex = new RegExp(this.state.filterText, 'gi');

        let entry =
          this.state.filterText.length > 0
            ? this.output(
                `${phonebookEntry.name} ${phonebookEntry.lastname}`,
                regex
              )
            : `${phonebookEntry.name} ${phonebookEntry.lastname}`;

        return (
          <li className={classes.Li} key={phonebookEntry.id}>
            <Contact
              id={phonebookEntry.id}
              displayText={entry}
              onUpdated={this.props.onContactUpdated}
            />

            <button
              onClick={this.editContactHandler.bind(this, phonebookEntry.id)}>
              edit
            </button>

            <button
              onClick={this.props.onContactRemoved.bind(
                this,
                phonebookEntry.id
              )}>
              Delete
            </button>
          </li>
        );
      });
    const className = Utils.getClassNameString([
      classes.AdminPhonebook,
      AdminPhonebook.name,
      this.props.className
    ]);

    return (
      <div className={className}>
        <h1>Phonebook Admin</h1>
        <SearchFilter changed={this.searchChangedHandler} />

        <Link
          to={{
            pathname: '/addcontact'
          }}>
          Add Contact
        </Link>

        <div>
          <ul className={classes.Ul}>
            {console.log('here!!!: ', this.props.storedPhonebook)}
            {filtered}
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
