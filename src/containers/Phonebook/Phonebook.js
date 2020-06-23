import React, { Component } from 'react';
import ListItem from '../../components/UI/InputComponents/ListItem';
import classes from './Phonebook.module.scss';
import * as styles from '../../shared/align.module.scss';
import { connect } from 'react-redux';

import Utils from '../../Utils';
import SearchFilter from '../../components/UI/InputComponents/SearchFilter';
import PropTypes from 'prop-types';
import InputContext from '../../context/InputContext';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import Spinner from '../../components/UI/Loaders/Spinner';
import Card from '../../components/UI/Card/Card';

class Phonebook extends Component {
  constructor(props) {
    super(props);

    this.className = Utils.getClassNameString([
      classes.Phonebook,
      Phonebook.name,
      this.props.className,
    ]);
  }

  state = {
    filterText: '',
  };

  searchClearHandler = () => {
    this.setState({ filterText: '' });
  };

  contactClickHandler = (id, event) => {
    //navigate programatically
    this.props.history.push({
      pathname: `/contactread`,
      search: `?id=${id}`,
    });
  };

  searchChangedHandler = (newVal, name, index = null) => {
    console.log('searchChangedHandler:', newVal);
    this.setState({ filterText: newVal });
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
        //console.log('contact numbers: ', contactnumberString);
        //console.log('email numbers: ', emailsString);
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
          <ListItem
            className={classes.ListItem}
            key={`${id}`}
            id={`${id}`}
            hovereffect={true}
            displayText={entry}
            extraText={extra}
            aligntype={styles.FlexStart}
            onClick={(event) => this.contactClickHandler(id, event)}
          ></ListItem>
        );
      });

    return (
      <div className={classes.Phonebook}>
        {this.props.isLoading ? (
          <Spinner />
        ) : (
          <DefaultPageLayout label='Phonebook'>
            <Card>
              <InputContext.Provider
                value={{
                  changed: this.searchChangedHandler, //newval, name, index
                  clear: this.searchClearHandler,
                }}
              >
                <SearchFilter value={this.state.filterText} />
              </InputContext.Provider>
              <ComponentFactory
                data={{
                  label: 'Contacts',
                  component: 'list',
                  value: { data: filtered },
                }}
              />
            </Card>
          </DefaultPageLayout>
        )}
      </div>
    );
  }
}

Phonebook.propTypes = {
  storedPhonebook: PropTypes.array,
};

const mapStateToProps = (state) => {
  return {
    storedPhonebook: state.contact.phoneBook,
    isLoading: state.contact.loading,
  };
};

export default connect(mapStateToProps)(Phonebook);
