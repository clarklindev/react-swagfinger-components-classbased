import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import Contact from '../../components/Phonebook/Contact/Contact';

import classes from './PhonebookAdmin.module.scss';
import Utils from '../../Utils';
import SearchFilter from '../SearchFilter/SearchFilter';
import SectionHeader from '../../components/UI/Headers/SectionHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class PhonebookAdmin extends Component {
  state = {
    filterText: ''
  };

  searchChangedHandler = event => {
    //match string
    console.log('input:', event.target.value);
    this.setState({ filterText: event.target.value });
  };

  //highlighting - matching regular expression (useful for search matching)
  regMatch = (str, regex) => {
    return str.replace(regex, str => `<span>${str}</span>`);
  };

  componentDidMount() {
    this.props.onFetchContacts();
  }

  editContactHandler = id => {
    console.log('clicked id: ', id);
    //navigate programatically
    this.props.history.push({
      pathname: `/contactupdate`,
      search: `?id=${id}`
    });
  };

  render() {
    let filtered = this.props.storedPhonebook
      .filter(item => {
        let combinedString = `${item.name} ${item.lastname}`; //same as html presentation
        return combinedString
          .toLowerCase()
          .includes(this.state.filterText.toLowerCase()); //match filterText
      })
      //all that match..return an <li> element
      .map(phonebookEntry => {
        let regex = new RegExp(this.state.filterText, 'gi'); //global and case-insensitive

        let entry =
          this.state.filterText.length > 0
            ? this.regMatch(
                `${phonebookEntry.name} ${phonebookEntry.lastname}`,
                regex
              )
            : `${phonebookEntry.name} ${phonebookEntry.lastname}`;

        return (
          <li key={phonebookEntry.id}>
            <Contact
              id={phonebookEntry.id}
              displayText={entry}
              onUpdated={this.props.onContactUpdated}
            />

            <div className={classes.ContactButtons}>
              <button
                title="Edit"
                onClick={this.editContactHandler.bind(this, phonebookEntry.id)}>
                <FontAwesomeIcon icon={['far', 'edit']} />
              </button>

              <button
                title="Delete"
                onClick={this.props.onContactRemoved.bind(
                  this,
                  phonebookEntry.id
                )}>
                <FontAwesomeIcon icon={['far', 'trash-alt']} />
              </button>
            </div>
          </li>
        );
      });
    const className = Utils.getClassNameString([
      classes.PhonebookAdmin,
      PhonebookAdmin.name,
      this.props.className
    ]);

    return (
      <div className={className}>
        <div className="container">
          <div className={[classes.Wrapper, 'container'].join(' ')}>
            <div className="row">
              <div className="col">
                <SectionHeader>Phonebook Admin</SectionHeader>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <SearchFilter changed={this.searchChangedHandler} />
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className={classes.Labeledgroup}>
                  <label>Contacts</label>
                  <Link
                    to={{
                      pathname: '/contactcreate'
                    }}
                    style={{
                      textDecoration: 'none',
                      color: 'black'
                    }}>
                    <button title="Add">
                      <FontAwesomeIcon icon={['fas', 'plus']} /> Add Contact
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <ul>{filtered}</ul>
              </div>
            </div>
          </div>
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
)(PhonebookAdmin);
