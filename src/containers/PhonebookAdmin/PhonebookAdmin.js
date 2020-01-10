import React, { Component } from 'react';
import { connect } from 'react-redux';

import Contact from '../../components/Phonebook/Contact/Contact';
import * as actions from '../../store/actions/index';

import classes from './PhonebookAdmin.module.scss';
import Utils from '../../Utils';
import SearchFilter from '../SearchFilter/SearchFilter';
import SectionHeader from '../../components/UI/Headers/SectionHeader';
import Icon from '../../components/UI/InputComponents/Icon';

class PhonebookAdmin extends Component {
  constructor(props) {
    super(props);
    this.className = Utils.getClassNameString([
      classes.PhonebookAdmin,
      PhonebookAdmin.name,
      this.props.className
    ]);
  }

  state = {
    filterText: ''
  };

  componentDidMount() {
    this.props.onFetchContacts();
  }

  searchChangedHandler = (event) => {
    //match string
    console.log('input:', event.target.value);
    this.setState({ filterText: event.target.value });
  };

  //highlighting - matching regular expression (useful for search matching)
  regMatch = (str, regex) => {
    return str.replace(regex, (str) => `<span>${str}</span>`);
  };

  editContactHandler = (id) => {
    console.log('clicked id: ', id);
    //navigate programatically
    this.props.history.push({
      pathname: `/contactupdate`,
      search: `?id=${id}`
    });
  };

  render() {
    let cleanedUpSearchText = this.state.filterText
      .replace(/\\/gi, '') //replace \ with empty
      .replace(/\./gi, '\\.'); //replace . with \.

    let regex = new RegExp(cleanedUpSearchText, 'gi'); //global and case-insensitive

    let filtered = null;
    filtered =
      this.props.storedPhonebook !== undefined
        ? this.props.storedPhonebook
            .filter(({ name, lastname, contactnumbers, emails }) => {
              let combinedString = `${name} ${lastname}` //same as html presentation
                .toLowerCase()
                .includes(this.state.filterText.toLowerCase()); //match filterText

              let contactnumberString = contactnumbers.find((each) => {
                return each.includes(this.state.filterText.toLowerCase());
              });

              let emailsString = emails.find((each) => {
                return each.includes(this.state.filterText.toLowerCase());
              });

              return (
                combinedString === true ||
                contactnumberString !== undefined ||
                emailsString !== undefined
              );
            })
            .sort((a, b) => {
              return a.name.localeCompare(b.name);
            })
            //all that match..return an <li> element
            .map(({ id, name, lastname, contactnumbers, emails }) => {
              // at this stage every phonebookEntry contains a match from filterText

              let contactnumberString = contactnumbers.find((each) => {
                return each.includes(this.state.filterText.toLowerCase());
              });

              let emailsString = emails.find((each) => {
                return each.includes(this.state.filterText.toLowerCase());
              });

              console.log('contact numbers: ', contactnumberString);
              console.log('email numbers: ', emailsString);

              let entry =
                this.state.filterText.length > 0
                  ? this.regMatch(`${name} ${lastname}`, regex)
                  : `${name} ${lastname}`;

              let extra = null;
              let matchedNumber = null;
              if (
                contactnumberString !== undefined &&
                this.state.filterText.length > 0
              ) {
                matchedNumber = this.regMatch(contactnumberString, regex);
                extra = matchedNumber;
              }

              let matchedEmail = null;
              if (
                emailsString !== undefined &&
                this.state.filterText.length > 0
              ) {
                matchedEmail = this.regMatch(emailsString, regex);
                extra = matchedEmail;
              }

              return (
                <li key={id}>
                  <Contact id={id} displayText={entry} extraText={extra} />

                  <div className={classes.ContactButtons}>
                    <button
                      title='Edit'
                      onClick={this.editContactHandler.bind(this, id)}>
                      <Icon iconstyle='far' code='edit' size='sm' />
                    </button>

                    <button
                      title='Delete'
                      onClick={this.props.onContactDeleted.bind(this, id)}>
                      <Icon iconstyle='far' code='trash-alt' size='sm' />
                    </button>
                  </div>
                </li>
              );
            })
        : null;

    return (
      <div className={this.className}>
        <div className='container'>
          <div className={[classes.Wrapper, 'container'].join(' ')}>
            <div className='row'>
              <div className='col'>
                <SectionHeader>Phonebook Admin</SectionHeader>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <SearchFilter
                  value={this.state.filterText}
                  changed={this.searchChangedHandler}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <div className={classes.Labeledgroup}>
                  <label>Contacts</label>
                  {/* react 16.8+, react-router 5, no need for withRouter*/}
                </div>
              </div>
            </div>
            <div className='row'>
              <div className='col'>
                <ul>{filtered}</ul>
              </div>
            </div>
            <button
              title='Add'
              onClick={() => {
                this.props.history.push('contactcreate');
              }}
              className={classes.AddButton}>
              <Icon iconstyle='fas' code='plus' size='sm' />
              <p>Add Contact</p>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { storedPhonebook: state.phoneBook };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onContactDeleted: (id) => {
      dispatch(actions.processContactDelete(id));
    },
    onFetchContacts: () => {
      dispatch(actions.fetchContacts());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhonebookAdmin);
