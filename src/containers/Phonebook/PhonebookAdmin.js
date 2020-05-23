import React, { Component } from 'react';
import { connect } from 'react-redux';

import ListItem from '../../components/UI/InputComponents/ListItem';
import * as actions from '../../store/actions/index';

import classes from './PhonebookAdmin.module.scss';
import Utils from '../../Utils';
import SearchFilter from '../../components/UI/InputComponents/SearchFilter';
import Icon from '../../components/UI/InputComponents/Icon';
import InputContext from '../../context/InputContext';
import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import Spinner from '../../components/UI/Loaders/Spinner';
import Button from '../../components/UI/Button/Button';
import Card from '../../components/UI/Card/Card';

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

  searchClearHandler = () => {
    this.setState({ filterText: '' });
  };
  searchChangedHandler = (newVal, name, index = null) => {
    console.log('searchChangedHandler:', newVal);
    this.setState({ filterText: newVal });
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

              //console.log('contact numbers: ', contactnumberString);
              //console.log('email numbers: ', emailsString);

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
                // ContactWrapper wraps each item in this.props.storedPhonebook
                <ListItem
                  key={id}
                  id={id}
                  displayText={entry}
                  extraText={extra}>
                  <div className={classes.ContactButtons}>
                    <Button
                      type='WithBorder'
                      title='Edit'
                      onClick={this.editContactHandler.bind(this, id)}>
                      <Icon iconstyle='far' code='edit' size='sm' />
                    </Button>

                    <Button
                      type='WithBorder'
                      title='Delete'
                      onClick={this.props.onContactDeleted.bind(
                        this,
                        this.props.token,
                        id
                      )}>
                      <Icon iconstyle='far' code='trash-alt' size='sm' />
                    </Button>
                  </div>
                </ListItem>
              );
            })
        : null;

    return (
      <div className={classes.PhonebookAdmin}>
        {this.props.isLoading ? (
          <Spinner />
        ) : (
          <DefaultPageLayout label='Phonebook Admin'>
            <Card>
              <InputContext.Provider
                value={{
                  changed: this.searchChangedHandler,
                  clear: this.searchClearHandler
                }}>
                <SearchFilter value={this.state.filterText} />
              </InputContext.Provider>
              <ComponentFactory
                data={{
                  component: 'list',
                  label: 'Contacts',
                  value: { data: filtered }
                }}
              />
              <Button
                type='WithBorder'
                title='Add'
                onClick={() => {
                  this.props.history.push('contactcreate');
                }}>
                <Icon iconstyle='fas' code='plus' size='sm' />
                <p>Add Contact</p>
              </Button>
            </Card>
          </DefaultPageLayout>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    storedPhonebook: state.contact.phoneBook,
    isLoading: state.contact.loading,
    token: state.auth.token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onContactDeleted: (token, id) => {
      dispatch(actions.processContactDelete(token, id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhonebookAdmin);
