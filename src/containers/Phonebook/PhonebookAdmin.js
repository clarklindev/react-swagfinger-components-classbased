import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import classes from './PhonebookAdmin.module.scss';
import {justifyContent, alignItems, alignContent, alignSelf} from '../../shared/alignFlex';

import * as actions from '../../store/actions/index';
import InputContext from '../../context/InputContext';

import DefaultPageLayout from '../../hoc/DefaultPageLayout/DefaultPageLayout';
import Card from '../../components/UI/Card/Card';
import ComponentFactory from '../../components/UI/InputComponents/ComponentFactory';
import ListItem from '../../components/UI/InputComponents/ListItem';
import Icon from '../../components/UI/InputComponents/Icon';
import Spinner from '../../components/UI/Loaders/Spinner';
import Button from '../../components/UI/Button/Button';
import FlexRow from '../../hoc/Layout/FlexRow';

class PhonebookAdmin extends PureComponent {
  state = {
    filterText: '',
  };

  componentDidMount() {
    this.props.onResetId();
  }

  searchClearHandler = () => {
    this.setState({ filterText: '' });
  };

  searchChangedHandler = (type, name, newVal) => {
    console.log('searchChangedHandler:', newVal);
    this.setState({ filterText: newVal });
  };

  //highlighting - matching regular expression (useful for search matching)
  regMatch = (str, regex) => {
    return str.replace(regex, (str) => `<span>${str}</span>`);
  };

  addProfileHandler = () => {
    console.log('FUNCTION addProfileHandler');
    this.props.onProfileAdd(this.props.history);
  };

  editProfileHandler = (id) => {
    console.log('FUNCTION editProfileHandler');
    console.log('clicked id: ', id);
    this.props.onProfileEdit(this.props.history, id);
  };

  deleteProfileHandler = (token, id) => {
    console.log('FUNCTION deleteProfileHandler');
    this.props.onProfileDelete(token, id);
  };

  render() {
    const { storedPhonebook, token, isLoading } = this.props;
    const { filterText } = this.state;

    let cleanedUpSearchText = filterText
      .replace(/\\/gi, '') //replace \ with empty
      .replace(/\./gi, '\\.'); //replace . with \.

    let regex = new RegExp(cleanedUpSearchText, 'gi'); //global and case-insensitive

    let filtered = null;
    filtered =
      storedPhonebook !== undefined
        ? storedPhonebook
            .filter(({ name, lastname, contactnumbers, emails }) => {
              let combinedString = `${name} ${lastname}` //same as html presentation
                .toLowerCase()
                .includes(filterText.toLowerCase()); //match filterText

              let contactnumberString = contactnumbers.find((each) => {
                return each.includes(filterText.toLowerCase());
              });

              let emailsString = emails.find((each) => {
                return each.includes(filterText.toLowerCase());
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
                return each.includes(filterText.toLowerCase());
              });

              let emailsString = emails.find((each) => {
                return each.includes(filterText.toLowerCase());
              });

              let entry =
                filterText.length > 0
                  ? this.regMatch(`${name} ${lastname}`, regex)
                  : `${name} ${lastname}`;

              let extra = null;
              let matchedNumber = null;
              if (contactnumberString !== undefined && filterText.length > 0) {
                matchedNumber = this.regMatch(contactnumberString, regex);
                extra = matchedNumber;
              }

              let matchedEmail = null;
              if (emailsString !== undefined && filterText.length > 0) {
                matchedEmail = this.regMatch(emailsString, regex);
                extra = matchedEmail;
              }

              return (
                <ListItem
                  key={id}
                  id={id}
                  displayText={entry}
                  extraText={extra}
                  align={justifyContent('flex-start')}>
                  <div className={classes.ProfileButtons}>
                    <Button
                      type='WithBorder'
                      title='Edit'
                      onClick={this.editProfileHandler.bind(this, id)}>
                      <Icon iconstyle='far' code='edit' size='sm' />
                    </Button>

                    <Button
                      type='WithBorder'
                      title='Delete'
                      onClick={this.deleteProfileHandler.bind(this, token, id)}>
                      <Icon iconstyle='far' code='trash-alt' size='sm' />
                    </Button>
                  </div>
                </ListItem>
              );
            })
        : null;

    return (
      <div className={classes.PhonebookAdmin}>
        {isLoading ? (
          <Spinner />
        ) : (
          <DefaultPageLayout label='Phonebook Admin'>
            <Card style={['Padding']}>
              <InputContext.Provider
                value={{
                  changed: this.searchChangedHandler,
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
                  component: 'list',
                  label: 'Contacts',
                  value: { data: filtered },
                }}
              />
              <FlexRow>
                <Button
                  type='WithBorder'
                  className='FlexGrow'
                  title='Add'
                  onClick={this.addProfileHandler}>
                  <Icon iconstyle='fas' code='plus' size='sm' />
                  <p>Add Profile</p>
                </Button>
              </FlexRow>
            </Card>
          </DefaultPageLayout>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    //profile
    storedPhonebook: state.profile.phoneBook,
    isLoading: state.profile.loading,
    //auth
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onResetId: () => {
      console.log('mapDispatchToProps: onResetId');
      dispatch(actions.processResetId());
    },

    onProfileAdd: (history) => {
      //redirect
      history.push('profilecreate');
    },

    onProfileEdit: (history, id) => {
      //redirect
      history.push({
        pathname: `/profileupdate`,
        search: `?id=${id}`,
      });
    },

    onProfileDelete: (token, id) => {
      dispatch(actions.processProfileDelete(token, id));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PhonebookAdmin);
