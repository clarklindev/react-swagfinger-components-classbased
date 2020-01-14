import React, { Component } from 'react';
import Contact from '../Contact/Contact';
import classes from './Phonebook.module.scss';
import { connect } from 'react-redux';

import Utils from '../../Utils';
import { Link } from 'react-router-dom';
import SearchFilter from '../../components/UI/InputComponents/SearchFilter';
import PropTypes from 'prop-types';
import InputContext from '../../context/InputContext';
import * as actions from '../../store/actions/index';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';

class Phonebook extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Phonebook,
      Phonebook.name,
      this.props.className
    ]);
  }

  state = {
    filterText: ''
  };
  componentDidMount() {
    this.props.onFetchContacts();
  }

  searchClearHandler = () => {
    this.setState({ filterText: '' });
  };

  searchChangedHandler = (event) => {
    //match string
    console.log('input:', event.target.value);
    this.setState({ filterText: event.target.value });
  };

  //highlighting - matching regular expression (useful for search matching)
  //wraps <span> around reg expression matched string
  regMatch = (str, regex) => {
    return str.replace(regex, (str) => `<span>${str}</span>`);
  };

  render() {
    let cleanedUpSearchText = this.state.filterText
      .replace(/\\/gi, '') //replace \ with empty
      .replace(/\./gi, '\\.'); //replace . with \.

    let regex = new RegExp(cleanedUpSearchText, 'gi');

    let filtered = this.props.storedPhonebook
      .filter(({ name, lastname, contactnumbers, emails }) => {
        let combinedString = `${name} ${lastname}`
          .toLowerCase()
          .includes(this.state.filterText.toLowerCase());

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
            : `${name} ${lastname}`; //else just show normal name+lastname string

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
        if (emailsString !== undefined && this.state.filterText.length > 0) {
          matchedEmail = this.regMatch(emailsString, regex);
          extra = matchedEmail;
        }
        return (
          <div className={classes.ContactWrapper}>
            <Link
              key={`${id}`}
              to={{
                pathname: '/contactread',
                search: `?id=${id}`
              }}>
              <Contact
                id={`${id}`}
                displayText={entry}
                extraText={extra}></Contact>
            </Link>
          </div>
        );
      });

    return (
      <div className={classes.Phonebook}>
        <DefaultPageLayout label='Phonebook'>
          <InputContext.Provider
            value={{
              changed: (event) => this.searchChangedHandler(event),
              clear: this.searchClearHandler
            }}>
            <SearchFilter value={this.state.filterText} />
          </InputContext.Provider>
          <ComponentFactory
            data={{
              label: 'Contacts',
              elementtype: 'list',
              value: { data: filtered }
            }}
          />
        </DefaultPageLayout>
      </div>
    );
  }
}

Phonebook.propTypes = {
  storedPhonebook: PropTypes.array
};

const mapStateToProps = (state) => {
  return { storedPhonebook: state.contact.phoneBook };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onFetchContacts: () => {
      dispatch(actions.fetchContacts());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Phonebook);
