//react
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//js
import Layout from './hoc/Layout/Layout';
//containers
import Home from './containers/Home/Home';
import Login from './containers/Auth/Login';
import Logout from './containers/Auth/Logout';

import Phonebook from './containers/Phonebook/Phonebook';
import PhonebookAdmin from './containers/Phonebook/PhonebookAdmin';

import ProfileRead from './containers/Profile/ProfileRead';
import ProfileCreateOrUpdate from './containers/Profile/ProfileCreateOrUpdate';

import Appointment from './containers/Appointment/Appointment.js';
import Faq from './containers/Faq/Faq';

//actions
import * as actions from './store/actions/index';
//scss
import './App.scss';
import './sass-flexbox-grid.scss';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
    this.props.fetchProfilesHandler();
  }
  componentWillUnmount() {
    this.props.fetchProfilesCancelHandler();
  }

  render() {
    const unauthenticatedRoutes = (
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/profileread' component={ProfileRead} />
        <Route path='/faq' component={Faq} />
        <Route path='/' exact component={Home} />
        <Redirect to='/' />
      </Switch>
    );

    const authenticatedRoutes = (
      <Switch>
        <Route path='/logout' component={Logout} />
        <Route path='/faq' component={Faq} />
        <Route path='/appointment' component={Appointment} />

        <Route path='/phonebook' component={Phonebook} />
        <Route path='/phonebookadmin' component={PhonebookAdmin} />

        <Route path='/profileread' component={ProfileRead} />
        <Route path='/profileupdate' component={ProfileCreateOrUpdate} />
        <Route path='/profilecreate' component={ProfileCreateOrUpdate} />

        <Route path='/' exact component={PhonebookAdmin} />
        <Redirect to='/' />
      </Switch>
    );

    const routes = this.props.isAuthenticated
      ? authenticatedRoutes
      : unauthenticatedRoutes;

    return (
      <Layout>
        <div className='App'>{routes}</div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    fetchProfilesHandler: () => {
      dispatch(actions.processFetchProfiles());
    },
    fetchProfilesCancelHandler: () => {
      dispatch(actions.processFetchProfilesCancel());
    },
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
