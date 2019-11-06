import React, { Component } from 'react';

// font awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  faEdit,
  faTrashAlt as farFaTrashAlt
} from '@fortawesome/free-regular-svg-icons';

import { Route, Switch, Redirect } from 'react-router-dom';
//js

import './App.scss';
import './sass-flexbox-grid.scss';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
//components
import Phonebook from './components/Phonebook/Phonebook';
import ContactRead from './components/Phonebook/Contact/ContactRead';
//containers
import Auth from './containers/Auth/Auth';
import PhonebookAdmin from './containers/PhonebookAdmin/PhonebookAdmin';
import ContactCreate from './containers/ContactAdmin/ContactCreate';
import ContactUpdate from './containers/ContactAdmin/ContactUpdate';

//add to fontawesome lib
library.add(faEdit, farFaTrashAlt, faPlus);

class App extends Component {
  componentDidMount() {
    this.props.onFetchContacts();
  }

  render() {
    return (
      <Layout>
        <div className="App">
          <Switch>
            {/* default route */}
            <Route
              path="/phonebook"
              render={props => (
                <Phonebook
                  {...props}
                  storedPhonebook={this.props.storedPhonebook}
                />
              )}
            />

            <Route
              path="/contactread"
              render={props => <ContactRead {...props} />}
            />

            <Route path="/phonebookadmin" component={PhonebookAdmin} />

            <Route
              path="/contactcreate"
              render={props => (
                <ContactCreate
                  {...props}
                  onContactAdded={this.props.onContactAdded}
                />
              )}
            />

            <Route
              path="/contactupdate"
              render={props => (
                <ContactUpdate
                  {...props}
                  onContactUpdated={this.props.onContactUpdated}
                />
              )}
            />
            <Route path="/auth" component={Auth} />

            <Redirect from="/" to="/phonebook" />
            {/* <Route path="/" exact component={Auth} /> */}
          </Switch>
        </div>
      </Layout>
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

    onContactUpdated: (contact, reset) => {
      dispatch(actions.processUpdateContact(contact));
      reset();
    },

    onFetchContacts: () => {
      dispatch(actions.fetchContacts());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
