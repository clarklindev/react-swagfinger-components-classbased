//react
import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//js
import Layout from './hoc/Layout/Layout';
//components
import Phonebook from './containers/Phonebook/Phonebook';
import ContactRead from './containers/Contact/ContactRead';
//containers
import Auth from './containers/Auth/Auth';
import PhonebookAdmin from './containers/PhonebookAdmin/PhonebookAdmin';
import ContactCreate from './containers/ContactAdmin/ContactCreate';
import ContactUpdate from './containers/ContactAdmin/ContactUpdate';
import Logout from './containers/Auth/Logout/Logout';
import Faq from './containers/Faq/Faq';
//actions
import * as actions from './store/actions/index';
//scss
import './App.scss';
import './sass-flexbox-grid.scss';

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();
  }
  render() {
    return (
      <Layout>
        <div className='App'>
          <Switch>
            {/* default route */}
            <Route path='/phonebook' component={Phonebook} />
            <Route path='/contactread' component={ContactRead} />
            <Route path='/phonebookadmin' component={PhonebookAdmin} />
            <Route path='/contactupdate' component={ContactUpdate} />
            <Route path='/contactcreate' component={ContactCreate} />
            <Route path='/faq' component={Faq} />
            <Route path='/login' component={Auth} />
            <Route path='/logout' component={Logout} />
            {/* <Route path="/" exact component={Auth} /> */}
            <Redirect from='/' to='/phonebookadmin' />
          </Switch>
        </div>
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState())
  };
};
export default withRouter(connect(null, mapDispatchToProps)(App));
