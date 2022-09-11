import React, { Component } from 'react';
import ListItem from '../../components/UI/InputComponents/ListItem';
import classes from './Phonebook.module.scss';
import * as align from '../../shared/alignFlex';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';
import InputContext from '../../context/InputContext';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import Spinner from '../../components/UI/Loaders/Spinner';
import Card from '../../components/UI/Card/Card';

class Phonebook extends Component {
  state = {
    filterText: '',
  };

  searchClearHandler = () => {
    this.setState({ filterText: '' });
  };

  profileClickHandler = (id, event) => {
    //navigate programatically
    // this.props.history.push({
    //   pathname: `/profileread`,
    //   search: `?id=${id}`,
    // });
    window.open(`/profileread?id=${id}`, '_blank');
  };

  searchChangedHandler = (type, name, newVal) => {
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

    let filtered = null;
    filtered =
      this.props.storedPhonebook !== undefined
        ? this.props.storedPhonebook
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
              if (
                emailsString !== undefined &&
                this.state.filterText.length > 0
              ) {
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
                  align={align.alignSelf('flex-start')}
                  onClick={(event) =>
                    this.profileClickHandler(id, event)
                  }></ListItem>
              );
            })
        : null;

    return (
      <div className={classes.Phonebook}>
        {this.props.isLoading ? (
          <Spinner />
        ) : (
          <DefaultPageLayout label='Phonebook'>
            <Card style={['Padding']}>
              <InputContext.Provider
                value={{
                  changed: this.searchChangedHandler, //newval, name, index
                  clear: this.searchClearHandler,
                }}>
                <ComponentFactory
                  data={{
                    label: 'Search',
                    component: 'inputsearch',
                    value: this.state.filterText,
                  }}
                />
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

const mapStateToProps = (state) => {
  return {
    storedPhonebook: state.profile.phoneBook,
    isLoading: state.profile.loading,
  };
};

Phonebook.propTypes = {
  storedPhonebook: PropTypes.array,
};

export default connect(mapStateToProps)(Phonebook);
