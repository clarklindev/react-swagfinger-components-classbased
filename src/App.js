import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
//js

import './App.scss';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
import Auth from './containers/Auth/Auth';
import AdminPhonebook from './containers/AdminPhonebook/AdminPhonebook';
import Phonebook from './components/Phonebook/Phonebook';
import AdminContact from './containers/AdminContact/AdminContact';
import ViewContact from './components/Phonebook/Contact/ViewContact';

class App extends Component {
  componentDidMount() {
    this.props.onFetchContacts();
  }

  render() {
    return (
      <Layout>
        <div className="App">
          <Switch>
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
            <Route path="/auth" component={Auth} />
            <Route path="/" exact component={Auth} />
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

    onFetchContacts: () => {
      dispatch(actions.fetchContacts());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
