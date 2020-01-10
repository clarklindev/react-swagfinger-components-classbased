//react
import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

//js
import Layout from './hoc/Layout/Layout';
//components
import Phonebook from './components/Phonebook/Phonebook';
import ContactRead from './components/Phonebook/Contact/ContactRead';
//containers
import Auth from './containers/Auth/Auth';
import PhonebookAdmin from './containers/PhonebookAdmin/PhonebookAdmin';
import ContactCreate from './containers/ContactAdmin/ContactCreate';
import ContactUpdate from './containers/ContactAdmin/ContactUpdate';

//scss
import './App.scss';
import './sass-flexbox-grid.scss';

class App extends Component {
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

            <Route path='/login' component={Auth} />
            {/* <Route path="/" exact component={Auth} /> */}
            <Redirect from='/' to='/phonebookadmin' />
          </Switch>
        </div>
      </Layout>
    );
  }
}

export default App;
