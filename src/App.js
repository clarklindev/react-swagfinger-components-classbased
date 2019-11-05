import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
//js

import './App.scss';
import './sass-flexbox-grid.scss';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
import Auth from './containers/Auth/Auth';
import AdminPhonebook from './containers/AdminPhonebook/AdminPhonebook';
import Phonebook from './components/Phonebook/Phonebook';
import AdminContact from './containers/AdminContact/AddContact';
import ViewContact from './components/Phonebook/Contact/ViewContact';
import EditContact from './containers/AdminContact/EditContact';

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
              path="/viewcontact"
              render={props => <ViewContact {...props} />}
            />

            <Route path="/phonebookadmin" component={AdminPhonebook} />

            <Route
              path="/addcontact"
              render={props => (
                <AdminContact
                  {...props}
                  onContactAdded={this.props.onContactAdded}
                />
              )}
            />

            <Route
              path="/editcontact"
              render={props => (
                <EditContact
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
