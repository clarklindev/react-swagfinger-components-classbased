import React, { Component } from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../../store/actions/index';
import Contact from '../../components/Phonebook/Contact/Contact';

import classes from './AdminPhonebook.module.scss';
import Utils from '../../Utils';
import SearchFilter from '../../containers/SearchFilter/SearchFilter';
import SectionHeader from '../../components/UI/Headers/SectionHeader';

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
      pathname: `/editcontact`,
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
                onClick={this.editContactHandler.bind(this, phonebookEntry.id)}>
                Edit
              </button>

              <button
                onClick={this.props.onContactRemoved.bind(
                  this,
                  phonebookEntry.id
                )}>
                Delete
              </button>
            </div>
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
        <div className="container">
          <div className={[classes.Wrapper, 'container'].join(' ')}>
            <div class="row">
              <div class="col">
                <SectionHeader>Phonebook Admin</SectionHeader>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <SearchFilter changed={this.searchChangedHandler} />
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div className={classes.Labeledgroup}>
                  <label>Contacts</label>
                  <Link
                    to={{
                      pathname: '/addcontact'
                    }}
                    style={{
                      textDecoration: 'none',
                      color: 'black'
                    }}>
                    <button>add contact</button>
                  </Link>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
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
)(AdminPhonebook);
