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
import Formbuilder from './containers/Formbuilder/Formbuilder';
import Phonebook from './containers/Phonebook/Phonebook';
import PhonebookAdmin from './containers/Phonebook/PhonebookAdmin';
import ProfileRead from './containers/Profile/ProfileRead';
import ProfileCreateOrUpdate from './containers/Profile/ProfileCreateOrUpdate';
import Faq from './containers/Faq/Faq';

//actions
import * as actions from './store/actions/index';
//scss
import './App.scss';
import './sass-flexbox-grid.scss';

class App extends Component {
  componentDidMount() {
    // this.props.onTryAutoSignin();
    this.props.loadDefaults();
  }

  render() {
    const unauthenticatedRoutes = (
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/faq' component={Faq} />
        <Route path='/phonebook' component={Phonebook} /> 
        {/* should be authenticated routes */}
        <Route path='/formbuilder' component={Formbuilder} />
        {/* <Route path='/phonebookadmin' component={PhonebookAdmin} />   */}
        {/* profile */}
        <Route path='/profileread' component={ProfileRead} />
        {/* <Route path='/profileupdate' component={ProfileCreateOrUpdate} /> */}
        {/* <Route path='/profilecreate' component={ProfileCreateOrUpdate} /> */}
        <Route path='/' exact component={Phonebook} /> {/*  default */}
  
        <Redirect to='/' />
      </Switch>
    );

    const authenticatedRoutes = (
      <Switch>
        <Route path='/formbuilder' component={Formbuilder} />
        <Route path='/logout' component={Logout} /> 

        <Route path='/phonebook' component={Phonebook} />
        <Route path='/phonebookadmin' component={PhonebookAdmin} />

        <Route path='/profileread' component={ProfileRead} />
        <Route path='/profileupdate' component={ProfileCreateOrUpdate} />
        <Route path='/profilecreate' component={ProfileCreateOrUpdate} />

        <Route path='/' exact component={Phonebook} />
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
    //onTryAutoSignin: () => dispatch(actions.authCheckState()), /** ./actions/auth.js */

    loadDefaults: () => {
      dispatch(actions.processFetchProfiles()); //redux => props.phoneBook
    },
    // fetchProfilesCancelHandler: () => {
    //   dispatch(actions.processFetchProfilesCancel());
    // },
  };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
