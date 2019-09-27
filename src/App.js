import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
//js

import './App.scss';
import * as actions from './store/actions/index';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
import Phonebook from './containers/Phonebook/Phonebook';
import AdminPhonebook from './containers/AdminPhonebook/AdminPhonebook';
import Auth from './containers/Auth/Auth';
import ContactAdmin from './components/Contact/ContactAdmin';

class App extends Component {
  render() {
    return (
      <Layout>
        <div className="App">
          <Switch>
            <Route path="/phonebook" component={Phonebook} />
            <Route path="/phonebookadmin" component={AdminPhonebook} />
            <Route
              path={'/addcontact'}
              render={props => (
                <ContactAdmin
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
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
